import {
  AdditiveBlending,
  Color,
  Group,
  Mesh,
  MeshBasicMaterial,
  PlaneGeometry,
  ShaderMaterial,
  Sprite,
  SpriteMaterial,
  Vector2,
} from 'three';
import type { Copy } from '../domain/pull';
import { FOIL_STRENGTH, rarityColor } from './palette';
import { cardBackTexture, cardFrontTexture, glowTexture, newBadgeTexture } from './textures';

export const CARD_W = 2.2;
export const CARD_H = CARD_W * (716 / 512);

const geometry = new PlaneGeometry(CARD_W, CARD_H);
let backMaterial: MeshBasicMaterial | undefined;
let newBadgeMaterial: SpriteMaterial | undefined;

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform sampler2D map;
  uniform float foil;
  uniform vec2 tilt;
  uniform float time;
  uniform vec3 glowColor;
  uniform float glow;
  uniform float brightness;
  varying vec2 vUv;

  vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
  }

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  void main() {
    vec4 base = texture2D(map, vUv);
    if (base.a < 0.5) discard;
    // Keep the printed face under the bloom threshold so only foil highlights and glow bloom.
    vec3 col = base.rgb * 0.78;

    if (foil > 0.0) {
      // Art area is the most reflective, the frame and text less so.
      float inArt = step(0.066, vUv.x) * step(vUv.x, 0.934) * step(0.28, vUv.y) * step(vUv.y, 0.885);
      float mask = mix(0.55, 1.0, inArt);
      float luma = dot(base.rgb, vec3(0.299, 0.587, 0.114));

      float band = vUv.x * 0.8 + vUv.y * 1.2 + tilt.x * 1.1 - tilt.y * 0.8 + time * 0.03;
      vec3 rainbow = hsv2rgb(vec3(fract(band), 0.6, 1.0));
      float stripes = 0.55 + 0.45 * sin((vUv.x - vUv.y * 0.7) * 38.0 + tilt.x * 7.0 + tilt.y * 4.0);
      col = mix(col, col * 0.6 + rainbow * (0.22 + luma * 0.4), foil * 0.6 * mask * stripes);
      // Light art (e.g. white cats) must not cross the bloom threshold and wash out.
      col = min(col, vec3(0.8));

      vec2 glarePos = vec2(0.5) + vec2(tilt.x, -tilt.y) * 0.75;
      float glare = exp(-pow(distance(vUv * vec2(1.0, 1.4), glarePos * vec2(1.0, 1.4)) * 2.6, 2.0));
      col += glare * foil * 0.32 * (1.0 - luma * 0.75);

      // Glitter: a four-point star in a few random grid cells, twinkling as the card tilts.
      vec2 grid = vUv * vec2(30.0, 42.0);
      vec2 cell = floor(grid);
      vec2 local = fract(grid) - 0.5;
      float h = hash(cell);
      local += (vec2(hash(cell + 7.1), hash(cell + 3.3)) - 0.5) * 0.5;
      float core = smoothstep(0.18, 0.0, length(local));
      float cross = smoothstep(0.06, 0.0, abs(local.x)) * smoothstep(0.42, 0.0, abs(local.y))
                  + smoothstep(0.06, 0.0, abs(local.y)) * smoothstep(0.42, 0.0, abs(local.x));
      float twinkle = pow(max(0.0, sin(h * 60.0 + time * 2.5 + (tilt.x + tilt.y) * 9.0)), 16.0);
      col += step(0.86, h) * (core + cross * 0.6) * twinkle * foil * 2.4 * mask * hsv2rgb(vec3(h, 0.3, 1.0));
    }

    col += glowColor * glow;
    gl_FragColor = vec4(col * brightness, 1.0);
  }
`;

/**
 * A Copy on screen. Hierarchy: root (position/scale) → tilter (viewer tilt) → flipper (flip and shake) → faces.
 * Face down when `flipper.rotation.y === Math.PI`.
 */
export class CardView {
  readonly root = new Group();
  readonly tilter = new Group();
  readonly flipper = new Group();
  readonly front: Mesh;
  readonly aura: Sprite;
  readonly uniforms: {
    map: { value: unknown };
    foil: { value: number };
    tilt: { value: Vector2 };
    time: { value: number };
    glowColor: { value: Color };
    glow: { value: number };
    brightness: { value: number };
  };
  /** How strongly viewer tilt affects this card: 0 none, 1 full (Showcase / inspect). */
  tiltAmount = 0.2;
  private newBadge?: Sprite;
  /** This Copy is a New Card; its badge appears once revealed. */
  isNew = false;

  constructor(readonly copy: Copy) {
    const rarity = copy.card.rarity;
    this.uniforms = {
      map: { value: cardFrontTexture(copy.card) },
      foil: { value: FOIL_STRENGTH[rarity] },
      tilt: { value: new Vector2() },
      time: { value: 0 },
      glowColor: { value: rarityColor(rarity) },
      glow: { value: 0 },
      brightness: { value: 1 },
    };
    this.front = new Mesh(
      geometry,
      new ShaderMaterial({ uniforms: this.uniforms, vertexShader, fragmentShader }),
    );
    backMaterial ??= new MeshBasicMaterial({ map: cardBackTexture(), alphaTest: 0.5, color: new Color(0.8, 0.8, 0.8) });
    const back = new Mesh(geometry, backMaterial);
    back.rotation.y = Math.PI;

    this.aura = new Sprite(
      new SpriteMaterial({
        map: glowTexture(),
        color: rarityColor(rarity),
        blending: AdditiveBlending,
        transparent: true,
        depthWrite: false,
        opacity: 0,
      }),
    );
    this.aura.scale.set(CARD_W * 2.8, CARD_H * 2.2, 1);
    this.aura.position.z = -0.05;

    this.flipper.add(this.front, back);
    this.flipper.rotation.y = Math.PI;
    this.tilter.add(this.aura, this.flipper);
    this.root.add(this.tilter);
  }

  /** Pins a "NEW!" badge to the card's corner: this Copy is a New Card. */
  showNewBadge() {
    if (this.newBadge) return;
    // Slightly dimmed so the white outline doesn't bloom.
    newBadgeMaterial ??= new SpriteMaterial({ map: newBadgeTexture(), color: new Color(0.85, 0.85, 0.85), depthWrite: false, transparent: true });
    this.newBadge = new Sprite(newBadgeMaterial);
    this.newBadge.scale.set(1.1, 0.44, 1);
    this.newBadge.position.set(CARD_W * 0.36, CARD_H * 0.5, 0.08);
    this.tilter.add(this.newBadge);
  }

  update(time: number, tilt: Vector2) {
    const amt = this.tiltAmount;
    // Idle shimmer so Foil moves even without input.
    const idleX = Math.sin(time * 0.7) * 0.25;
    const idleY = Math.cos(time * 0.5) * 0.18;
    const tx = tilt.x * amt + idleX * (1 - amt * 0.6);
    const ty = tilt.y * amt + idleY * (1 - amt * 0.6);
    this.uniforms.tilt.value.set(tx, ty);
    this.uniforms.time.value = time;
    this.tilter.rotation.y += (tilt.x * 0.45 * amt - this.tilter.rotation.y) * 0.15;
    this.tilter.rotation.x += (-tilt.y * 0.35 * amt - this.tilter.rotation.x) * 0.15;
  }

  get auraMaterial(): SpriteMaterial {
    return this.aura.material;
  }

  dispose() {
    this.root.removeFromParent();
    (this.front.material as ShaderMaterial).dispose();
    this.aura.material.dispose();
  }
}
