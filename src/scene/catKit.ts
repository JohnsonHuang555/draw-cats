/**
 * Drawing primitives shared by all cat art: the parametric cat (head, body, eyes, mouth),
 * backgrounds, and small scene helpers.
 */

export interface ArtArea {
  x: number;
  y: number;
  w: number;
  h: number;
}

export type Eyes =
  | 'normal'
  | 'grumpy'
  | 'teary'
  | 'wide'
  | 'happy'
  | 'dot'
  | 'squint'
  | 'closed'
  | 'half'
  | 'squeeze'
  | 'sparkle'
  | 'laser'
  /** Pupils slid to one side. */
  | 'side'
  /** Rolled up: pupils hidden under the lids. */
  | 'up'
  /** Crossed, mismatched pupils. */
  | 'derp'
  /** Eyes shut tight as one slanted line each (screaming, cackling). */
  | 'slant'
  /** Dumbfounded: big whites, tiny drifting pupils, flat heavy lids. */
  | 'blank'
  /** Hesitant: lids drooping toward the outer corners, round pupils glancing up under them. */
  | 'unsure';
export type Mouth =
  | 'w'
  | 'frown'
  | 'open'
  | 'o'
  | 'smile'
  | 'flat'
  | 'smirk'
  | 'polite'
  | 'huge'
  | 'blep'
  /** A huge round open mouth (Pop Cat). */
  | 'pop'
  /** Jaw dropped a little, two small fangs: a bewildered "huh?". */
  | 'gasp';
export type Pose = 'sit' | 'loaf' | 'stand' | 'chonk' | 'quad';
export type Paint = string | CanvasGradient;
export type Draw = (ctx: CanvasRenderingContext2D) => void;
export type Head = { x: number; y: number; s: number };
/** `bout`: seconds into the current bout of a 'scene' Motion, undefined while still. */
export type SceneDraw = (ctx: CanvasRenderingContext2D, a: ArtArea, head: Head, bout?: number) => void;

export interface CatSpec {
  fur: string;
  /** Overrides `fur` as the fill, e.g. a gradient. `fur` is still used for flat details. */
  furPaint?: (ctx: CanvasRenderingContext2D) => Paint;
  darkFur?: boolean;
  eyes: Eyes;
  mouth: Mouth;
  iris?: string;
  iris2?: string;
  stripes?: string;
  earColor?: string;
  noEars?: boolean;
  bigEars?: boolean;
  flatEars?: boolean;
  /** Lynx-style black tufts on the ear tips (Big Floppa). */
  tufts?: boolean;
  /** Colour of a tabby patch on the left flank (chonk pose only). */
  bodyPatch?: string;
  /** Soaked fur: drips and clumped strands over the head. */
  wet?: boolean;
  spiky?: boolean;
  blush?: boolean;
  tuxedo?: boolean;
  /** Vertical slit pupils (wide eyes only). */
  slit?: boolean;
  /** Large round pupils (wide eyes only): the soft, dark-eyed look. */
  bigPupil?: boolean;
  /** Chest/belly colour when it differs from the face (e.g. black cat, white chest). */
  belly?: string;
  /** Stand pose: arms raised overhead instead of out to the sides. */
  armsUp?: boolean;
  /** Colour of the paw tips (quad and stand poses). */
  paws?: string;
  /** Head silhouette (inked style only); the classic style always draws the same oval. */
  head?: HeadShape;
  /** Card Art motion, played only on SR and above. */
  motion?: Motion;
  /** Skip the built-in cat entirely; `back`/`front` draw everything. */
  noCat?: boolean;
  mask?: string;
  muzzle?: string;
  pose?: Pose;
  tilt?: number;
  s?: number;
  dx?: number;
  dy?: number;
  alpha?: number;
  /** Scene layers in art-area coordinates, behind and in front of the cat. */
  back?: SceneDraw;
  front?: SceneDraw;
  /** Head-local layers: under the head, on the fur (clipped to the head), and on top of the face. */
  under?: Draw;
  cover?: Draw;
  over?: Draw;
}

export const INK = '#241a2e';

/**
 * How cats are drawn. 'inked' is the restyle being prototyped in art-lab.html: heavy outlines
 * tinted by the fur, fine inner lines, shading, fur tufts and per-cat head shapes (ADR 0003).
 */
export type ArtStyle = 'classic' | 'inked';
let artStyle: ArtStyle = 'classic';

export function setArtStyle(style: ArtStyle) {
  artStyle = style;
}

function inked() {
  return artStyle === 'inked';
}

/**
 * Card Art motion:
 * - 'spin' turns the whole cat about a vertical axis, showing its mirrored back half the time
 * - 'scene' hands the spec's `back` scene the time into each bout, to animate itself (Bongo, Nyan)
 * - 'jump' bounces the whole cat, one hop per period
 * - 'mouth' shows the spec's mouth for the first half of each period and `mouth` for the rest
 * - 'nod' bobs the head up and down; 'shake' turns it from side to side (the body stays put)
 */
export interface Motion {
  kind: 'spin' | 'scene' | 'jump' | 'mouth' | 'nod' | 'shake';
  /** Seconds one bout of movement lasts: one turn, one burst of drumming, one hop, nod or shake. */
  period: number;
  /** 'mouth' only: the mouth shown while the spec's own mouth is shut. */
  mouth?: Mouth;
  /** Seconds the cat holds still, from when its card turns face up, before it starts moving. */
  delay?: number;
  /** If set, the cat stops for this many seconds after every bout (and each turn eases in and out). */
  pause?: number;
}

/** Seconds into the current bout of movement, or undefined while the cat holds still. */
export function boutAt(motion: Motion, time: number): number | undefined {
  const { period, delay = 0, pause } = motion;
  const t = time - delay;
  if (t < 0) return undefined;
  if (pause === undefined) return t % period;
  const into = t % (period + pause);
  return into < period ? into : undefined;
}

/** How far round (in turns) a spinning Motion has the cat at `time` seconds after its card turned face up. */
export function turnsAt(motion: Motion, time: number): number {
  const { period, delay = 0, pause } = motion;
  const t = Math.max(0, time - delay);
  if (pause === undefined) return t / period;
  const cycle = period + pause;
  const done = Math.floor(t / cycle);
  const p = Math.min(1, (t - done * cycle) / period);
  return done + (p < 0.5 ? 2 * p * p : 1 - (-2 * p + 2) ** 2 / 2);
}

/** Multipliers on the base 112 x 94 head. */
export interface HeadShape {
  w?: number;
  h?: number;
  /** Widens the lower half into heavy cheeks and flattens the chin (0 = none). */
  jowl?: number;
  /** Height of the fur tufts along the cheeks (0 = smooth, default 0.08). */
  fluff?: number;
}

function mixHex(hex: string, toward: string, t: number): string {
  const parse = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  if (!/^#[0-9a-f]{6}$/i.test(hex)) return toward;
  const a = parse(hex);
  const b = parse(toward);
  return `rgb(${a.map((v, i) => Math.round(v + (b[i] - v) * t)).join(',')})`;
}

/** Outline colour: plain ink, or (inked) a dark shade of the cat's own fur. */
export function lineOf(spec: CatSpec): string {
  if (!inked()) return INK;
  return spec.darkFur ? '#0c0910' : mixHex(spec.fur, INK, 0.85);
}

/** Line weight of silhouettes (head, ears, body). */
function outlineWidth() {
  return inked() ? 9 : 6;
}

function headPath(spec: CatSpec, inset = 0): Path2D {
  const p = new Path2D();
  if (!inked()) {
    if (spec.spiky) {
      const n = 22;
      for (let i = 0; i <= n * 2; i++) {
        const a = (i / (n * 2)) * Math.PI * 2;
        const r = i % 2 === 0 ? 1.18 : 1;
        p.lineTo(Math.cos(a) * (112 - inset) * r, Math.sin(a) * (94 - inset) * r);
      }
    } else {
      p.ellipse(0, 0, 112 - inset, 94 - inset, 0, 0, Math.PI * 2);
    }
    return p;
  }
  const { w = 1, h = 1, jowl = 0, fluff = 0.08 } = spec.head ?? {};
  const at = (a: number, r = 1): [number, number] => {
    const lower = Math.max(0, Math.sin(a));
    const rx = 112 * w * (1 + jowl * lower ** 1.5) - inset;
    const ry = 94 * h * (1 - jowl * 0.25 * lower) - inset;
    return [Math.cos(a) * rx * r, Math.sin(a) * ry * r];
  };
  if (spec.spiky) {
    const n = 44;
    for (let i = 0; i < n; i++) p.lineTo(...at((i / n) * Math.PI * 2, i % 2 === 0 ? 1.18 : 1));
    p.closePath();
    return p;
  }
  // Smooth outline, except for a few swept tufts on each cheek that point down and out
  const TUFTS = 3;
  const cheeks: [number, number, number][] = [
    [0.02, 0.8, 1],
    [Math.PI - 0.75, Math.PI + 0.05, -1],
  ];
  const amp = fluff * 1.6;
  const steps = 72;
  let a = 0;
  p.moveTo(...at(0));
  for (let i = 1; i <= steps; i++) {
    const next = (i / steps) * Math.PI * 2;
    const cheek = amp > 0 ? cheeks.find(([c0]) => a < c0 && next >= c0) : undefined;
    if (cheek) {
      const [c0, c1, dir] = cheek;
      p.lineTo(...at(c0));
      const span = (c1 - c0) / TUFTS;
      for (let t = 0; t < TUFTS; t++) {
        const t0 = c0 + span * t;
        const t1 = t0 + span;
        // Tip leans toward the jaw: the far end on the right cheek, the near end on the left
        const tip = dir > 0 ? t1 : t0 + span * 0.15;
        p.quadraticCurveTo(...at(t0 + span * 0.5, 1 + amp * 0.9), ...at(tip, 1 + amp * 1.3));
        p.quadraticCurveTo(...at(t1, 1 + amp * 0.3), ...at(t1));
      }
      a = c1;
      continue;
    }
    if (next > a) p.lineTo(...at(next));
    a = Math.max(a, next);
  }
  p.closePath();
  return p;
}

/** Inked style: a cool multiply shadow toward the lower right of `clip`, and a soft highlight. */
function shade(ctx: CanvasRenderingContext2D, spec: CatSpec, clip: Path2D, shadow: Path2D, light: [number, number, number]) {
  ctx.save();
  ctx.clip(clip);
  ctx.globalCompositeOperation = 'multiply';
  ctx.fillStyle = spec.darkFur ? 'rgba(0,0,0,0.5)' : '#e2dbe9';
  ctx.fill(shadow, 'evenodd');
  ctx.globalCompositeOperation = 'source-over';
  const [lx, ly, lr] = light;
  const g = ctx.createRadialGradient(lx, ly, 0, lx, ly, lr);
  g.addColorStop(0, `rgba(255,255,255,${spec.darkFur ? 0.16 : 0.32})`);
  g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(lx - lr, ly - lr, lr * 2, lr * 2);
  ctx.restore();
}

/** Shadow region: everything outside `path` nudged toward the light (up-left). */
function offsetShadow(path: Path2D, dx: number, dy: number, k: number): Path2D {
  const s = new Path2D();
  s.rect(-1000, -1000, 2000, 2000);
  s.addPath(path, new DOMMatrix().translate(dx, dy).scale(k));
  return s;
}

/** Inked style: shades a body part, given its outline and roughly where its centre and radii are. */
function shadeBody(ctx: CanvasRenderingContext2D, spec: CatSpec, part: Path2D, x: number, y: number, rx: number, ry: number) {
  if (!inked()) return;
  const lit = new Path2D();
  lit.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
  shade(ctx, spec, part, offsetShadow(lit, x - rx * 0.16, y - ry * 0.2, 0.98), [x - rx * 0.4, y - ry * 0.45, Math.max(rx, ry) * 0.7]);
}

function ellipsePath(x: number, y: number, rx: number, ry: number, rot = 0): Path2D {
  const p = new Path2D();
  p.ellipse(x, y, rx, ry, rot, 0, Math.PI * 2);
  return p;
}

/** `time` (seconds since the card turned face up) plays the spec's motion; leave it out for a still picture. */
export function drawCat(ctx: CanvasRenderingContext2D, spec: CatSpec, a: ArtArea, time?: number) {
  const s = spec.s ?? 1;
  const head = { x: a.x + a.w / 2 + (spec.dx ?? 0), y: a.y + a.h * 0.5 + (spec.dy ?? 0), s };

  const motion = time === undefined ? undefined : spec.motion;
  const bout = motion && motion.kind !== 'spin' ? boutAt(motion, time!) : undefined;
  // How far through the current bout, 0 to 1; only set while moving
  const phase = motion && bout !== undefined ? bout / motion.period : undefined;
  ctx.save();
  spec.back?.(ctx, a, head, motion?.kind === 'scene' ? bout : undefined);
  if (motion?.kind === 'spin') {
    const turn = turnsAt(motion, time!);
    const cx = a.x + a.w / 2;
    ctx.translate(cx, 0);
    ctx.scale(Math.cos(turn * Math.PI * 2), 1);
    ctx.translate(-cx, 0);
  }
  if (motion?.kind === 'jump' && phase !== undefined) ctx.translate(0, -40 * Math.sin(phase * Math.PI));
  const face = motion?.kind === 'mouth' && phase !== undefined && phase >= 0.5 ? { ...spec, mouth: motion.mouth ?? 'w' } : spec;
  if (!spec.noCat) {
    ctx.globalAlpha = spec.alpha ?? 1;
    if (spec.pose) drawBody(ctx, head, face);
    ctx.translate(head.x, head.y);
    if (phase !== undefined) {
      const swing = Math.sin(phase * Math.PI * 2);
      if (motion?.kind === 'nod') {
        ctx.translate(0, 14 * swing * s);
        ctx.rotate(0.05 * swing);
      }
      if (motion?.kind === 'shake') ctx.rotate(0.22 * swing);
    }
    ctx.rotate(spec.tilt ?? 0);
    ctx.scale(s, s);
    drawHead(ctx, face);
  }
  ctx.restore();

  ctx.save();
  spec.front?.(ctx, a, head);
  ctx.restore();
}

// ---------------------------------------------------------------- backgrounds

export function seededRandom(seed: string) {
  let h = 2166136261;
  for (const ch of seed) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
}

export function skyGradient(ctx: CanvasRenderingContext2D, hue: number, a: ArtArea, light = 48) {
  const g = ctx.createLinearGradient(0, a.y, 0, a.y + a.h);
  g.addColorStop(0, `hsl(${hue}, 65%, 24%)`);
  g.addColorStop(1, `hsl(${(hue + 40) % 360}, 75%, ${light}%)`);
  ctx.fillStyle = g;
  ctx.fillRect(a.x, a.y, a.w, a.h);
}

export function sunburst(ctx: CanvasRenderingContext2D, hue: number, a: ArtArea, rand: () => number, alpha: number) {
  const cx = a.x + a.w / 2;
  const cy = a.y + a.h * 0.48;
  ctx.globalAlpha = alpha;
  ctx.fillStyle = `hsl(${(hue + 20) % 360}, 90%, 80%)`;
  const rays = 14 + Math.floor(rand() * 10);
  for (let i = 0; i < rays; i++) {
    const ang = (i / rays) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, 420, ang, ang + Math.PI / rays / 1.6);
    ctx.closePath();
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

export function orbs(ctx: CanvasRenderingContext2D, hue: number, a: ArtArea, rand: () => number) {
  for (let i = 0; i < 22; i++) {
    ctx.globalAlpha = 0.12 + rand() * 0.3;
    ctx.fillStyle = `hsl(${(hue + rand() * 80) % 360}, 90%, 75%)`;
    ctx.beginPath();
    ctx.arc(a.x + rand() * a.w, a.y + rand() * a.h, 3 + rand() * 16, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

export function drawMemeBackground(ctx: CanvasRenderingContext2D, hue: number, seed: string, a: ArtArea) {
  const rand = seededRandom(seed);
  skyGradient(ctx, hue, a);
  sunburst(ctx, hue, a, rand, 0.18);
  orbs(ctx, hue, a, rand);
}

// ---------------------------------------------------------------- the cat itself

export function furFill(ctx: CanvasRenderingContext2D, spec: CatSpec): Paint {
  return spec.furPaint ? spec.furPaint(ctx) : spec.fur;
}

export function drawBody(ctx: CanvasRenderingContext2D, head: Head, spec: CatSpec) {
  const s = head.s;
  ctx.save();
  ctx.translate(head.x, head.y);
  ctx.scale(s, s);
  if (inked()) {
    drawInkedBody(ctx, spec);
    ctx.restore();
    return;
  }
  ctx.fillStyle = furFill(ctx, spec);
  ctx.strokeStyle = INK;
  ctx.lineWidth = 6;
  const belly = spec.belly ?? (spec.tuxedo ? '#ffffff' : spec.muzzle);

  if (spec.pose === 'quad') {
    // Standing on all fours in three-quarter view. Draw order hides every leg root:
    // hind legs, then the body, then front legs tucked under the chest, then the head on top.
    const leg = (x: number, top: number, h: number) => {
      ctx.fillStyle = furFill(ctx, spec);
      ctx.beginPath();
      ctx.roundRect(x - 26, top, 52, h, 24);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = spec.paws ?? furFill(ctx, spec);
      ctx.beginPath();
      ctx.ellipse(x, top + h - 6, 27, 16, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    };
    leg(-190, 150, 130);
    leg(-115, 160, 120);
    ctx.fillStyle = furFill(ctx, spec);
    ctx.beginPath();
    ctx.ellipse(-95, 118, 150, 88, -0.05, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    // Front legs come out from under a rounded chest that sits below the chin
    leg(-42, 140, 142);
    leg(42, 140, 142);
    ctx.fillStyle = furFill(ctx, spec);
    ctx.strokeStyle = INK;
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.ellipse(0, 128, 82, 74, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    if (belly) {
      ctx.fillStyle = belly;
      ctx.beginPath();
      ctx.ellipse(0, 138, 42, 52, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (spec.pose === 'chonk') {
    // Very round, pear-shaped body under a small head
    ctx.beginPath();
    ctx.moveTo(-70, 40);
    ctx.bezierCurveTo(-210, 120, -200, 330, -40, 340);
    ctx.lineTo(40, 340);
    ctx.bezierCurveTo(200, 330, 210, 120, 70, 40);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    if (spec.bodyPatch) {
      // Tabby patch over the left flank
      ctx.save();
      ctx.clip();
      ctx.fillStyle = spec.bodyPatch;
      ctx.beginPath();
      ctx.ellipse(-150, 170, 70, 130, 0.15, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#141216';
      ctx.lineWidth = 9;
      for (const y of [110, 150, 190, 230]) {
        ctx.beginPath();
        ctx.moveTo(-200, y);
        ctx.quadraticCurveTo(-150, y - 14, -96, y + 6);
        ctx.stroke();
      }
      ctx.restore();
    }
    ctx.fillStyle = furFill(ctx, spec);
    ctx.strokeStyle = INK;
    ctx.lineWidth = 6;
    for (const side of [-1, 1]) {
      ctx.beginPath();
      ctx.ellipse(side * 55, 335, 34, 20, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }
  } else if (spec.pose === 'loaf') {
    // Lying down, body stretching to the left
    ctx.beginPath();
    ctx.ellipse(-150, 55, 210, 95, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    if (belly) {
      ctx.fillStyle = belly;
      ctx.beginPath();
      ctx.ellipse(-10, 105, 70, 40, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (spec.pose === 'stand') {
    // Upright, arms flung out to the sides (or raised overhead with armsUp)
    for (const side of [-1, 1]) {
      ctx.fillStyle = furFill(ctx, spec);
      ctx.beginPath();
      ctx.roundRect(side * 50 - 28, 250, 56, 150, 28);
      ctx.fill();
      ctx.stroke();
    }
    ctx.fillStyle = furFill(ctx, spec);
    ctx.beginPath();
    ctx.ellipse(0, 190, 105, 140, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    if (belly) {
      ctx.fillStyle = belly;
      ctx.beginPath();
      ctx.ellipse(0, 200, 60, 100, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    // Arms drawn over the body, rotated outward from the shoulders
    for (const side of [-1, 1]) {
      ctx.save();
      ctx.translate(side * 82, 120);
      ctx.rotate(side * (spec.armsUp ? 0.4 : 1.15));
      ctx.fillStyle = furFill(ctx, spec);
      ctx.strokeStyle = INK;
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.roundRect(-24, -160, 48, 175, 24);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = spec.paws ?? furFill(ctx, spec);
      ctx.beginPath();
      ctx.ellipse(0, -156, 28, 24, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }
  } else {
    ctx.beginPath();
    ctx.ellipse(0, 140, 100, 90, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    if (belly) {
      ctx.fillStyle = belly;
      ctx.beginPath();
      ctx.ellipse(0, 150, 50, 65, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = spec.tuxedo ? '#ffffff' : furFill(ctx, spec);
    for (const side of [-1, 1]) {
      ctx.beginPath();
      ctx.ellipse(side * 38, 215, 28, 20, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }
  }
  ctx.restore();
}

// ---------------------------------------------------------------- inked bodies

/** Sitting body proportions, in head-local units (the head is about 112 x 94). */
const SIT = {
  /** Half-widths of the torso at the neck and the hips. */
  neck: 58,
  hip: 94,
  top: 60,
  bottom: 220,
  /** Front legs: width, and where their outline starts. They stand side by side, touching. */
  leg: { w: 40, top: 112 },
  /** Haunch (folded hind thigh) behind the torso: centre x, centre y, radii. */
  haunch: [74, 172, 46, 50],
};

function drawInkedBody(ctx: CanvasRenderingContext2D, spec: CatSpec) {
  const line = lineOf(spec);
  const o = outlineWidth();
  ctx.strokeStyle = line;
  ctx.lineWidth = o;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  if (spec.pose === 'chonk') chonkBody(ctx, spec);
  else if (spec.pose === 'loaf') loafBody(ctx, spec, line, o);
  else if (spec.pose === 'quad') quadBody(ctx, spec, line, o);
  else if (spec.pose === 'stand') standBody(ctx, spec, line, o);
  else sitBody(ctx, spec, line, o);
}

function bellyOf(spec: CatSpec): string | undefined {
  return spec.belly ?? (spec.tuxedo ? '#ffffff' : spec.muzzle);
}

function groundShadow(ctx: CanvasRenderingContext2D, x: number, y: number, rx: number) {
  ctx.fillStyle = 'rgba(0,0,0,0.22)';
  ctx.fill(ellipsePath(x, y, rx, rx * 0.13));
}

/** A limb or tail drawn as an outlined stroke along `path`. */
function tube(ctx: CanvasRenderingContext2D, path: Path2D, w: number, fill: Paint, line: string, o: number) {
  ctx.save();
  ctx.strokeStyle = line;
  ctx.lineWidth = w + o;
  ctx.stroke(path);
  ctx.strokeStyle = fill;
  ctx.lineWidth = w - o;
  ctx.stroke(path);
  ctx.restore();
}

/**
 * A leg hanging straight down from the body and ending in a rounded paw, as one shape.
 * The outline starts at `fade`, so the leg grows out of the body instead of starting with a cap.
 * `outer` (-1 or 1) outlines only that side above the paw, for legs that stand touching another.
 */
function leg(ctx: CanvasRenderingContext2D, spec: CatSpec, x: number, top: number, bottom: number, w: number, fade: number, outer?: number) {
  const x0 = x - w / 2;
  const x1 = x + w / 2;
  const pawTop = bottom - w * 0.5;
  const p = new Path2D();
  p.moveTo(x0, top);
  p.lineTo(x1, top);
  p.lineTo(x1, pawTop);
  p.bezierCurveTo(x1 + w * 0.1, pawTop + w * 0.2, x1 + w * 0.08, bottom, x1 - w * 0.22, bottom);
  p.lineTo(x0 + w * 0.22, bottom);
  p.bezierCurveTo(x0 - w * 0.08, bottom, x0 - w * 0.1, pawTop + w * 0.2, x0, pawTop);
  p.closePath();
  ctx.fillStyle = furFill(ctx, spec);
  ctx.fill(p);
  const paws = spec.paws ?? (spec.tuxedo ? '#ffffff' : undefined);
  if (paws) {
    ctx.save();
    ctx.clip(p);
    ctx.fillStyle = paws;
    ctx.fillRect(x0 - w, pawTop - w * 0.1, w * 3, w);
    ctx.restore();
  }
  ctx.beginPath();
  ctx.moveTo(x0, outer === 1 ? pawTop : fade);
  ctx.lineTo(x0, pawTop);
  ctx.bezierCurveTo(x0 - w * 0.1, pawTop + w * 0.2, x0 - w * 0.08, bottom, x0 + w * 0.22, bottom);
  ctx.lineTo(x1 - w * 0.22, bottom);
  ctx.bezierCurveTo(x1 + w * 0.08, bottom, x1 + w * 0.1, pawTop + w * 0.2, x1, pawTop);
  ctx.lineTo(x1, outer === -1 ? pawTop : fade);
  ctx.stroke();
}

/** A fluffy bib just under the chin. */
function chestTuft(ctx: CanvasRenderingContext2D, fill: Paint) {
  ctx.save();
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.moveTo(-46, 70);
  const n = 7;
  for (let i = 0; i <= n; i++) {
    const x = -46 + (92 * i) / n;
    ctx.lineTo(x - 46 / n, 112 + (i % 2 ? 0 : 6) - Math.abs(x) * 0.25);
    ctx.lineTo(x, 100 - Math.abs(x) * 0.25);
  }
  ctx.lineTo(46, 70);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

/** Seated cat, front view: tail, pear-shaped torso with haunches behind it, front legs side by side. */
function sitBody(ctx: CanvasRenderingContext2D, spec: CatSpec, line: string, o: number) {
  const g = SIT;
  const fur = furFill(ctx, spec);
  const H = g.bottom - g.top;
  const belly = bellyOf(spec);
  groundShadow(ctx, 0, g.bottom + 4, g.hip * 1.45);

  // Tail sweeps out from behind the right hip and curls up
  const tail = new Path2D();
  tail.moveTo(g.hip * 0.5, g.bottom - 12);
  tail.bezierCurveTo(g.hip * 1.55, g.bottom, g.hip * 1.6, g.top + H * 0.45, g.hip * 1.22, g.top + H * 0.18);
  tube(ctx, tail, g.leg.w * 0.8, fur, line, o);
  if (spec.stripes) {
    ctx.save();
    ctx.setLineDash([10, 16]);
    ctx.strokeStyle = spec.stripes;
    ctx.lineWidth = g.leg.w * 0.8 - o;
    ctx.lineCap = 'butt';
    ctx.stroke(tail);
    ctx.restore();
  }

  // Haunches sit behind the torso: only their outer bulge shows
  const [hx, hy, hrx, hry] = g.haunch;
  for (const side of [-1, 1]) {
    const haunch = ellipsePath(side * hx, hy, hrx, hry, side * -0.3);
    ctx.fillStyle = fur;
    ctx.fill(haunch);
    ctx.stroke(haunch);
    shadeBody(ctx, spec, haunch, side * hx, hy, hrx, hry);
  }

  const torso = new Path2D();
  torso.moveTo(-g.neck, g.top);
  torso.bezierCurveTo(-g.neck - (g.hip - g.neck) * 0.3, g.top + H * 0.35, -g.hip * 1.04, g.top + H * 0.55, -g.hip * 0.94, g.bottom - 10);
  torso.quadraticCurveTo(-g.hip * 0.88, g.bottom, -g.hip * 0.6, g.bottom);
  torso.lineTo(g.hip * 0.6, g.bottom);
  torso.quadraticCurveTo(g.hip * 0.88, g.bottom, g.hip * 0.94, g.bottom - 10);
  torso.bezierCurveTo(g.hip * 1.04, g.top + H * 0.55, g.neck + (g.hip - g.neck) * 0.3, g.top + H * 0.35, g.neck, g.top);
  torso.closePath();
  ctx.fillStyle = fur;
  ctx.fill(torso);
  ctx.stroke(torso);
  shadeBody(ctx, spec, torso, 0, g.top + H * 0.55, g.hip, H * 0.55);

  // Front legs touch: each outlines only its outer side, and one fine line parts them
  const { w, top } = g.leg;
  const fade = top + w * 0.5;
  for (const side of [-1, 1]) leg(ctx, spec, (side * w) / 2, top, g.bottom, w, fade, side);
  ctx.save();
  ctx.lineWidth = o * 0.5;
  ctx.beginPath();
  ctx.moveTo(0, fade + 20);
  ctx.lineTo(0, g.bottom - w * 0.5);
  ctx.stroke();
  ctx.restore();

  // Chest fur falls over the tops of the front legs
  if (belly) {
    ctx.save();
    ctx.clip(torso);
    ctx.fillStyle = belly;
    ctx.fill(ellipsePath(0, g.top + H * 0.28, g.neck * 0.72, H * 0.3));
    ctx.restore();
  }
  chestTuft(ctx, belly ?? fur);
}

/**
 * Huh Cat (Ben): keeps the classic silhouette from the reference, a round pear with two small
 * feet and dark stripes down the left flank; only line, shading and shadow change.
 */
function chonkBody(ctx: CanvasRenderingContext2D, spec: CatSpec) {
  const fur = furFill(ctx, spec);
  groundShadow(ctx, 0, 348, 190);
  const body = new Path2D();
  body.moveTo(-70, 40);
  body.bezierCurveTo(-210, 120, -200, 330, -40, 340);
  body.lineTo(40, 340);
  body.bezierCurveTo(200, 330, 210, 120, 70, 40);
  body.closePath();
  ctx.fillStyle = fur;
  ctx.fill(body);
  ctx.stroke(body);
  if (spec.bodyPatch) {
    ctx.save();
    ctx.clip(body);
    ctx.strokeStyle = '#141216';
    ctx.lineWidth = 9;
    for (const y of [110, 150, 190, 230]) {
      ctx.beginPath();
      ctx.moveTo(-200, y);
      ctx.quadraticCurveTo(-150, y - 14, -96, y + 6);
      ctx.stroke();
    }
    ctx.restore();
  }
  shadeBody(ctx, spec, body, 0, 200, 170, 140);
  const belly = bellyOf(spec);
  if (belly) {
    ctx.save();
    ctx.clip(body);
    ctx.fillStyle = belly;
    ctx.fill(ellipsePath(0, 230, 100, 120));
    ctx.restore();
  }
  ctx.fillStyle = spec.paws ?? fur;
  for (const side of [-1, 1]) {
    const foot = ellipsePath(side * 55, 335, 34, 20);
    ctx.fill(foot);
    ctx.stroke(foot);
  }
}

function paw(ctx: CanvasRenderingContext2D, spec: CatSpec, x: number, y: number, rx: number, ry: number) {
  ctx.fillStyle = spec.paws ?? (spec.tuxedo ? '#ffffff' : furFill(ctx, spec));
  const p = ellipsePath(x, y, rx, ry);
  ctx.fill(p);
  ctx.stroke(p);
}

/** Lying loaf stretching left from under the head: haunch contour, tucked paws, tail wrapped in front. */
function loafBody(ctx: CanvasRenderingContext2D, spec: CatSpec, line: string, o: number) {
  const fur = furFill(ctx, spec);
  groundShadow(ctx, -150, 152, 230);
  const body = new Path2D();
  body.moveTo(40, 150);
  body.lineTo(-300, 150);
  body.quadraticCurveTo(-372, 150, -366, 70);
  body.bezierCurveTo(-356, -28, -250, -46, -150, -42);
  body.bezierCurveTo(-40, -40, 44, -8, 62, 62);
  body.quadraticCurveTo(68, 150, 40, 150);
  body.closePath();
  ctx.fillStyle = fur;
  ctx.fill(body);
  ctx.stroke(body);
  shadeBody(ctx, spec, body, -150, 55, 215, 100);
  const belly = bellyOf(spec);
  if (belly) {
    ctx.save();
    ctx.clip(body);
    ctx.fillStyle = belly;
    ctx.fill(ellipsePath(-10, 105, 70, 40));
    ctx.restore();
  }
  // Thigh contour on the rump
  ctx.save();
  ctx.clip(body);
  ctx.lineWidth = o * 0.6;
  ctx.beginPath();
  ctx.moveTo(-250, 150);
  ctx.bezierCurveTo(-262, 70, -300, 20, -345, 28);
  ctx.stroke();
  ctx.restore();
  for (const x of [-30, 22]) paw(ctx, spec, x, 150, 28, 14);
  const tail = new Path2D();
  tail.moveTo(-350, 120);
  tail.bezierCurveTo(-370, 175, -250, 168, -150, 160);
  tube(ctx, tail, 28, fur, line, o);
}

/** On all fours, three-quarter view: hind legs, tail, body, front legs under a rounded chest. */
function quadBody(ctx: CanvasRenderingContext2D, spec: CatSpec, line: string, o: number) {
  const fur = furFill(ctx, spec);
  groundShadow(ctx, -80, 282, 200);
  leg(ctx, spec, -190, 160, 278, 50, 170);
  leg(ctx, spec, -112, 166, 270, 48, 176);
  const tail = new Path2D();
  tail.moveTo(-225, 70);
  tail.bezierCurveTo(-300, 40, -300, -40, -262, -70);
  tube(ctx, tail, 36, fur, line, o);
  const body = new Path2D();
  body.moveTo(30, 60);
  body.bezierCurveTo(-40, 26, -180, 26, -228, 62);
  body.bezierCurveTo(-266, 96, -258, 178, -214, 202);
  body.bezierCurveTo(-150, 218, -60, 208, 10, 192);
  body.bezierCurveTo(62, 172, 72, 92, 30, 60);
  body.closePath();
  ctx.fillStyle = fur;
  ctx.fill(body);
  ctx.stroke(body);
  shadeBody(ctx, spec, body, -95, 118, 150, 88);
  leg(ctx, spec, -42, 150, 282, 50, 190);
  leg(ctx, spec, 42, 150, 282, 50, 190);
  const belly = bellyOf(spec);
  // Rounded chest in front of the body, outlined so the body reads as two masses
  const chest = ellipsePath(0, 128, 80, 72);
  ctx.fillStyle = fur;
  ctx.fill(chest);
  ctx.stroke(chest);
  shadeBody(ctx, spec, chest, 0, 128, 80, 72);
  if (belly) {
    ctx.fillStyle = belly;
    ctx.fill(ellipsePath(0, 138, 40, 50));
  }
}

/** Upright on hind legs: pear torso, legs, arms out to the sides or overhead. */
function standBody(ctx: CanvasRenderingContext2D, spec: CatSpec, line: string, o: number) {
  const fur = furFill(ctx, spec);
  groundShadow(ctx, 0, 398, 110);
  for (const side of [-1, 1]) leg(ctx, spec, side * 48, 260, 398, 52, 290);
  const torso = new Path2D();
  torso.moveTo(-62, 70);
  torso.bezierCurveTo(-110, 130, -118, 260, -86, 304);
  torso.quadraticCurveTo(0, 336, 86, 304);
  torso.bezierCurveTo(118, 260, 110, 130, 62, 70);
  torso.closePath();
  ctx.fillStyle = fur;
  ctx.fill(torso);
  ctx.stroke(torso);
  shadeBody(ctx, spec, torso, 0, 200, 105, 130);
  const belly = bellyOf(spec);
  if (belly) {
    ctx.save();
    ctx.clip(torso);
    ctx.fillStyle = belly;
    ctx.fill(ellipsePath(0, 210, 58, 96));
    ctx.restore();
  }
  for (const side of [-1, 1]) {
    ctx.save();
    ctx.translate(side * 76, 120);
    ctx.rotate(side * (spec.armsUp ? 0.4 : 1.15));
    const arm = new Path2D();
    arm.moveTo(0, 10);
    arm.quadraticCurveTo(side * 6, -70, 0, -140);
    tube(ctx, arm, 44, fur, line, o);
    ctx.strokeStyle = line;
    ctx.lineWidth = o;
    paw(ctx, spec, 0, -150, 26, 22);
    ctx.restore();
  }
}

export function drawHead(ctx: CanvasRenderingContext2D, spec: CatSpec) {
  spec.under?.(ctx);
  const line = lineOf(spec);
  ctx.strokeStyle = line;
  ctx.lineWidth = outlineWidth();
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';

  if (!spec.noEars) drawEars(ctx, spec, line);

  const head = headPath(spec);
  ctx.fillStyle = furFill(ctx, spec);
  ctx.fill(head);
  ctx.stroke(head);

  ctx.save();
  ctx.clip(inked() ? headPath(spec, 2) : ellipsePath(0, 0, 110, 92));
  spec.cover?.(ctx);
  if (spec.tuxedo) {
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(0, -30);
    ctx.quadraticCurveTo(-90, 60, -60, 120);
    ctx.lineTo(60, 120);
    ctx.quadraticCurveTo(90, 60, 0, -30);
    ctx.fill();
  }
  if (spec.muzzle) {
    ctx.fillStyle = spec.muzzle;
    ctx.beginPath();
    if (inked()) {
      // Two whisker pads and a little chin
      ctx.ellipse(-27, 44, 38, 30, -0.2, 0, Math.PI * 2);
      ctx.ellipse(27, 44, 38, 30, 0.2, 0, Math.PI * 2);
      ctx.ellipse(0, 62, 26, 22, 0, 0, Math.PI * 2);
    } else {
      ctx.ellipse(0, 45, 62, 42, 0, 0, Math.PI * 2);
    }
    ctx.fill();
  }
  if (spec.mask) {
    ctx.fillStyle = spec.mask;
    ctx.globalAlpha = 0.55;
    ctx.beginPath();
    ctx.ellipse(-42, 0, 42, 34, 0.3, 0, Math.PI * 2);
    ctx.ellipse(42, 0, 42, 34, -0.3, 0, Math.PI * 2);
    ctx.ellipse(0, 34, 34, 34, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }
  if (spec.stripes) {
    ctx.strokeStyle = spec.stripes;
    ctx.lineWidth = 9;
    for (const x of [-26, 0, 26]) {
      ctx.beginPath();
      if (inked()) {
        // Tapered, curved forehead stripes
        ctx.moveTo(x * 1.1 - 5, -94);
        ctx.quadraticCurveTo(x * 0.95, -72, x * 0.8, -54);
        ctx.quadraticCurveTo(x * 0.95 + 4, -72, x * 1.1 + 5, -94);
        ctx.fillStyle = spec.stripes;
        ctx.fill();
      } else {
        ctx.moveTo(x * 1.1, -92);
        ctx.lineTo(x * 0.8, -58);
        ctx.stroke();
      }
    }
    for (const side of [-1, 1]) {
      for (const y of [-10, 14]) {
        ctx.beginPath();
        ctx.moveTo(side * 112, y);
        ctx.lineTo(side * 88, y + 6);
        ctx.stroke();
      }
    }
  }
  if (inked()) {
    const { w = 1, h = 1 } = spec.head ?? {};
    const lit = new Path2D();
    lit.ellipse(0, 0, 112 * w, 94 * h, 0, 0, Math.PI * 2);
    shade(ctx, spec, head, offsetShadow(lit, -16, -20, 0.97), [-46, -50, 90]);
  }
  ctx.restore();

  if (inked()) cheekFur(ctx, spec, line);

  ctx.strokeStyle = line;
  for (const side of [-1, 1]) drawEye(ctx, side * 42, -4, side, spec);

  drawNose(ctx, line);
  drawMouth(ctx, spec.mouth, spec.darkFur);

  ctx.strokeStyle = spec.darkFur ? '#ffffff' : INK;
  ctx.lineWidth = inked() ? 2 : 3;
  if (inked()) ctx.globalAlpha = 0.8;
  for (const side of [-1, 1]) {
    for (const [y0, y1] of [
      [26, 14],
      [34, 36],
      [42, 58],
    ]) {
      ctx.beginPath();
      ctx.moveTo(side * 58, y0);
      if (inked()) ctx.quadraticCurveTo(side * 100, (y0 + y1) / 2 - 6, side * 142, y1);
      else ctx.lineTo(side * 138, y1);
      ctx.stroke();
    }
  }
  ctx.globalAlpha = 1;

  if (spec.blush) {
    ctx.fillStyle = 'rgba(255, 110, 140, 0.5)';
    for (const side of [-1, 1]) {
      ctx.beginPath();
      ctx.ellipse(side * 70, 28, 18, 10, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  if (spec.wet) {
    // Clumped strands on the crown and a few drips
    ctx.strokeStyle = spec.darkFur ? 'rgba(255,255,255,0.35)' : 'rgba(40,30,50,0.45)';
    ctx.lineWidth = 4;
    for (let i = -4; i <= 4; i++) {
      ctx.beginPath();
      ctx.moveTo(i * 20, -88 + Math.abs(i) * 4);
      ctx.quadraticCurveTo(i * 22 + 6, -66, i * 24, -50 + Math.abs(i) * 3);
      ctx.stroke();
    }
    ctx.fillStyle = '#9ad8ff';
    for (const [dx, dy] of [
      [-96, 40],
      [104, 20],
      [-60, 92],
      [70, 96],
    ]) {
      ctx.beginPath();
      ctx.moveTo(dx, dy);
      ctx.quadraticCurveTo(dx - 9, dy + 16, dx, dy + 20);
      ctx.quadraticCurveTo(dx + 9, dy + 16, dx, dy);
      ctx.fill();
    }
  }
  spec.over?.(ctx);
}

function drawEars(ctx: CanvasRenderingContext2D, spec: CatSpec, line: string) {
  // Ear tip: normal, big (Bingus, Floppa), or flattened sideways (wet / angry cats).
  const tip = spec.flatEars ? [-150, -60] : spec.bigEars ? [-100, -172] : [-84, -138];
  const inner = spec.flatEars ? [-128, -58] : spec.bigEars ? [-88, -138] : [-76, -108];
  for (const side of [-1, 1]) {
    // In head-local x with the side folded in; `bend` bows the outer edge out and the inner edge in.
    const ear = (base0: number[], peak: number[], base1: number[], bend: number) => {
      ctx.beginPath();
      ctx.moveTo(side * base0[0], base0[1]);
      if (inked()) {
        ctx.quadraticCurveTo(side * ((base0[0] + peak[0]) / 2 - bend), (base0[1] + peak[1]) / 2 - bend * 0.3, side * peak[0], peak[1]);
        ctx.quadraticCurveTo(side * ((peak[0] + base1[0]) / 2 + bend * 0.6), (peak[1] + base1[1]) / 2 - bend * 0.5, side * base1[0], base1[1]);
      } else {
        ctx.lineTo(side * peak[0], peak[1]);
        ctx.lineTo(side * base1[0], base1[1]);
      }
      ctx.closePath();
    };
    ctx.fillStyle = spec.earColor ?? furFill(ctx, spec);
    ear([-104, -30], tip, [-22, -82], 14);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = spec.darkFur ? '#6a4a5a' : '#f4a8b8';
    ear([-88, -50], inner, [-44, -80], 8);
    ctx.fill();
    if (inked()) {
      // Fur strands growing out of the inner ear
      ctx.save();
      ctx.strokeStyle = spec.darkFur ? 'rgba(220,210,230,0.7)' : 'rgba(255,255,255,0.9)';
      ctx.lineWidth = 2.5;
      for (const k of [0.25, 0.5, 0.75]) {
        const x0 = -88 + (-44 + 88) * k;
        const y0 = -50 + (-80 + 50) * k;
        ctx.beginPath();
        ctx.moveTo(side * x0, y0);
        ctx.quadraticCurveTo(side * (x0 + (inner[0] - x0) * 0.3 + 6), y0 + (inner[1] - y0) * 0.35, side * (x0 + (inner[0] - x0) * 0.6), y0 + (inner[1] - y0) * 0.6);
        ctx.stroke();
      }
      ctx.restore();
    }
    if (spec.tufts) {
      ctx.save();
      ctx.strokeStyle = '#2a1e14';
      ctx.lineWidth = inked() ? 4 : 6;
      ctx.beginPath();
      ctx.moveTo(side * tip[0], tip[1]);
      ctx.lineTo(side * (tip[0] - 6), tip[1] - 36);
      ctx.moveTo(side * tip[0], tip[1]);
      ctx.lineTo(side * (tip[0] + 12), tip[1] - 30);
      if (inked()) {
        ctx.moveTo(side * tip[0], tip[1]);
        ctx.lineTo(side * (tip[0] + 3), tip[1] - 44);
      }
      ctx.stroke();
      ctx.restore();
    }
  }
  ctx.strokeStyle = line;
  ctx.lineWidth = outlineWidth();
}

/** Inked style: a few fine fur strokes on the cheeks and crown. */
function cheekFur(ctx: CanvasRenderingContext2D, spec: CatSpec, line: string) {
  const { w = 1 } = spec.head ?? {};
  ctx.save();
  ctx.strokeStyle = line;
  ctx.globalAlpha = 0.45;
  ctx.lineWidth = 2.5;
  for (const side of [-1, 1]) {
    for (const [x, y, len] of [
      [96, 26, 16],
      [90, 46, 14],
    ]) {
      ctx.beginPath();
      ctx.moveTo(side * x * w, y);
      ctx.quadraticCurveTo(side * (x * w - len * 0.6), y + 3, side * (x * w - len), y + 10);
      ctx.stroke();
    }
  }
  for (const x of [-10, 10]) {
    ctx.beginPath();
    ctx.moveTo(x, -86);
    ctx.lineTo(x * 0.6, -72);
    ctx.stroke();
  }
  ctx.restore();
}

function drawNose(ctx: CanvasRenderingContext2D, line: string) {
  ctx.fillStyle = '#f07890';
  ctx.beginPath();
  if (inked()) {
    ctx.moveTo(-12, 19);
    ctx.quadraticCurveTo(0, 14, 12, 19);
    ctx.quadraticCurveTo(8, 29, 0, 31);
    ctx.quadraticCurveTo(-8, 29, -12, 19);
    ctx.fill();
    ctx.strokeStyle = line;
    ctx.lineWidth = 2.5;
    ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.beginPath();
    ctx.ellipse(-4, 19, 4, 2.2, 0, 0, Math.PI * 2);
    ctx.fill();
  } else {
    ctx.moveTo(-10, 20);
    ctx.lineTo(10, 20);
    ctx.lineTo(0, 31);
    ctx.closePath();
    ctx.fill();
  }
}

export function drawEye(ctx: CanvasRenderingContext2D, x: number, y: number, side: number, spec: CatSpec) {
  const line = spec.darkFur ? '#f4f0ff' : INK;
  ctx.strokeStyle = line;
  ctx.lineWidth = inked() ? 4.5 : 6;
  switch (spec.eyes) {
    case 'happy':
      ctx.beginPath();
      ctx.arc(x, y + 8, 17, Math.PI * 1.1, Math.PI * 1.9);
      ctx.stroke();
      return;
    case 'closed':
      ctx.beginPath();
      ctx.arc(x, y - 6, 17, Math.PI * 0.15, Math.PI * 0.85);
      ctx.stroke();
      return;
    case 'blank': {
      const iris = side > 0 && spec.iris2 ? spec.iris2 : spec.iris;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(x, y, 27, 0, Math.PI * 2);
      ctx.fill();
      // Pupils drift apart and slightly down: not looking at anything
      const px = x + side * 6;
      const py = y + 5;
      if (iris) {
        ctx.fillStyle = iris;
        ctx.beginPath();
        ctx.arc(px, py, 12, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = INK;
      ctx.beginPath();
      ctx.arc(px, py, 4.5, 0, Math.PI * 2);
      ctx.fill();
      // Flat upper lid across the top third
      ctx.save();
      ctx.beginPath();
      ctx.arc(x, y, 28, 0, Math.PI * 2);
      ctx.clip();
      ctx.fillStyle = spec.mask ?? furFill(ctx, spec);
      ctx.fillRect(x - 30, y - 30, 60, 19);
      ctx.restore();
      ctx.strokeStyle = line;
      ctx.beginPath();
      ctx.moveTo(x - 26, y - 11);
      ctx.lineTo(x + 26, y - 11);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(x, y, 27, 0, Math.PI * 2);
      ctx.stroke();
      return;
    }
    case 'slant':
      ctx.beginPath();
      ctx.moveTo(x - side * 20, y - 10);
      ctx.lineTo(x + side * 18, y + 6);
      ctx.stroke();
      return;
    case 'squeeze':
      // >  <
      ctx.beginPath();
      ctx.moveTo(x - side * 16, y - 14);
      ctx.lineTo(x + side * 12, y);
      ctx.lineTo(x - side * 16, y + 14);
      ctx.stroke();
      return;
    case 'squint':
      ctx.beginPath();
      ctx.moveTo(x - 20, y - 4);
      ctx.quadraticCurveTo(x, y + 4, x + 20, y - 4);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x - 18 * side, y - 22);
      ctx.lineTo(x + 18 * side, y - 14);
      ctx.stroke();
      return;
    case 'dot':
      ctx.fillStyle = line;
      ctx.beginPath();
      ctx.arc(x, y, 9, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = spec.darkFur ? INK : '#ffffff';
      ctx.beginPath();
      ctx.arc(x - 3, y - 3, 3, 0, Math.PI * 2);
      ctx.fill();
      return;
    case 'wide': {
      const iris = side > 0 && spec.iris2 ? spec.iris2 : spec.iris;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(x, y, 28, 0, Math.PI * 2);
      ctx.fill();
      if (iris) {
        ctx.fillStyle = iris;
        ctx.beginPath();
        ctx.arc(x, y, 22, 0, Math.PI * 2);
        ctx.fill();
        irisShadow(ctx, x, y, 22, 22);
      }
      ctx.stroke();
      upperLid(ctx, x, y, 28, 28, line);
      ctx.fillStyle = INK;
      ctx.beginPath();
      if (spec.slit) ctx.ellipse(x, y, 5, 18, 0, 0, Math.PI * 2);
      else ctx.arc(x, y, iris ? (spec.bigPupil ? 14 : 7) : 8, 0, Math.PI * 2);
      ctx.fill();
      if (spec.iris) {
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(x - 6, y - 7, 4, 0, Math.PI * 2);
        ctx.fill();
      }
      return;
    }
    case 'laser':
      ctx.fillStyle = 'rgba(255, 40, 40, 0.3)';
      ctx.beginPath();
      ctx.ellipse(x, y, 30, 32, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ff3030';
      ctx.beginPath();
      ctx.ellipse(x, y, 21, 23, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fff0f0';
      ctx.beginPath();
      ctx.arc(x, y, 8, 0, Math.PI * 2);
      ctx.fill();
      return;
    case 'side':
    case 'up':
    case 'derp': {
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.ellipse(x, y, 23, 24, 0, 0, Math.PI * 2);
      ctx.fill();
      // Pupil offset: both to the right, both rolled up, or both pulled toward the nose.
      const dx = spec.eyes === 'side' ? 11 : spec.eyes === 'derp' ? -side * 9 : 0;
      const dy = spec.eyes === 'up' ? -17 : spec.eyes === 'derp' ? side * 4 : 0;
      if (spec.iris) {
        ctx.fillStyle = spec.iris;
        ctx.beginPath();
        ctx.arc(x + dx, y + dy, 13, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = INK;
      ctx.beginPath();
      ctx.arc(x + dx, y + dy, spec.eyes === 'derp' ? 9 : 7, 0, Math.PI * 2);
      ctx.fill();
      if (spec.eyes === 'side') {
        // Unimpressed lid across the top
        ctx.save();
        ctx.beginPath();
        ctx.ellipse(x, y, 24, 25, 0, 0, Math.PI * 2);
        ctx.clip();
        ctx.fillStyle = furFill(ctx, spec);
        ctx.fillRect(x - 30, y - 30, 60, 22);
        ctx.restore();
        ctx.strokeStyle = line;
        ctx.beginPath();
        ctx.moveTo(x - 23, y - 8);
        ctx.lineTo(x + 23, y - 8);
        ctx.stroke();
      }
      ctx.strokeStyle = line;
      ctx.beginPath();
      ctx.ellipse(x, y, 23, 24, 0, 0, Math.PI * 2);
      ctx.stroke();
      return;
    }
  }

  const teary = spec.eyes === 'teary';
  const rx = teary ? 25 : 21;
  const ry = teary ? 27 : 23;
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  ctx.fill();
  const iris = side > 0 && spec.iris2 ? spec.iris2 : spec.iris;
  if (iris) {
    ctx.fillStyle = iris;
    ctx.beginPath();
    ctx.ellipse(x, y + 1, rx - 4, ry - 3, 0, 0, Math.PI * 2);
    ctx.fill();
    irisShadow(ctx, x, y + 1, rx - 4, ry - 3);
  }
  const unsure = spec.eyes === 'unsure';
  ctx.fillStyle = INK;
  ctx.beginPath();
  if (unsure) ctx.ellipse(x, y - 2, 12, 13, 0, 0, Math.PI * 2);
  else ctx.ellipse(x, y + 2, teary ? 16 : 8, teary ? 19 : 17, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(x - 6, unsure ? y + 1 : y - 8, teary ? 7 : 5, 0, Math.PI * 2);
  ctx.fill();
  if (teary) {
    ctx.beginPath();
    ctx.arc(x + 7, y + 8, 3.5, 0, Math.PI * 2);
    ctx.fill();
  }
  if (spec.eyes === 'sparkle') {
    ctx.fillStyle = '#ffffff';
    star(ctx, x + 2, y + 2, 10);
  }

  const lidded = spec.eyes === 'grumpy' || spec.eyes === 'half' || unsure;
  if (lidded) {
    // Heavy lids: slanted down toward the nose for grumpy, level for half-closed, and down
    // toward the outer corners for unsure
    const inner = spec.eyes === 'grumpy' ? 4 : unsure ? -19 : 0;
    const outer = spec.eyes === 'grumpy' ? -8 : unsure ? -8 : 0;
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(x, y, rx + 1, ry + 1, 0, 0, Math.PI * 2);
    ctx.clip();
    ctx.fillStyle = spec.mask ?? furFill(ctx, spec);
    ctx.beginPath();
    ctx.moveTo(x - 30, y - 30);
    ctx.lineTo(x + 30, y - 30);
    ctx.lineTo(x + 30, y + (side < 0 ? inner : outer));
    ctx.lineTo(x - 30, y + (side < 0 ? outer : inner));
    ctx.closePath();
    ctx.fill();
    ctx.restore();
    ctx.strokeStyle = line;
    ctx.beginPath();
    ctx.moveTo(x - 24, y + (side < 0 ? outer + 1 : inner - 1));
    ctx.lineTo(x + 24, y + (side < 0 ? inner - 1 : outer + 1));
    ctx.stroke();
  }

  ctx.strokeStyle = line;
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  ctx.stroke();
  if (!lidded) upperLid(ctx, x, y, rx, ry, line);

  if (teary) {
    ctx.strokeStyle = '#8fd4ff';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(x, y + 4, rx - 2, Math.PI * 0.15, Math.PI * 0.85);
    ctx.stroke();
    ctx.fillStyle = '#8fd4ff';
    ctx.beginPath();
    ctx.moveTo(x + side * 14, y + 26);
    ctx.quadraticCurveTo(x + side * 4, y + 46, x + side * 14, y + 52);
    ctx.quadraticCurveTo(x + side * 24, y + 46, x + side * 14, y + 26);
    ctx.fill();
  }
}

/** Inked style: the top of the iris sits in the lid's shadow. */
function irisShadow(ctx: CanvasRenderingContext2D, x: number, y: number, rx: number, ry: number) {
  if (!inked()) return;
  ctx.save();
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  ctx.clip();
  const g = ctx.createLinearGradient(0, y - ry, 0, y + ry * 0.2);
  g.addColorStop(0, 'rgba(20,10,30,0.45)');
  g.addColorStop(1, 'rgba(20,10,30,0)');
  ctx.fillStyle = g;
  ctx.fillRect(x - rx, y - ry, rx * 2, ry * 1.2);
  ctx.restore();
}

/** Inked style: a heavy upper lid line over a thin eye outline. */
function upperLid(ctx: CanvasRenderingContext2D, x: number, y: number, rx: number, ry: number, line: string) {
  if (!inked()) return;
  ctx.save();
  ctx.strokeStyle = line;
  ctx.lineWidth = 8;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, Math.PI * 1.1, Math.PI * 1.9);
  ctx.stroke();
  ctx.restore();
}

export function drawMouth(ctx: CanvasRenderingContext2D, mouth: Mouth, darkFur?: boolean) {
  ctx.strokeStyle = darkFur ? '#f4f0ff' : INK;
  ctx.lineWidth = inked() ? 4 : 5;
  switch (mouth) {
    case 'w':
      ctx.beginPath();
      ctx.arc(-9, 33, 9, 0, Math.PI);
      ctx.moveTo(18, 33);
      ctx.arc(9, 33, 9, 0, Math.PI);
      ctx.stroke();
      return;
    case 'frown':
      ctx.beginPath();
      ctx.moveTo(0, 31);
      ctx.lineTo(0, 40);
      ctx.moveTo(-28, 58);
      ctx.quadraticCurveTo(0, 32, 28, 58);
      ctx.stroke();
      return;
    case 'smile':
      ctx.fillStyle = '#7a2030';
      ctx.beginPath();
      ctx.moveTo(-24, 38);
      ctx.quadraticCurveTo(0, 74, 24, 38);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      return;
    case 'smirk':
      ctx.beginPath();
      ctx.moveTo(-26, 40);
      ctx.quadraticCurveTo(10, 52, 34, 30);
      ctx.stroke();
      return;
    case 'polite':
      // Wide, tight-lipped smile
      ctx.beginPath();
      ctx.moveTo(0, 31);
      ctx.lineTo(0, 42);
      ctx.moveTo(-46, 36);
      ctx.quadraticCurveTo(0, 56, 46, 36);
      ctx.stroke();
      return;
    case 'open':
    case 'huge': {
      const big = mouth === 'huge';
      ctx.fillStyle = '#5a1424';
      ctx.beginPath();
      ctx.ellipse(0, big ? 60 : 56, big ? 40 : 26, big ? 42 : 30, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#f07890';
      ctx.beginPath();
      ctx.ellipse(0, big ? 84 : 72, big ? 24 : 15, big ? 13 : 10, 0, 0, Math.PI * 2);
      ctx.fill();
      if (big) {
        ctx.fillStyle = '#ffffff';
        for (const side of [-1, 1]) {
          ctx.beginPath();
          ctx.moveTo(side * 26, 30);
          ctx.lineTo(side * 18, 44);
          ctx.lineTo(side * 12, 28);
          ctx.fill();
        }
      }
      return;
    }
    case 'o':
      ctx.fillStyle = '#5a1424';
      ctx.beginPath();
      ctx.ellipse(0, 48, 10, 13, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      return;
    case 'pop':
      // Pop Cat: the whole lower face becomes one round open mouth
      ctx.fillStyle = '#7a2030';
      ctx.beginPath();
      ctx.ellipse(0, 52, 52, 48, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#d85a70';
      ctx.beginPath();
      ctx.ellipse(0, 76, 34, 20, 0, 0, Math.PI * 2);
      ctx.fill();
      return;
    case 'gasp':
      ctx.fillStyle = '#5a1424';
      ctx.beginPath();
      ctx.moveTo(-15, 40);
      ctx.quadraticCurveTo(0, 34, 15, 40);
      ctx.quadraticCurveTo(14, 72, 0, 74);
      ctx.quadraticCurveTo(-14, 72, -15, 40);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#f07890';
      ctx.beginPath();
      ctx.ellipse(0, 66, 9, 6, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      for (const side of [-1, 1]) {
        ctx.beginPath();
        ctx.moveTo(side * 12, 40);
        ctx.lineTo(side * 7, 52);
        ctx.lineTo(side * 4, 39);
        ctx.fill();
      }
      return;
    case 'blep':
      ctx.fillStyle = '#f07890';
      ctx.beginPath();
      ctx.ellipse(0, 50, 12, 16, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, 42);
      ctx.lineTo(0, 58);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(-9, 33, 9, 0, Math.PI);
      ctx.moveTo(18, 33);
      ctx.arc(9, 33, 9, 0, Math.PI);
      ctx.stroke();
      return;
    case 'flat':
      ctx.beginPath();
      ctx.moveTo(0, 31);
      ctx.lineTo(0, 42);
      ctx.moveTo(-16, 44);
      ctx.lineTo(16, 44);
      ctx.stroke();
      return;
  }
}

// ---------------------------------------------------------------- scene helpers

export function bigText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, size: number, color: string, rot: number) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  ctx.font = `900 ${size}px "Noto Sans TC", "Microsoft JhengHei", sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.lineWidth = 8;
  ctx.strokeStyle = INK;
  ctx.strokeText(text, 0, 0);
  ctx.fillStyle = color;
  ctx.fillText(text, 0, 0);
  ctx.restore();
}

export function notes(ctx: CanvasRenderingContext2D, a: ArtArea, glyphs: string[]) {
  const spots = [
    [a.x + 60, a.y + 90, -0.2],
    [a.x + a.w - 60, a.y + 120, 0.2],
    [a.x + a.w - 90, a.y + a.h - 110, 0.1],
  ];
  glyphs.forEach((g, i) => bigText(ctx, g, spots[i][0], spots[i][1], 64, '#ffffff', spots[i][2]));
}

export function motionLines(ctx: CanvasRenderingContext2D, x: number, y: number, n: number) {
  ctx.strokeStyle = 'rgba(255,255,255,0.85)';
  ctx.lineWidth = 4;
  for (let i = 0; i < n; i++) {
    const dx = (i - (n - 1) / 2) * 22;
    ctx.beginPath();
    ctx.moveTo(x + dx, y - 14);
    ctx.lineTo(x + dx * 1.3, y - 40);
    ctx.stroke();
  }
}

export function burstLines(ctx: CanvasRenderingContext2D, x: number, y: number, n: number, r0: number, r1: number, color: string) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 6;
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(x + Math.cos(a) * r0, y + Math.sin(a) * r0);
    ctx.lineTo(x + Math.cos(a) * r1, y + Math.sin(a) * r1);
    ctx.stroke();
  }
}

export function sparkle(ctx: CanvasRenderingContext2D, x: number, y: number, r: number) {
  ctx.fillStyle = '#fff6c8';
  ctx.beginPath();
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    const rr = i % 2 === 0 ? r : r * 0.3;
    ctx.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr);
  }
  ctx.closePath();
  ctx.fill();
}

export function star(ctx: CanvasRenderingContext2D, x: number, y: number, r: number) {
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const a = (i / 10) * Math.PI * 2 - Math.PI / 2;
    const rr = i % 2 === 0 ? r : r * 0.45;
    ctx.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr);
  }
  ctx.closePath();
  ctx.fill();
}

