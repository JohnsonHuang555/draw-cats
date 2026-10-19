/**
 * Cartoon art for every Card, drawn with Canvas 2D: hand-made specs for Meme Cats, and specs
 * assembled from Traits for Generated Cats. A real image in src/assets/cards/<card-id>.* replaces
 * a Meme Cat's cartoon (see textures.ts).
 */
import type { Card, GeneratedCat } from '../domain/cards';
import type { Traits } from '../domain/traits';

export interface ArtArea {
  x: number;
  y: number;
  w: number;
  h: number;
}

type Eyes = 'normal' | 'grumpy' | 'teary' | 'wide' | 'happy' | 'dot' | 'squint' | 'closed' | 'half' | 'squeeze' | 'sparkle' | 'laser';
type Mouth = 'w' | 'frown' | 'open' | 'o' | 'smile' | 'flat' | 'smirk' | 'polite' | 'huge';
type Pose = 'sit' | 'loaf' | 'stand';
type Paint = string | CanvasGradient;
type Draw = (ctx: CanvasRenderingContext2D) => void;
type Head = { x: number; y: number; s: number };
type SceneDraw = (ctx: CanvasRenderingContext2D, a: ArtArea, head: Head) => void;

interface CatSpec {
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
  spiky?: boolean;
  blush?: boolean;
  tuxedo?: boolean;
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

const INK = '#241a2e';

// ---------------------------------------------------------------- entry point

export function drawCardArt(ctx: CanvasRenderingContext2D, card: Card, a: ArtArea) {
  if (card.kind === 'generated') {
    drawTraitBackground(ctx, card, a);
    drawCat(ctx, specFromTraits(card), a);
  } else {
    drawMemeBackground(ctx, card.hue, card.id, a);
    const spec = MEME_CATS[card.id];
    if (spec) drawCat(ctx, spec, a);
  }
}

function drawCat(ctx: CanvasRenderingContext2D, spec: CatSpec, a: ArtArea) {
  const s = spec.s ?? 1;
  const head = { x: a.x + a.w / 2 + (spec.dx ?? 0), y: a.y + a.h * 0.5 + (spec.dy ?? 0), s };

  ctx.save();
  spec.back?.(ctx, a, head);
  ctx.globalAlpha = spec.alpha ?? 1;
  if (spec.pose) drawBody(ctx, head, spec);
  ctx.translate(head.x, head.y);
  ctx.rotate(spec.tilt ?? 0);
  ctx.scale(s, s);
  drawHead(ctx, spec);
  ctx.restore();

  ctx.save();
  spec.front?.(ctx, a, head);
  ctx.restore();
}

// ---------------------------------------------------------------- backgrounds

function seededRandom(seed: string) {
  let h = 2166136261;
  for (const ch of seed) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
}

function skyGradient(ctx: CanvasRenderingContext2D, hue: number, a: ArtArea, light = 48) {
  const g = ctx.createLinearGradient(0, a.y, 0, a.y + a.h);
  g.addColorStop(0, `hsl(${hue}, 65%, 24%)`);
  g.addColorStop(1, `hsl(${(hue + 40) % 360}, 75%, ${light}%)`);
  ctx.fillStyle = g;
  ctx.fillRect(a.x, a.y, a.w, a.h);
}

function sunburst(ctx: CanvasRenderingContext2D, hue: number, a: ArtArea, rand: () => number, alpha: number) {
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

function orbs(ctx: CanvasRenderingContext2D, hue: number, a: ArtArea, rand: () => number) {
  for (let i = 0; i < 22; i++) {
    ctx.globalAlpha = 0.12 + rand() * 0.3;
    ctx.fillStyle = `hsl(${(hue + rand() * 80) % 360}, 90%, 75%)`;
    ctx.beginPath();
    ctx.arc(a.x + rand() * a.w, a.y + rand() * a.h, 3 + rand() * 16, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

function drawMemeBackground(ctx: CanvasRenderingContext2D, hue: number, seed: string, a: ArtArea) {
  const rand = seededRandom(seed);
  skyGradient(ctx, hue, a);
  sunburst(ctx, hue, a, rand, 0.18);
  orbs(ctx, hue, a, rand);
}

function drawTraitBackground(ctx: CanvasRenderingContext2D, cat: GeneratedCat, a: ArtArea) {
  const rand = seededRandom(cat.id);
  const hue = cat.hue;
  switch (cat.traits.background) {
    case 'solid':
      skyGradient(ctx, hue, a, 40);
      return;
    case 'dots':
      skyGradient(ctx, hue, a, 40);
      ctx.fillStyle = `hsla(${(hue + 180) % 360}, 80%, 80%, 0.25)`;
      for (let y = a.y; y < a.y + a.h + 30; y += 34) {
        for (let x = a.x + ((y / 34) % 2) * 17; x < a.x + a.w + 30; x += 34) {
          ctx.beginPath();
          ctx.arc(x, y, 7, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      return;
    case 'stripes':
      skyGradient(ctx, hue, a, 40);
      ctx.fillStyle = `hsla(${(hue + 30) % 360}, 80%, 80%, 0.18)`;
      for (let x = a.x - a.h; x < a.x + a.w; x += 44) {
        ctx.beginPath();
        ctx.moveTo(x, a.y + a.h);
        ctx.lineTo(x + 22, a.y + a.h);
        ctx.lineTo(x + 22 + a.h, a.y);
        ctx.lineTo(x + a.h, a.y);
        ctx.fill();
      }
      return;
    case 'cosmic': {
      const g = ctx.createRadialGradient(a.x + a.w * 0.7, a.y + a.h * 0.3, 10, a.x + a.w / 2, a.y + a.h / 2, a.h);
      g.addColorStop(0, `hsl(${hue}, 70%, 35%)`);
      g.addColorStop(0.5, '#140c38');
      g.addColorStop(1, '#05030f');
      ctx.fillStyle = g;
      ctx.fillRect(a.x, a.y, a.w, a.h);
      for (let i = 0; i < 70; i++) {
        ctx.globalAlpha = 0.4 + rand() * 0.6;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(a.x + rand() * a.w, a.y + rand() * a.h, rand() * 2.4, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      // A ringed planet
      const px = a.x + a.w * 0.82;
      const py = a.y + a.h * 0.18;
      ctx.fillStyle = `hsl(${(hue + 60) % 360}, 70%, 60%)`;
      ctx.beginPath();
      ctx.arc(px, py, 26, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.7)';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.ellipse(px, py, 46, 11, -0.4, 0, Math.PI * 2);
      ctx.stroke();
      return;
    }
    case 'sunburst':
      skyGradient(ctx, hue, a, 55);
      sunburst(ctx, hue, a, rand, 0.32);
      orbs(ctx, hue, a, rand);
      return;
  }
}

// ---------------------------------------------------------------- Generated Cats

const FUR: Record<string, Partial<CatSpec> & { fur: string }> = {
  orange: { fur: '#f0a050', stripes: '#c8742c', muzzle: '#fff1e0' },
  black: { fur: '#2a262e', darkFur: true },
  white: { fur: '#f6f4f0' },
  tabby: { fur: '#9c9ca2', stripes: '#62626a', muzzle: '#eceaea' },
  tuxedo: { fur: '#26232a', darkFur: true, tuxedo: true },
  calico: { fur: '#f8f4ee' },
  siamese: { fur: '#efe2cc', mask: '#5a4234', earColor: '#5a4234' },
  gold: {
    fur: '#f2c64a',
    furPaint: (ctx) => {
      const g = ctx.createLinearGradient(-120, -120, 120, 120);
      g.addColorStop(0, '#fff3b0');
      g.addColorStop(0.45, '#e8b020');
      g.addColorStop(0.55, '#ffe680');
      g.addColorStop(1, '#b07a10');
      return g;
    },
  },
  ghost: { fur: '#dfe8ff', alpha: 0.72 },
  galaxy: {
    fur: '#2a1e6a',
    darkFur: true,
    furPaint: (ctx) => {
      const g = ctx.createLinearGradient(-120, -120, 120, 120);
      g.addColorStop(0, '#3a1f8a');
      g.addColorStop(0.5, '#141048');
      g.addColorStop(1, '#6a2a9a');
      return g;
    },
  },
  rainbow: {
    fur: '#ff9ad2',
    furPaint: (ctx) => {
      const g = ctx.createLinearGradient(-120, -100, 120, 100);
      ['#ff6b6b', '#ffb36b', '#ffe66b', '#7be08a', '#6bc5ff', '#b48aff'].forEach((c, i) => g.addColorStop(i / 5, c));
      return g;
    },
  },
};

const IRIS = ['#9cc85a', '#e8c040', '#6cb8e8', '#c89a3a'];

function specFromTraits(cat: GeneratedCat): CatSpec {
  const t = cat.traits;
  const rand = seededRandom(`${cat.id}:art`);
  const fur = FUR[t.fur];
  const iris = IRIS[Math.floor(rand() * IRIS.length)];
  const spec: CatSpec = {
    ...fur,
    eyes: EYES_FROM_TRAIT[t.eyes],
    mouth: MOUTH_FROM_TRAIT[t.expression],
    iris,
    iris2: t.eyes === 'hetero' ? (iris === '#6cb8e8' ? '#e8c040' : '#6cb8e8') : undefined,
    blush: t.face === 'blush',
    pose: 'sit',
    dy: -30,
    s: 0.92,
  };
  if (t.fur === 'calico') spec.cover = calicoPatches;
  if (t.fur === 'galaxy') spec.cover = galaxySpecks;
  if (t.fur === 'ghost') spec.back = (ctx, _a, head) => glowBehind(ctx, head, 'rgba(190, 210, 255, 0.55)');
  spec.over = (ctx) => {
    drawFaceAccessory(ctx, t);
    drawHeadwear(ctx, t);
  };
  spec.front = (ctx, a, head) => drawHeld(ctx, t, a, head);
  if (t.eyes === 'laser') {
    const prevFront = spec.front;
    spec.front = (ctx, a, head) => {
      prevFront(ctx, a, head);
      laserBeams(ctx, a, head);
    };
  }
  return spec;
}

const EYES_FROM_TRAIT: Record<string, Eyes> = {
  round: 'normal',
  half: 'half',
  squint: 'closed',
  sparkle: 'sparkle',
  hetero: 'normal',
  laser: 'laser',
};

const MOUTH_FROM_TRAIT: Record<string, Mouth> = {
  smile: 'smile',
  blank: 'flat',
  pout: 'o',
  yawn: 'open',
  smirk: 'smirk',
};

const calicoPatches: Draw = (ctx) => {
  ctx.fillStyle = '#e8903a';
  ctx.beginPath();
  ctx.ellipse(-70, -40, 60, 50, 0.4, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#2a262e';
  ctx.beginPath();
  ctx.ellipse(75, -55, 50, 40, -0.3, 0, Math.PI * 2);
  ctx.fill();
};

const galaxySpecks: Draw = (ctx) => {
  const rand = seededRandom('galaxy');
  ctx.fillStyle = '#ffffff';
  for (let i = 0; i < 40; i++) {
    ctx.globalAlpha = 0.4 + rand() * 0.6;
    ctx.beginPath();
    ctx.arc(-110 + rand() * 220, -90 + rand() * 180, rand() * 2.6, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
};

function glowBehind(ctx: CanvasRenderingContext2D, head: Head, color: string) {
  const g = ctx.createRadialGradient(head.x, head.y + 40, 20, head.x, head.y + 40, 230);
  g.addColorStop(0, color);
  g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g;
  ctx.fillRect(head.x - 240, head.y - 200, 480, 480);
}

function drawHeadwear(ctx: CanvasRenderingContext2D, t: Traits) {
  ctx.strokeStyle = INK;
  ctx.lineWidth = 5;
  switch (t.headwear) {
    case 'beanie':
      ctx.fillStyle = '#e04a5a';
      ctx.beginPath();
      ctx.moveTo(-100, -48);
      ctx.bezierCurveTo(-100, -150, 100, -150, 100, -48);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.roundRect(-108, -62, 216, 28, 12);
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(0, -130, 18, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      return;
    case 'ribbon':
      ctx.fillStyle = '#ff6fa8';
      for (const side of [-1, 1]) {
        ctx.beginPath();
        ctx.moveTo(60, -78);
        ctx.lineTo(60 + side * 38, -112);
        ctx.lineTo(60 + side * 38, -44);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }
      ctx.beginPath();
      ctx.arc(60, -78, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      return;
    case 'party':
      ctx.fillStyle = '#5ac8f0';
      ctx.beginPath();
      ctx.moveTo(-40, -82);
      ctx.lineTo(10, -200);
      ctx.lineTo(50, -86);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#ffe14a';
      for (const [x, y] of [
        [-8, -110],
        [18, -140],
        [8, -170],
      ]) {
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = '#ff6fa8';
      ctx.beginPath();
      ctx.arc(10, -204, 13, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      return;
    case 'crown': {
      const g = ctx.createLinearGradient(0, -170, 0, -80);
      g.addColorStop(0, '#fff3a0');
      g.addColorStop(1, '#e0a020');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.moveTo(-70, -80);
      ctx.lineTo(-80, -160);
      ctx.lineTo(-38, -118);
      ctx.lineTo(0, -175);
      ctx.lineTo(38, -118);
      ctx.lineTo(80, -160);
      ctx.lineTo(70, -80);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      for (const [x, c] of [
        [-40, '#e83a5a'],
        [0, '#3a8ae8'],
        [40, '#3ae87a'],
      ] as const) {
        ctx.fillStyle = c;
        ctx.beginPath();
        ctx.arc(x, -98, 9, 0, Math.PI * 2);
        ctx.fill();
      }
      return;
    }
    case 'halo':
      ctx.strokeStyle = '#fff3a0';
      ctx.lineWidth = 12;
      ctx.shadowColor = '#ffe680';
      ctx.shadowBlur = 24;
      ctx.beginPath();
      ctx.ellipse(0, -150, 78, 20, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.shadowBlur = 0;
      return;
    case 'wizard':
      ctx.fillStyle = '#3a2a8a';
      ctx.beginPath();
      ctx.moveTo(-120, -70);
      ctx.quadraticCurveTo(0, -95, 120, -70);
      ctx.lineTo(70, -90);
      ctx.lineTo(30, -230);
      ctx.lineTo(-60, -95);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#ffe14a';
      star(ctx, 5, -140, 14);
      star(ctx, 30, -190, 9);
      return;
  }
}

function drawFaceAccessory(ctx: CanvasRenderingContext2D, t: Traits) {
  ctx.strokeStyle = INK;
  ctx.lineWidth = 5;
  if (t.face === 'sunglasses') {
    ctx.fillStyle = '#111018';
    for (const side of [-1, 1]) {
      ctx.beginPath();
      ctx.roundRect(side * 42 - 32, -26, 64, 40, 14);
      ctx.fill();
    }
    ctx.beginPath();
    ctx.moveTo(-10, -12);
    ctx.lineTo(10, -12);
    ctx.moveTo(-74, -16);
    ctx.lineTo(-108, -24);
    ctx.moveTo(74, -16);
    ctx.lineTo(108, -24);
    ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.fillRect(-64, -20, 16, 6);
    ctx.fillRect(20, -20, 16, 6);
  } else if (t.face === 'pixel') {
    // "Deal with it" glasses
    ctx.fillStyle = '#000000';
    const px = 10;
    ctx.fillRect(-90, -24, 180, px);
    for (const side of [-1, 1]) {
      const x0 = side < 0 ? -80 : 10;
      ctx.fillRect(x0, -14, 70, px * 2);
      ctx.fillRect(x0 + 10, -14 + px * 2, 50, px);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(x0 + 10, -14, px, px);
      ctx.fillRect(x0 + 20, -4, px, px);
      ctx.fillStyle = '#000000';
    }
  }
}

function drawHeld(ctx: CanvasRenderingContext2D, t: Traits, a: ArtArea, head: Head) {
  const s = head.s;
  const pawY = head.y + 210 * s;
  ctx.strokeStyle = INK;
  ctx.lineWidth = 5;
  switch (t.held) {
    case 'fish': {
      // Held in the mouth
      ctx.save();
      ctx.translate(head.x + 40 * s, head.y + 55 * s);
      ctx.rotate(0.2);
      ctx.fillStyle = '#8ac8e8';
      ctx.beginPath();
      ctx.ellipse(0, 0, 50, 18, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(45, 0);
      ctx.lineTo(75, -18);
      ctx.lineTo(75, 18);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = INK;
      ctx.beginPath();
      ctx.arc(-30, -4, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      return;
    }
    case 'yarn':
      ctx.fillStyle = '#ff7a9a';
      ctx.beginPath();
      ctx.arc(head.x, pawY - 10, 42, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.strokeStyle = 'rgba(255,255,255,0.7)';
      ctx.lineWidth = 3;
      for (const r of [-0.6, 0, 0.6]) {
        ctx.beginPath();
        ctx.ellipse(head.x, pawY - 10, 38, 14, r, 0, Math.PI * 2);
        ctx.stroke();
      }
      return;
    case 'boba': {
      const x = head.x + 2;
      const y = pawY - 70;
      ctx.fillStyle = 'rgba(240, 220, 190, 0.95)';
      ctx.beginPath();
      ctx.moveTo(x - 36, y);
      ctx.lineTo(x - 28, y + 100);
      ctx.lineTo(x + 28, y + 100);
      ctx.lineTo(x + 36, y);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#3a2214';
      for (let i = 0; i < 9; i++) {
        ctx.beginPath();
        ctx.arc(x - 18 + (i % 4) * 12, y + 92 - Math.floor(i / 4) * 12, 6, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.strokeStyle = '#ff6fa8';
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.moveTo(x + 8, y + 70);
      ctx.lineTo(x + 22, y - 36);
      ctx.stroke();
      return;
    }
    case 'saber':
      ctx.save();
      ctx.translate(head.x + 110 * s, pawY - 20);
      ctx.rotate(-0.5);
      ctx.shadowColor = '#5aff8a';
      ctx.shadowBlur = 30;
      ctx.fillStyle = '#c8ffd8';
      ctx.beginPath();
      ctx.roundRect(-7, -190, 14, 190, 7);
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.fillStyle = '#8a8a96';
      ctx.fillRect(-10, 0, 20, 46);
      ctx.strokeRect(-10, 0, 20, 46);
      ctx.restore();
      return;
  }
  void a;
}

function laserBeams(ctx: CanvasRenderingContext2D, a: ArtArea, head: Head) {
  ctx.save();
  ctx.lineCap = 'round';
  // Glow built from layered strokes rather than shadowBlur, which some GPUs render wrongly.
  for (const [width, color] of [
    [26, 'rgba(255, 40, 40, 0.18)'],
    [16, 'rgba(255, 60, 60, 0.4)'],
    [6, 'rgba(255, 220, 220, 0.95)'],
  ] as const) {
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    for (const side of [-1, 1]) {
      const ex = head.x + side * 42 * head.s;
      const ey = head.y - 4 * head.s;
      ctx.beginPath();
      ctx.moveTo(ex, ey);
      ctx.lineTo(ex + side * 140, a.y + a.h);
      ctx.stroke();
    }
  }
  ctx.restore();
}

// ---------------------------------------------------------------- Meme Cats

const MEME_CATS: Record<string, CatSpec> = {
  'ssr-oiia': {
    fur: '#8f8478',
    stripes: '#564c42',
    muzzle: '#d8cfc2',
    eyes: 'wide',
    mouth: 'huge',
    pose: 'sit',
    dy: -25,
    back: (ctx, _a, head) => spinArcs(ctx, head.x, head.y + 40, 190, 'rgba(255,255,255,0.8)'),
    front: (ctx, a) => bigText(ctx, 'OIIA', a.x + a.w / 2, a.y + 50, 58, '#ffffff', 0),
  },
  'ssr-grumpy': {
    fur: '#efe4d2',
    mask: '#8b6a4e',
    eyes: 'grumpy',
    iris: '#7cc6ee',
    mouth: 'frown',
    pose: 'sit',
    s: 1.05,
    dy: -25,
  },
  'sr-nyan': {
    fur: '#9a9aa2',
    eyes: 'dot',
    mouth: 'w',
    blush: true,
    s: 0.55,
    dx: 95,
    dy: -5,
    back: (ctx, a, head) => {
      const colors = ['#ff3b3b', '#ff9a2a', '#ffe02a', '#4ad83a', '#2a9aff', '#8a4aff'];
      const bodyX = head.x - 175;
      const top = head.y - 60;
      colors.forEach((c, i) => {
        ctx.fillStyle = c;
        for (let x = a.x - 10; x < bodyX + 20; x += 40) {
          const wave = (Math.floor((x - a.x) / 40) % 2) * 8;
          ctx.fillRect(x, top + i * 20 + wave, 41, 21);
        }
      });
      ctx.strokeStyle = INK;
      ctx.lineWidth = 5;
      ctx.fillStyle = '#f2c98a';
      ctx.beginPath();
      ctx.roundRect(bodyX, top - 15, 190, 150, 18);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#ff9ad2';
      ctx.beginPath();
      ctx.roundRect(bodyX + 14, top - 1, 162, 122, 14);
      ctx.fill();
      ctx.fillStyle = '#e8287a';
      for (let i = 0; i < 12; i++) ctx.fillRect(bodyX + 30 + ((i * 53) % 130), top + 15 + ((i * 37) % 95), 9, 9);
      ctx.fillStyle = '#9a9aa2';
      for (const lx of [bodyX + 15, bodyX + 60, bodyX + 120, bodyX + 160]) {
        ctx.beginPath();
        ctx.roundRect(lx, top + 128, 24, 30, 8);
        ctx.fill();
        ctx.stroke();
      }
      ctx.beginPath();
      ctx.roundRect(bodyX - 40, top + 60, 48, 20, 10);
      ctx.fill();
      ctx.stroke();
      for (let i = 0; i < 6; i++) sparkle(ctx, a.x + 40 + ((i * 97) % (a.w - 60)), a.y + 40 + ((i * 151) % (a.h - 60)), 10 + (i % 3) * 5);
    },
  },
  'sr-chipi': {
    // Brown-grey tabby close-up, bobbing its head
    fur: '#9a8670',
    stripes: '#5e4c3a',
    muzzle: '#d8cbb8',
    eyes: 'half',
    iris: '#b8a050',
    mouth: 'w',
    tilt: 0.22,
    s: 1.2,
    dy: 20,
    front: (ctx, a) => {
      notes(ctx, a, ['♪', '♫', '♪']);
      bigText(ctx, 'CHIPI CHIPI', a.x + a.w / 2, a.y + a.h - 40, 40, '#ffe14a', 0);
    },
  },
  'sr-happy': {
    // Grey-brown cat standing on its hind legs, arms out
    fur: '#a89a88',
    muzzle: '#f0ebe4',
    eyes: 'dot',
    mouth: 'smile',
    pose: 'stand',
    s: 0.7,
    dy: -95,
    front: (ctx, a) => {
      bigText(ctx, 'HAPPY', a.x + a.w / 2, a.y + 46, 46, '#ffe14a', 0);
      sparkle(ctx, a.x + 50, a.y + 120, 18);
      sparkle(ctx, a.x + a.w - 50, a.y + 150, 14);
    },
  },
  'sr-pop': {
    // Cream cat with an orange ear patch, mouth popped wide open
    fur: '#f3ece2',
    eyes: 'normal',
    iris: '#8a7a50',
    mouth: 'huge',
    s: 1.15,
    dy: 10,
    cover: (ctx) => {
      ctx.fillStyle = '#d89a5a';
      ctx.beginPath();
      ctx.ellipse(-80, -60, 55, 45, 0.5, 0, Math.PI * 2);
      ctx.fill();
    },
    earColor: '#d89a5a',
    back: (ctx, _a, head) => burstLines(ctx, head.x, head.y + 50, 12, 165, 215, 'rgba(255,255,255,0.55)'),
  },
  'r-huh': {
    // Chubby white cat with a black cap, mouth open: "huh?"
    fur: '#fbfbf8',
    eyes: 'wide',
    mouth: 'o',
    pose: 'sit',
    dy: -25,
    cover: (ctx) => {
      ctx.fillStyle = '#2a262e';
      ctx.beginPath();
      ctx.ellipse(10, -78, 80, 36, 0.1, 0, Math.PI * 2);
      ctx.fill();
    },
    earColor: '#2a262e',
    front: (ctx, a) => {
      bigText(ctx, '？', a.x + a.w - 70, a.y + 80, 90, '#ffffff', -0.2);
      bigText(ctx, 'huh', a.x + 80, a.y + 70, 52, '#ffffff', 0.15);
    },
  },
  'r-maxwell': {
    // Black-and-white tuxedo cat lying in a loaf, spinning
    fur: '#1e1e24',
    darkFur: true,
    eyes: 'normal',
    iris: '#b8d84a',
    mouth: 'w',
    tuxedo: true,
    pose: 'loaf',
    s: 0.75,
    dx: 70,
    dy: -10,
    back: (ctx, a) => spinArcs(ctx, a.x + a.w / 2, a.y + a.h / 2 + 20, 190, 'rgba(255,255,255,0.7)'),
  },
  'r-smudge': {
    // White cat at the dinner table, disgusted at the salad
    fur: '#fbfbf8',
    eyes: 'squint',
    mouth: 'o',
    dy: -30,
    front: (ctx, a) => {
      const cx = a.x + a.w / 2;
      const y = a.y + a.h - 70;
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = INK;
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.ellipse(cx, y, 170, 42, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      const leaves = ['#5aa832', '#7cc444', '#3f8a24', '#93d65a'];
      for (let i = 0; i < 9; i++) {
        ctx.fillStyle = leaves[i % 4];
        ctx.beginPath();
        ctx.ellipse(cx - 110 + i * 27, y - 18 - (i % 3) * 8, 30, 18, (i - 4) * 0.25, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = '#e8402a';
      for (const dx of [-60, 15, 80]) {
        ctx.beginPath();
        ctx.arc(cx + dx, y - 30, 13, 0, Math.PI * 2);
        ctx.fill();
      }
    },
  },
  'r-keyboard': {
    fur: '#e8a050',
    stripes: '#b8692a',
    eyes: 'normal',
    iris: '#a8c050',
    mouth: 'w',
    dy: -45,
    back: (ctx, _a, head) => {
      ctx.fillStyle = '#3f74d8';
      ctx.strokeStyle = INK;
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.ellipse(head.x, head.y + 175, 120, 95, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    },
    front: (ctx, a) => {
      const y = a.y + a.h - 95;
      const x = a.x + 40;
      const w = a.w - 80;
      ctx.fillStyle = '#e9e4d8';
      ctx.strokeStyle = INK;
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.roundRect(x, y, w, 80, 10);
      ctx.fill();
      ctx.stroke();
      const keyW = w / 14;
      for (let i = 0; i < 14; i++) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(x + i * keyW + 2, y + 6, keyW - 4, 68);
        if (i % 7 !== 2 && i % 7 !== 6) {
          ctx.fillStyle = INK;
          ctx.fillRect(x + (i + 0.65) * keyW, y + 6, keyW * 0.7, 40);
        }
      }
      for (const side of [-1, 1]) {
        ctx.fillStyle = '#e8a050';
        ctx.beginPath();
        ctx.ellipse(a.x + a.w / 2 + side * 80, y + 12, 32, 22, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }
      motionLines(ctx, a.x + a.w / 2 - 80, y - 30, 3);
      motionLines(ctx, a.x + a.w / 2 + 80, y - 30, 3);
    },
  },
  'r-banana': {
    fur: '#f1ece4',
    eyes: 'teary',
    mouth: 'frown',
    noEars: true,
    under: (ctx) => {
      ctx.fillStyle = '#f7d64a';
      ctx.strokeStyle = INK;
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.ellipse(0, -8, 150, 140, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      for (const side of [-1, 1]) {
        ctx.beginPath();
        ctx.moveTo(side * 40, -120);
        ctx.quadraticCurveTo(side * 150, -200, side * 175, -100);
        ctx.quadraticCurveTo(side * 120, -130, side * 70, -95);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }
      ctx.fillStyle = '#6b4a22';
      ctx.fillRect(-12, -175, 24, 36);
      ctx.strokeRect(-12, -175, 24, 36);
    },
    cover: (ctx) => {
      ctx.fillStyle = '#f7d64a';
      ctx.fillRect(-200, -200, 400, 148);
      ctx.strokeStyle = INK;
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(-120, -52);
      ctx.quadraticCurveTo(0, -40, 120, -52);
      ctx.stroke();
    },
  },
  'r-vibing': {
    // White cat bobbing to the beat
    fur: '#f7f3ee',
    eyes: 'closed',
    mouth: 'smile',
    tilt: 0.3,
    s: 1.1,
    front: (ctx, a) => notes(ctx, a, ['♫', '♪', '♬']),
  },
  'n-polite': {
    // White cat with a grey cap patch, tight-lipped polite smile
    fur: '#fbfbf8',
    eyes: 'normal',
    iris: '#3a2a20',
    mouth: 'polite',
    s: 1.15,
    dy: 10,
    cover: (ctx) => {
      ctx.fillStyle = '#6a6a72';
      ctx.beginPath();
      ctx.ellipse(55, -75, 70, 40, -0.3, 0, Math.PI * 2);
      ctx.fill();
    },
  },
  'n-sad': {
    // Tortoiseshell cat with glossy eyes, head bowed
    fur: '#8a6a4a',
    stripes: '#4a3424',
    muzzle: '#c8a888',
    eyes: 'teary',
    iris: '#c8a040',
    mouth: 'frown',
    tilt: -0.12,
    s: 1.1,
    dy: 15,
    cover: (ctx) => {
      ctx.fillStyle = '#d88a3a';
      ctx.beginPath();
      ctx.ellipse(-70, 20, 40, 50, 0.3, 0, Math.PI * 2);
      ctx.fill();
    },
  },
  'n-scream': {
    // Silver tabby kitten clutching its face, screaming
    fur: '#c4c8cc',
    stripes: '#7a8086',
    eyes: 'squeeze',
    mouth: 'huge',
    s: 1.05,
    over: (ctx) => {
      ctx.fillStyle = '#c4c8cc';
      ctx.strokeStyle = INK;
      ctx.lineWidth = 5;
      for (const side of [-1, 1]) {
        ctx.beginPath();
        ctx.ellipse(side * 100, 20, 30, 42, side * -0.3, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }
    },
    front: (ctx, a) => {
      bigText(ctx, '啊', a.x + 60, a.y + 70, 56, '#ffffff', -0.2);
      bigText(ctx, '啊', a.x + a.w - 60, a.y + 90, 64, '#ffffff', 0.2);
    },
  },
  'n-shocked': {
    // Silver tabby with huge round eyes
    fur: '#b8b8b4',
    stripes: '#6e6e6a',
    muzzle: '#e8e8e4',
    eyes: 'wide',
    mouth: 'o',
    s: 1.12,
    front: (ctx, a) => {
      bigText(ctx, '！', a.x + a.w - 70, a.y + 80, 80, '#fff27a', 0.15);
      bigText(ctx, '！', a.x + 60, a.y + 90, 64, '#fff27a', -0.15);
    },
  },
  'n-zoning': {
    // Black cat staring into the middle distance
    fur: '#26232a',
    darkFur: true,
    eyes: 'half',
    iris: '#d8c040',
    mouth: 'flat',
    pose: 'sit',
    dy: -25,
    front: (ctx, a) => bigText(ctx, '…', a.x + a.w - 80, a.y + 70, 70, '#ffffff', 0),
  },
  'n-wajaja': {
    // White cat laughing its head off
    fur: '#fbfbf8',
    eyes: 'squeeze',
    mouth: 'huge',
    tilt: -0.15,
    s: 1.05,
    front: (ctx, a) => {
      bigText(ctx, 'WAJAJA', a.x + a.w / 2, a.y + a.h - 45, 48, '#ffe14a', -0.05);
      sparkle(ctx, a.x + 60, a.y + 70, 16);
    },
  },
  'n-chips': {
    // White cat clutching a blue bag of crisps
    fur: '#f4f2ee',
    eyes: 'normal',
    iris: '#9aa0a8',
    mouth: 'w',
    pose: 'sit',
    dy: -40,
    front: (ctx, a, head) => {
      const x = head.x;
      const y = head.y + 150;
      ctx.fillStyle = '#2a5ad8';
      ctx.strokeStyle = INK;
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(x - 60, y - 40);
      ctx.lineTo(x + 60, y - 40);
      ctx.lineTo(x + 70, y + 90);
      ctx.lineTo(x - 70, y + 90);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#e8402a';
      ctx.beginPath();
      ctx.ellipse(x, y + 20, 36, 22, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffe14a';
      ctx.font = '900 22px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('CHIPS', x, y + 28);
      ctx.fillStyle = '#f4f2ee';
      for (const side of [-1, 1]) {
        ctx.beginPath();
        ctx.ellipse(x + side * 62, y - 30, 26, 20, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }
      void a;
    },
  },
  'n-staring': {
    // Orange-and-white cat, face pressed close to the camera
    fur: '#f0a860',
    stripes: '#c87a3a',
    muzzle: '#fff6ec',
    eyes: 'normal',
    iris: '#c89a50',
    mouth: 'o',
    s: 1.35,
    dy: 30,
  },
};

// ---------------------------------------------------------------- the cat itself

function furFill(ctx: CanvasRenderingContext2D, spec: CatSpec): Paint {
  return spec.furPaint ? spec.furPaint(ctx) : spec.fur;
}

function drawBody(ctx: CanvasRenderingContext2D, head: Head, spec: CatSpec) {
  const s = head.s;
  ctx.save();
  ctx.translate(head.x, head.y);
  ctx.scale(s, s);
  ctx.fillStyle = furFill(ctx, spec);
  ctx.strokeStyle = INK;
  ctx.lineWidth = 6;
  const belly = spec.tuxedo ? '#ffffff' : spec.muzzle;

  if (spec.pose === 'loaf') {
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

function drawHead(ctx: CanvasRenderingContext2D, spec: CatSpec) {
  spec.under?.(ctx);
  ctx.strokeStyle = INK;
  ctx.lineWidth = 6;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';

  if (!spec.noEars) {
    for (const side of [-1, 1]) {
      ctx.fillStyle = spec.earColor ?? furFill(ctx, spec);
      ctx.beginPath();
      ctx.moveTo(side * -104, -30);
      ctx.lineTo(side * -84, -138);
      ctx.lineTo(side * -22, -82);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = spec.darkFur ? '#6a4a5a' : '#f4a8b8';
      ctx.beginPath();
      ctx.moveTo(side * -88, -50);
      ctx.lineTo(side * -76, -108);
      ctx.lineTo(side * -44, -80);
      ctx.closePath();
      ctx.fill();
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
  spec.over?.(ctx);
}

function drawEye(ctx: CanvasRenderingContext2D, x: number, y: number, side: number, spec: CatSpec) {
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
    case 'wide':
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(x, y, 28, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = INK;
      ctx.beginPath();
      ctx.arc(x, y, 8, 0, Math.PI * 2);
      ctx.fill();
      return;
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

function drawMouth(ctx: CanvasRenderingContext2D, mouth: Mouth, darkFur?: boolean) {
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

function bigText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, size: number, color: string, rot: number) {
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

function notes(ctx: CanvasRenderingContext2D, a: ArtArea, glyphs: string[]) {
  const spots = [
    [a.x + 60, a.y + 90, -0.2],
    [a.x + a.w - 60, a.y + 120, 0.2],
    [a.x + a.w - 90, a.y + a.h - 110, 0.1],
  ];
  glyphs.forEach((g, i) => bigText(ctx, g, spots[i][0], spots[i][1], 64, '#ffffff', spots[i][2]));
}

function motionLines(ctx: CanvasRenderingContext2D, x: number, y: number, n: number) {
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

function burstLines(ctx: CanvasRenderingContext2D, x: number, y: number, n: number, r0: number, r1: number, color: string) {
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

function spinArcs(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, color: string) {
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

function sparkle(ctx: CanvasRenderingContext2D, x: number, y: number, r: number) {
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

function star(ctx: CanvasRenderingContext2D, x: number, y: number, r: number) {
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const a = (i / 10) * Math.PI * 2 - Math.PI / 2;
    const rr = i % 2 === 0 ? r : r * 0.45;
    ctx.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr);
  }
  ctx.closePath();
  ctx.fill();
}
