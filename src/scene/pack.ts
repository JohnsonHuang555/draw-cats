import {
  AdditiveBlending,
  BackSide,
  Color,
  FrontSide,
  Group,
  Mesh,
  MeshBasicMaterial,
  MeshPhongMaterial,
  PlaneGeometry,
  type BufferAttribute,
  type Side,
  type Texture,
} from 'three';
import { makeGlow } from './effects';
import { PACK_TEAR_LINE, PACK_TEX_H, PACK_TEX_W, beamTexture, packBackTexture, packTexture } from './textures';

export const PACK_W = 2.6;
export const PACK_H = PACK_W * (PACK_TEX_H / PACK_TEX_W);
const TOP_H = PACK_H * PACK_TEAR_LINE;
/** Y of the tear line, relative to the Pack's centre. */
export const TEAR_Y = PACK_H / 2 - TOP_H;
/** How far each face puffs out at the middle of the Pack. */
const BULGE = 0.17;
/** Height of the flat, crimped seal at the top and bottom. */
const CRIMP = PACK_H * 0.05;

const smoothstep = (e0: number, e1: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - e0) / (e1 - e0)));
  return t * t * (3 - 2 * t);
};

/** Puff of the foil at pack coordinates (x, y): full in the middle, flat at the side edges and crimps. */
function bulgeAt(x: number, y: number): number {
  const across = Math.pow(Math.max(0, 1 - Math.pow((2 * x) / PACK_W, 2)), 0.55);
  const fromSeal = PACK_H / 2 - Math.abs(y);
  return BULGE * across * smoothstep(CRIMP, CRIMP + PACK_H * 0.12, fromSeal);
}

/**
 * One horizontal slice of the Pack's surface. `centerY` places the slice in pack coordinates so the
 * bulge is continuous across the tear line. `face` -1 builds the back, mirrored so its print reads.
 */
function puffySlice(h: number, centerY: number, v0: number, v1: number, face: 1 | -1): PlaneGeometry {
  const geo = new PlaneGeometry(PACK_W, h, 28, Math.max(4, Math.round((h / PACK_H) * 36)));
  const pos = geo.attributes.position as BufferAttribute;
  const uv = geo.attributes.uv as BufferAttribute;
  for (let i = 0; i < pos.count; i++) {
    pos.setZ(i, face * bulgeAt(pos.getX(i), pos.getY(i) + centerY));
    uv.setY(i, v0 + uv.getY(i) * (v1 - v0));
    if (face < 0) uv.setX(i, 1 - uv.getX(i));
  }
  geo.computeVertexNormals();
  return geo;
}

function foilMaterial(map: Texture, side: Side): MeshPhongMaterial {
  return new MeshPhongMaterial({
    map,
    side,
    // Kept under the bloom threshold so the print stays readable; only the specular glint blooms.
    color: new Color(0.8, 0.8, 0.8),
    specular: new Color(0.035, 0.035, 0.04),
    shininess: 30,
    transparent: true,
    alphaTest: 0.5,
  });
}

/**
 * The card Pack: a puffy foil pouch. Its glow colour is the Pack Hint; the top strip tears off along
 * the perforation. Hierarchy: root (placement) → floater (idle bob) → parts.
 */
export class PackView {
  readonly root = new Group();
  readonly floater = new Group();
  readonly body = new Group();
  readonly top = new Group();
  readonly seam: Mesh;
  readonly beam: Mesh;
  readonly glow = makeGlow(new Color(), 9);
  /** Current Pack Hint colour; tween it to change the hint. */
  readonly color = new Color();
  glowStrength = 0;
  tearProgress = 0;
  tearDirection = 1;
  torn = false;

  private materials: MeshPhongMaterial[];

  constructor() {
    const front = foilMaterial(packTexture(), FrontSide);
    const back = foilMaterial(packBackTexture(), BackSide);
    this.materials = [front, back];

    const bodyH = PACK_H - TOP_H;
    const bodyY = -TOP_H / 2;
    const topY = PACK_H / 2 - TOP_H / 2;
    const tearV = 1 - PACK_TEAR_LINE;
    this.body.position.y = bodyY;
    this.body.add(
      new Mesh(puffySlice(bodyH, bodyY, 0, tearV, 1), front),
      new Mesh(puffySlice(bodyH, bodyY, 0, tearV, -1), back),
    );
    this.top.position.y = topY;
    this.top.add(
      new Mesh(puffySlice(TOP_H, topY, tearV, 1, 1), front),
      new Mesh(puffySlice(TOP_H, topY, tearV, 1, -1), back),
    );

    this.seam = new Mesh(
      new PlaneGeometry(PACK_W, 0.07),
      new MeshBasicMaterial({ color: 0xffffff, blending: AdditiveBlending, transparent: true, depthWrite: false }),
    );
    // Sits on the bulging front face at the tear line.
    this.seam.position.set(0, TEAR_Y, bulgeAt(0, TEAR_Y) + 0.01);
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
    this.beam.position.set(0, TEAR_Y, 0);
    this.beam.scale.y = 0.001;

    this.glow.position.z = -0.5;
    this.floater.add(this.glow, this.beam, this.body, this.top, this.seam);
    this.root.add(this.floater);
  }

  get beamMaterial(): MeshBasicMaterial {
    return this.beam.material as MeshBasicMaterial;
  }

  set opacity(value: number) {
    for (const m of this.materials) m.opacity = value;
  }

  get opacity(): number {
    return this.materials[0].opacity;
  }

  update(time: number) {
    this.floater.position.y = Math.sin(time * 1.6) * 0.08;
    this.floater.rotation.z = Math.sin(time * 1.1) * 0.025;
    // A wider sway than before so the pack's thickness and glint show.
    this.floater.rotation.y = Math.sin(time * 0.8) * 0.22;
    this.floater.rotation.x = Math.sin(time * 0.6) * 0.06;

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
    for (const m of this.materials) m.dispose();
  }
}
