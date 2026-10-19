import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
  Mesh,
  MeshBasicMaterial,
  PlaneGeometry,
  Points,
  PointsMaterial,
  ShaderMaterial,
  Sprite,
  SpriteMaterial,
} from 'three';
import { glowTexture } from './textures';

/** Rotating god rays, used behind the SSR Showcase and the Fake-out. */
export class Rays {
  readonly mesh: Mesh;
  readonly uniforms = {
    time: { value: 0 },
    color: { value: new Color(0xffc53d) },
    opacity: { value: 0 },
  };

  constructor(size = 14) {
    this.mesh = new Mesh(
      new PlaneGeometry(size, size),
      new ShaderMaterial({
        uniforms: this.uniforms,
        vertexShader: /* glsl */ `
          varying vec2 vUv;
          void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
        `,
        fragmentShader: /* glsl */ `
          uniform float time;
          uniform vec3 color;
          uniform float opacity;
          varying vec2 vUv;
          void main() {
            vec2 p = vUv - 0.5;
            float a = atan(p.y, p.x);
            float r = length(p);
            float rays = pow(0.5 + 0.5 * sin(a * 12.0 + time * 0.5), 6.0) * 0.8
                       + pow(0.5 + 0.5 * sin(a * 7.0 - time * 0.35), 10.0) * 0.6;
            float fall = smoothstep(0.5, 0.05, r);
            float core = smoothstep(0.22, 0.0, r) * 0.5;
            gl_FragColor = vec4(color * (rays * fall + core) * opacity, 1.0);
          }
        `,
        blending: AdditiveBlending,
        transparent: true,
        depthWrite: false,
      }),
    );
  }

  update(time: number) {
    this.uniforms.time.value = time;
    this.mesh.visible = this.uniforms.opacity.value > 0.001;
  }
}

/** A large additive glow sprite. */
export function makeGlow(color: Color, scale: number): Sprite {
  const sprite = new Sprite(
    new SpriteMaterial({
      map: glowTexture(),
      color,
      blending: AdditiveBlending,
      transparent: true,
      depthWrite: false,
      opacity: 0,
    }),
  );
  sprite.scale.set(scale, scale, 1);
  return sprite;
}

/** Full-screen black plane that dims everything behind it (SSR Showcase, inspecting a card). */
export class Dimmer {
  readonly mesh = new Mesh(
    new PlaneGeometry(60, 60),
    new MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0, depthWrite: false }),
  );

  get material(): MeshBasicMaterial {
    return this.mesh.material as MeshBasicMaterial;
  }

  update() {
    this.mesh.visible = this.material.opacity > 0.001;
  }
}

/** Slowly drifting starfield with a nebula glow that takes on the current hint colour. */
export class Backdrop {
  readonly stars: Points;
  readonly nebula: Sprite;
  readonly nebula2: Sprite;
  readonly tint = new Color(0x3a2a8a);

  constructor() {
    const n = 700;
    const pos = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 60;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 40;
      pos[i * 3 + 2] = -6 - Math.random() * 30;
    }
    const geo = new BufferGeometry();
    geo.setAttribute('position', new BufferAttribute(pos, 3));
    this.stars = new Points(
      geo,
      new PointsMaterial({
        size: 0.09,
        map: glowTexture(),
        color: 0xbfc8ff,
        transparent: true,
        depthWrite: false,
        blending: AdditiveBlending,
      }),
    );

    this.nebula = makeGlow(this.tint.clone(), 26);
    this.nebula.position.set(-3, 2, -14);
    this.nebula.material.opacity = 0.5;
    this.nebula2 = makeGlow(new Color(0x1d3f8a), 22);
    this.nebula2.position.set(4, -3, -16);
    this.nebula2.material.opacity = 0.45;
  }

  update(dt: number, time: number) {
    this.stars.rotation.z += dt * 0.008;
    this.stars.position.y = Math.sin(time * 0.1) * 0.3;
    this.nebula.material.color.lerp(this.tint, Math.min(1, dt * 1.5));
    this.nebula.material.opacity = 0.45 + Math.sin(time * 0.6) * 0.08;
  }
}
