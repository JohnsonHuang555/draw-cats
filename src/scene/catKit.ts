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
  | 'derp';
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
export type SceneDraw = (ctx: CanvasRenderingContext2D, a: ArtArea, head: Head) => void;

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
  /** Colour of the paw tips (quad pose). */
  paws?: string;
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

export function drawCat(ctx: CanvasRenderingContext2D, spec: CatSpec, a: ArtArea) {
  const s = spec.s ?? 1;
  const head = { x: a.x + a.w / 2 + (spec.dx ?? 0), y: a.y + a.h * 0.5 + (spec.dy ?? 0), s };

  ctx.save();
  spec.back?.(ctx, a, head);
  if (!spec.noCat) {
    ctx.globalAlpha = spec.alpha ?? 1;
    if (spec.pose) drawBody(ctx, head, spec);
    ctx.translate(head.x, head.y);
    ctx.rotate(spec.tilt ?? 0);
    ctx.scale(s, s);
    drawHead(ctx, spec);
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
  ctx.fillStyle = furFill(ctx, spec);
  ctx.strokeStyle = INK;
  ctx.lineWidth = 6;
  const belly = spec.belly ?? (spec.tuxedo ? '#ffffff' : spec.muzzle);

  if (spec.pose === 'quad') {
    // Standing on all fours, facing the viewer: rump behind, front legs straight down
    ctx.beginPath();
    ctx.ellipse(-30, 70, 170, 105, -0.08, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    for (const [x, top, h] of [
      [-150, 110, 120],
      [80, 120, 110],
      [-58, 70, 190],
      [52, 70, 190],
    ]) {
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
    }
    if (belly) {
      ctx.fillStyle = belly;
      ctx.beginPath();
      ctx.ellipse(0, 110, 48, 50, 0, 0, Math.PI * 2);
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
    // Upright with arms flung out
    for (const side of [-1, 1]) {
      ctx.fillStyle = furFill(ctx, spec);
      ctx.save();
      ctx.translate(side * 80, 150);
      ctx.rotate(side * -0.9);
      ctx.beginPath();
      ctx.roundRect(-26, -150, 52, 160, 26);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
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

export function drawHead(ctx: CanvasRenderingContext2D, spec: CatSpec) {
  spec.under?.(ctx);
  ctx.strokeStyle = INK;
  ctx.lineWidth = 6;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';

  if (!spec.noEars) {
    // Ear tip: normal, big (Bingus, Floppa), or flattened sideways (wet / angry cats).
    const tip = spec.flatEars ? [-150, -60] : spec.bigEars ? [-100, -172] : [-84, -138];
    const inner = spec.flatEars ? [-128, -58] : spec.bigEars ? [-88, -138] : [-76, -108];
    for (const side of [-1, 1]) {
      ctx.fillStyle = spec.earColor ?? furFill(ctx, spec);
      ctx.beginPath();
      ctx.moveTo(side * -104, -30);
      ctx.lineTo(side * tip[0], tip[1]);
      ctx.lineTo(side * -22, -82);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = spec.darkFur ? '#6a4a5a' : '#f4a8b8';
      ctx.beginPath();
      ctx.moveTo(side * -88, -50);
      ctx.lineTo(side * inner[0], inner[1]);
      ctx.lineTo(side * -44, -80);
      ctx.closePath();
      ctx.fill();
      if (spec.tufts) {
        ctx.strokeStyle = '#2a1e14';
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.moveTo(side * tip[0], tip[1]);
        ctx.lineTo(side * (tip[0] - 6), tip[1] - 36);
        ctx.moveTo(side * tip[0], tip[1]);
        ctx.lineTo(side * (tip[0] + 12), tip[1] - 30);
        ctx.stroke();
        ctx.strokeStyle = INK;
      }
    }
  }

  ctx.fillStyle = furFill(ctx, spec);
  ctx.beginPath();
  if (spec.spiky) {
    const n = 22;
    for (let i = 0; i <= n * 2; i++) {
      const a = (i / (n * 2)) * Math.PI * 2;
      const r = i % 2 === 0 ? 1.18 : 1;
      ctx.lineTo(Math.cos(a) * 112 * r, Math.sin(a) * 94 * r);
    }
  } else {
    ctx.ellipse(0, 0, 112, 94, 0, 0, Math.PI * 2);
  }
  ctx.fill();
  ctx.stroke();

  ctx.save();
  ctx.beginPath();
  ctx.ellipse(0, 0, 110, 92, 0, 0, Math.PI * 2);
  ctx.clip();
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
    ctx.ellipse(0, 45, 62, 42, 0, 0, Math.PI * 2);
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
      ctx.moveTo(x * 1.1, -92);
      ctx.lineTo(x * 0.8, -58);
      ctx.stroke();
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
  ctx.restore();

  ctx.strokeStyle = INK;
  ctx.lineWidth = 6;
  for (const side of [-1, 1]) drawEye(ctx, side * 42, -4, side, spec);

  ctx.fillStyle = '#f07890';
  ctx.beginPath();
  ctx.moveTo(-10, 20);
  ctx.lineTo(10, 20);
  ctx.lineTo(0, 31);
  ctx.closePath();
  ctx.fill();

  drawMouth(ctx, spec.mouth, spec.darkFur);

  ctx.strokeStyle = spec.darkFur ? '#ffffff' : INK;
  ctx.lineWidth = 3;
  for (const side of [-1, 1]) {
    for (const [y0, y1] of [
      [26, 14],
      [34, 36],
      [42, 58],
    ]) {
      ctx.beginPath();
      ctx.moveTo(side * 58, y0);
      ctx.lineTo(side * 138, y1);
      ctx.stroke();
    }
  }

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

export function drawEye(ctx: CanvasRenderingContext2D, x: number, y: number, side: number, spec: CatSpec) {
  const line = spec.darkFur ? '#f4f0ff' : INK;
  ctx.strokeStyle = line;
  ctx.lineWidth = 6;
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
      }
      ctx.stroke();
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
  }
  ctx.fillStyle = INK;
  ctx.beginPath();
  ctx.ellipse(x, y + 2, teary ? 16 : 8, teary ? 19 : 17, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(x - 6, y - 8, teary ? 7 : 5, 0, Math.PI * 2);
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

  if (spec.eyes === 'grumpy' || spec.eyes === 'half') {
    // Heavy lids: slanted toward the nose for grumpy, level for half-closed
    const grumpy = spec.eyes === 'grumpy';
    const inner = grumpy ? 4 : 0;
    const outer = grumpy ? -8 : 0;
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

export function drawMouth(ctx: CanvasRenderingContext2D, mouth: Mouth, darkFur?: boolean) {
  ctx.strokeStyle = darkFur ? '#f4f0ff' : INK;
  ctx.lineWidth = 5;
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

export function spinArcs(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, color: string) {
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 7;
  for (let k = 0; k < 3; k++) {
    const start = (k / 3) * Math.PI * 2;
    const end = start + 1.3;
    ctx.beginPath();
    ctx.arc(x, y, r, start, end);
    ctx.stroke();
    ctx.save();
    ctx.translate(x + Math.cos(end) * r, y + Math.sin(end) * r);
    ctx.rotate(end + Math.PI / 2);
    ctx.beginPath();
    ctx.moveTo(10, 0);
    ctx.lineTo(-10, -10);
    ctx.lineTo(-10, 10);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
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

