import {
  AdditiveBlending,
  Color,
  Group,
  Mesh,
  MeshBasicMaterial,
  PlaneGeometry,
  type BufferAttribute,
} from 'three';
import { makeGlow } from './effects';
import { PACK_TEAR_LINE, PACK_TEX_H, PACK_TEX_W, beamTexture, packTexture } from './textures';

export const PACK_W = 2.6;
export const PACK_H = PACK_W * (PACK_TEX_H / PACK_TEX_W);
const TOP_H = PACK_H * PACK_TEAR_LINE;
/** Y of the tear line, relative to the Pack's centre. */
export const TEAR_Y = PACK_H / 2 - TOP_H;

function slicedPlane(w: number, h: number, v0: number, v1: number): PlaneGeometry {
  const geo = new PlaneGeometry(w, h);
  const uv = geo.attributes.uv as BufferAttribute;
  for (let i = 0; i < uv.count; i++) uv.setY(i, v0 + uv.getY(i) * (v1 - v0));
  return geo;
}

/**
 * The card Pack. Its glow colour is the Pack Hint; the top strip tears off along the perforation.
 * Hierarchy: root (placement) → floater (idle bob) → parts.
 */
export class PackView {
  readonly root = new Group();
  readonly floater = new Group();
  readonly body: Mesh;
  readonly top: Mesh;
  readonly seam: Mesh;
  readonly beam: Mesh;
  readonly glow = makeGlow(new Color(), 9);
  /** Current Pack Hint colour; tween it to change the hint. */
  readonly color = new Color();
  glowStrength = 0;
  tearProgress = 0;
  tearDirection = 1;
  torn = false;

  private bodyMat: MeshBasicMaterial;
  private topMat: MeshBasicMaterial;

  constructor() {
    const tex = packTexture();
    // Dimmed below the bloom threshold so the printed title stays readable.
    const tint = new Color(0.8, 0.8, 0.8);
    this.bodyMat = new MeshBasicMaterial({ map: tex, color: tint, transparent: true, alphaTest: 0.5 });
    this.topMat = new MeshBasicMaterial({ map: tex, color: tint, transparent: true, alphaTest: 0.5 });

    this.body = new Mesh(slicedPlane(PACK_W, PACK_H - TOP_H, 0, 1 - PACK_TEAR_LINE), this.bodyMat);
    this.body.position.y = -TOP_H / 2;
    this.top = new Mesh(slicedPlane(PACK_W, TOP_H, 1 - PACK_TEAR_LINE, 1), this.topMat);
    this.top.position.y = PACK_H / 2 - TOP_H / 2;

    this.seam = new Mesh(
      new PlaneGeometry(PACK_W, 0.07),
      new MeshBasicMaterial({ color: 0xffffff, blending: AdditiveBlending, transparent: true, depthWrite: false }),
    );
    this.seam.position.set(0, TEAR_Y, 0.01);
    this.seam.scale.x = 0.0001;

    const beamGeo = new PlaneGeometry(PACK_W * 1.25, 9);
    beamGeo.translate(0, 4.5, 0);
    this.beam = new Mesh(
      beamGeo,
      new MeshBasicMaterial({
        map: beamTexture(),
        blending: AdditiveBlending,
        transparent: true,
        depthWrite: false,
        opacity: 0,
      }),
    );
    this.beam.position.set(0, TEAR_Y, -0.02);
    this.beam.scale.y = 0.001;

    this.glow.position.z = -0.4;
    this.floater.add(this.glow, this.beam, this.body, this.top, this.seam);
    this.root.add(this.floater);
  }

  get beamMaterial(): MeshBasicMaterial {
    return this.beam.material as MeshBasicMaterial;
  }

  set opacity(value: number) {
    this.bodyMat.opacity = value;
    this.topMat.opacity = value;
  }

  get opacity(): number {
    return this.bodyMat.opacity;
  }

  update(time: number) {
    this.floater.position.y = Math.sin(time * 1.6) * 0.08;
    this.floater.rotation.z = Math.sin(time * 1.1) * 0.025;
    this.floater.rotation.y = Math.sin(time * 0.8) * 0.12;

    const pulse = 0.85 + Math.sin(time * 3) * 0.15;
    const glowMat = this.glow.material;
    glowMat.color.copy(this.color);
    glowMat.opacity = this.glowStrength * pulse * (1 + this.tearProgress * 0.6);
    (this.seam.material as MeshBasicMaterial).color.copy(this.color).multiplyScalar(2);
    this.beamMaterial.color.copy(this.color).multiplyScalar(1.5);

    if (!this.torn) {
      const p = this.tearProgress;
      this.seam.scale.x = Math.max(0.0001, p);
      this.seam.position.x = (this.tearDirection * (p - 1) * PACK_W) / 2;
      this.top.rotation.z = this.tearDirection * p * 0.1;
      this.top.position.x = this.tearDirection * p * 0.12;
      this.top.position.y = PACK_H / 2 - TOP_H / 2 + p * 0.06;
    }
  }

  dispose() {
    this.root.removeFromParent();
    this.bodyMat.dispose();
    this.topMat.dispose();
  }
}
