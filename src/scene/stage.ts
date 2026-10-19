import {
  Clock,
  Color,
  PerspectiveCamera,
  Scene,
  Vector2,
  WebGLRenderer,
} from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';

export const CAMERA_Z = 10;
const FOV = 40;
export const BASE_BLOOM = 0.85;

export type Updatable = (dt: number, time: number) => void;

/**
 * Owns the renderer, camera and bloom pipeline, and drives the frame loop.
 * Measures frame rate early on and drops to a low quality mode on slow devices.
 */
export class Stage {
  readonly scene = new Scene();
  readonly camera = new PerspectiveCamera(FOV, 1, 0.1, 100);
  readonly renderer: WebGLRenderer;
  readonly bloom: UnrealBloomPass;
  /** Camera offset driven by screen shake. */
  readonly shake = new Vector2();
  lowQuality = false;
  onQualityDrop?: () => void;

  private composer: EffectComposer;
  private updatables = new Set<Updatable>();
  private clock = new Clock();
  private fpsSamples: number[] = [];
  private qualityCheckUntil = 8;

  constructor(canvas: HTMLCanvasElement) {
    this.renderer = new WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.scene.background = new Color(0x07060d);
    this.camera.position.set(0, 0, CAMERA_Z);

    this.composer = new EffectComposer(this.renderer);
    this.composer.addPass(new RenderPass(this.scene, this.camera));
    this.bloom = new UnrealBloomPass(new Vector2(1, 1), BASE_BLOOM, 0.6, 0.85);
    this.composer.addPass(this.bloom);
    this.composer.addPass(new OutputPass());

    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.renderer.setAnimationLoop(() => this.frame());
  }

  add(fn: Updatable): () => void {
    this.updatables.add(fn);
    return () => this.updatables.delete(fn);
  }

  /** World-space size of the visible area at depth `z`. */
  viewSize(z = 0): { w: number; h: number } {
    const h = 2 * Math.tan((FOV * Math.PI) / 360) * (CAMERA_Z - z);
    return { w: h * this.camera.aspect, h };
  }

  private resize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h, false);
    this.composer.setSize(w, h);
  }

  private frame() {
    const dt = Math.min(this.clock.getDelta(), 1 / 20);
    const time = this.clock.elapsedTime;
    this.trackFps(dt, time);
    for (const fn of this.updatables) fn(dt, time);
    this.camera.position.set(this.shake.x, this.shake.y, CAMERA_Z);
    if (this.lowQuality) this.renderer.render(this.scene, this.camera);
    else this.composer.render(dt);
  }

  private trackFps(dt: number, time: number) {
    if (this.lowQuality || time > this.qualityCheckUntil || time < 1.5) return;
    this.fpsSamples.push(dt);
    if (this.fpsSamples.length < 90) return;
    const avg = this.fpsSamples.reduce((a, b) => a + b, 0) / this.fpsSamples.length;
    this.fpsSamples = [];
    if (1 / avg < 40) {
      this.lowQuality = true;
      this.renderer.setPixelRatio(1);
      this.resize();
      this.onQualityDrop?.();
    }
  }
}
