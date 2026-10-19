import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
  Points,
  ShaderMaterial,
  Vector3,
} from 'three';

const MAX = 2400;

const vertexShader = /* glsl */ `
  attribute float size;
  attribute float alpha;
  attribute vec3 tint;
  uniform float pixelRatio;
  varying float vAlpha;
  varying vec3 vTint;
  void main() {
    vAlpha = alpha;
    vTint = tint;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = size * pixelRatio * (700.0 / -mv.z);
    gl_Position = projectionMatrix * mv;
  }
`;

const fragmentShader = /* glsl */ `
  varying float vAlpha;
  varying vec3 vTint;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.0, d);
    a *= a;
    gl_FragColor = vec4(vTint * a * vAlpha, 1.0);
  }
`;

export interface BurstOptions {
  count: number;
  color: Color | (() => Color);
  speed?: number;
  size?: number;
  life?: number;
  gravity?: number;
  /** Spread the spawn point over a box of this half-size. */
  spread?: Vector3;
  /** Bias every velocity by this direction (added before scaling). */
  direction?: Vector3;
}

export interface GatherOptions {
  count: number;
  color: Color | (() => Color);
  radius?: number;
  duration?: number;
  size?: number;
}

/** CPU-simulated additive particle pool used for bursts, gathering light and ambient sparkles. */
export class Particles {
  readonly points: Points;
  /** Multiplier on spawn counts, lowered in low quality mode. */
  budget = 1;

  private pos = new Float32Array(MAX * 3);
  private tint = new Float32Array(MAX * 3);
  private size = new Float32Array(MAX);
  private alpha = new Float32Array(MAX);
  private vel = new Float32Array(MAX * 3);
  private start = new Float32Array(MAX * 3);
  private target = new Float32Array(MAX * 3);
  private life = new Float32Array(MAX);
  private maxLife = new Float32Array(MAX);
  private baseSize = new Float32Array(MAX);
  private gravity = new Float32Array(MAX);
  /** 0 = free, 1 = ballistic, 2 = gather (ease towards target). */
  private mode = new Uint8Array(MAX);
  private cursor = 0;
  private material: ShaderMaterial;

  constructor(pixelRatio: number) {
    const geo = new BufferGeometry();
    geo.setAttribute('position', new BufferAttribute(this.pos, 3));
    geo.setAttribute('tint', new BufferAttribute(this.tint, 3));
    geo.setAttribute('size', new BufferAttribute(this.size, 1));
    geo.setAttribute('alpha', new BufferAttribute(this.alpha, 1));
    this.material = new ShaderMaterial({
      uniforms: { pixelRatio: { value: pixelRatio } },
      vertexShader,
      fragmentShader,
      blending: AdditiveBlending,
      transparent: true,
      depthWrite: false,
    });
    this.points = new Points(geo, this.material);
    this.points.frustumCulled = false;
    this.points.renderOrder = 10;
  }

  setPixelRatio(ratio: number) {
    this.material.uniforms.pixelRatio.value = ratio;
  }

  burst(at: Vector3, opts: BurstOptions) {
    const n = Math.round(opts.count * this.budget);
    const speed = opts.speed ?? 4;
    for (let k = 0; k < n; k++) {
      const i = this.alloc();
      const s = opts.spread;
      this.place(i, at.x + (s ? rnd(s.x) : 0), at.y + (s ? rnd(s.y) : 0), at.z + (s ? rnd(s.z) : 0));
      const dir = randomDir();
      if (opts.direction) dir.add(opts.direction);
      const v = speed * (0.35 + Math.random() * 0.65);
      this.vel.set([dir.x * v, dir.y * v, dir.z * v * 0.4], i * 3);
      this.spawn(i, opts.color, opts.size ?? 0.18, (opts.life ?? 1.2) * (0.6 + Math.random() * 0.6));
      this.gravity[i] = opts.gravity ?? -1.5;
      this.mode[i] = 1;
    }
  }

  /** Particles spawn on a ring and converge on `at`: the "gathering light" of a Card Hint. */
  gather(at: Vector3, opts: GatherOptions) {
    const n = Math.round(opts.count * this.budget);
    const radius = opts.radius ?? 3;
    const duration = opts.duration ?? 1;
    for (let k = 0; k < n; k++) {
      const i = this.alloc();
      const a = Math.random() * Math.PI * 2;
      const r = radius * (0.7 + Math.random() * 0.5);
      this.start.set([at.x + Math.cos(a) * r, at.y + Math.sin(a) * r * 1.2, at.z + rnd(0.5)], i * 3);
      this.target.set([at.x + rnd(0.3), at.y + rnd(0.4), at.z], i * 3);
      this.place(i, this.start[i * 3], this.start[i * 3 + 1], this.start[i * 3 + 2]);
      // Stagger arrivals over the duration.
      this.spawn(i, opts.color, opts.size ?? 0.16, duration * (0.4 + Math.random() * 0.6));
      this.mode[i] = 2;
    }
  }

  update(dt: number) {
    for (let i = 0; i < MAX; i++) {
      const m = this.mode[i];
      if (m === 0) continue;
      this.life[i] += dt;
      const t = this.life[i] / this.maxLife[i];
      if (t >= 1) {
        this.mode[i] = 0;
        this.alpha[i] = 0;
        continue;
      }
      const j = i * 3;
      if (m === 1) {
        const drag = Math.exp(-dt * 1.8);
        this.vel[j] *= drag;
        this.vel[j + 1] = this.vel[j + 1] * drag + this.gravity[i] * dt;
        this.vel[j + 2] *= drag;
        this.pos[j] += this.vel[j] * dt;
        this.pos[j + 1] += this.vel[j + 1] * dt;
        this.pos[j + 2] += this.vel[j + 2] * dt;
        this.alpha[i] = t < 0.1 ? t / 0.1 : 1 - (t - 0.1) / 0.9;
        this.size[i] = this.baseSize[i] * (1 - t * 0.5);
      } else {
        const e = t * t * t;
        for (let c = 0; c < 3; c++) this.pos[j + c] = this.start[j + c] + (this.target[j + c] - this.start[j + c]) * e;
        this.alpha[i] = Math.min(1, t * 3);
        this.size[i] = this.baseSize[i] * (1 - t * 0.6);
      }
    }
    const geo = this.points.geometry;
    geo.attributes.position.needsUpdate = true;
    geo.attributes.alpha.needsUpdate = true;
    geo.attributes.size.needsUpdate = true;
    geo.attributes.tint.needsUpdate = true;
  }

  private alloc(): number {
    // Ring buffer: when the pool is full, the oldest particle is recycled.
    for (let k = 0; k < MAX; k++) {
      const i = (this.cursor + k) % MAX;
      if (this.mode[i] === 0) {
        this.cursor = (i + 1) % MAX;
        return i;
      }
    }
    const i = this.cursor;
    this.cursor = (i + 1) % MAX;
    return i;
  }

  private place(i: number, x: number, y: number, z: number) {
    this.pos.set([x, y, z], i * 3);
  }

  private spawn(i: number, color: Color | (() => Color), size: number, life: number) {
    const c = typeof color === 'function' ? color() : color;
    // Over-bright so the bloom pass picks particles up.
    this.tint.set([c.r * 1.6, c.g * 1.6, c.b * 1.6], i * 3);
    this.baseSize[i] = size * (0.5 + Math.random());
    this.size[i] = this.baseSize[i];
    this.alpha[i] = 0;
    this.life[i] = 0;
    this.maxLife[i] = life;
  }
}

function rnd(half: number): number {
  return (Math.random() * 2 - 1) * half;
}

function randomDir(): Vector3 {
  const u = Math.random() * 2 - 1;
  const a = Math.random() * Math.PI * 2;
  const s = Math.sqrt(1 - u * u);
  return new Vector3(s * Math.cos(a), s * Math.sin(a), u);
}

/** Random bright hue, used for SSR rainbow sparkles. */
export function rainbow(): Color {
  return new Color().setHSL(Math.random(), 0.9, 0.65);
}
