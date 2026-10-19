/** Art for Generated Cats, assembled from their Traits. */
import type { GeneratedCat } from '../domain/cards';
import type { Traits } from '../domain/traits';
import {
  INK,
  orbs,
  seededRandom,
  skyGradient,
  star,
  sunburst,
  type ArtArea,
  type CatSpec,
  type Draw,
  type Eyes,
  type Head,
  type Mouth,
} from './catKit';

export function drawTraitBackground(ctx: CanvasRenderingContext2D, cat: GeneratedCat, a: ArtArea) {
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

export function specFromTraits(cat: GeneratedCat): CatSpec {
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

