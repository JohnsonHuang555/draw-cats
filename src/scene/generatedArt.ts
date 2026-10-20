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
    case 'plaid':
      skyGradient(ctx, hue, a, 40);
      for (const [width, alpha] of [
        [36, 0.16],
        [8, 0.22],
      ] as const) {
        ctx.fillStyle = `hsla(${(hue + 180) % 360}, 70%, 85%, ${alpha})`;
        for (let x = a.x + 30; x < a.x + a.w; x += 96) ctx.fillRect(x, a.y, width, a.h);
        for (let y = a.y + 30; y < a.y + a.h; y += 96) ctx.fillRect(a.x, y, a.w, width);
      }
      return;
    case 'sakura':
      sakura(ctx, a, rand);
      return;
    case 'neon':
      neon(ctx, hue, a);
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
  cream: { fur: '#f6e2c0', stripes: '#e2bc84', muzzle: '#fffaf0' },
  blue: { fur: '#7d8a9e', muzzle: '#d6dce6' },
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
  lava: {
    fur: '#2e1a1a',
    darkFur: true,
    furPaint: (ctx) => {
      const g = ctx.createLinearGradient(0, -120, 0, 200);
      g.addColorStop(0, '#3a1e1a');
      g.addColorStop(1, '#1a0e10');
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
  if (t.fur === 'lava') spec.cover = lavaCracks;
  spec.back = (ctx, _a, head) => {
    if (t.fur === 'ghost') glowBehind(ctx, head, 'rgba(190, 210, 255, 0.55)');
    if (t.fur === 'lava') glowBehind(ctx, head, 'rgba(255, 110, 40, 0.5)');
    drawBodyBack(ctx, t, head);
  };
  spec.over = (ctx) => {
    drawBodyAccessory(ctx, t);
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
    case 'straw':
      ctx.fillStyle = '#f2d488';
      ctx.beginPath();
      ctx.ellipse(0, -78, 158, 30, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(-82, -84);
      ctx.bezierCurveTo(-82, -170, 82, -170, 82, -84);
      ctx.quadraticCurveTo(0, -66, -82, -84);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#e04a4a';
      ctx.beginPath();
      ctx.moveTo(-82, -84);
      ctx.quadraticCurveTo(0, -66, 82, -84);
      ctx.lineTo(81, -104);
      ctx.quadraticCurveTo(0, -88, -81, -104);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      // Weave rings on the brim, in front of the crown
      ctx.strokeStyle = 'rgba(150, 100, 40, 0.5)';
      ctx.lineWidth = 3;
      for (const rx of [110, 134]) {
        ctx.beginPath();
        ctx.ellipse(0, -78, rx, rx * 0.19, 0, 0.05 * Math.PI, 0.95 * Math.PI);
        ctx.stroke();
      }
      return;
    case 'catears':
      ctx.lineWidth = 16;
      ctx.beginPath();
      ctx.ellipse(0, -12, 104, 84, 0, Math.PI * 1.08, Math.PI * 1.92);
      ctx.stroke();
      ctx.strokeStyle = '#ff7ab0';
      ctx.lineWidth = 8;
      ctx.stroke();
      ctx.strokeStyle = INK;
      ctx.lineWidth = 5;
      for (const side of [-1, 1]) {
        ctx.fillStyle = '#26232a';
        ctx.beginPath();
        ctx.moveTo(side * 12, -92);
        ctx.lineTo(side * 34, -168);
        ctx.lineTo(side * 64, -84);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#ff9ac4';
        ctx.beginPath();
        ctx.moveTo(side * 24, -98);
        ctx.lineTo(side * 35, -144);
        ctx.lineTo(side * 52, -94);
        ctx.closePath();
        ctx.fill();
      }
      return;
  }
}

/** Neckwear, drawn in head-local coordinates just under the chin. */
function drawBodyAccessory(ctx: CanvasRenderingContext2D, t: Traits) {
  ctx.strokeStyle = INK;
  ctx.lineWidth = 5;
  switch (t.body) {
    case 'scarf':
      ctx.fillStyle = '#e0444e';
      // Loose end hanging down the chest, then the wrap over it
      ctx.beginPath();
      ctx.moveTo(30, 100);
      ctx.lineTo(68, 104);
      ctx.lineTo(62, 184);
      ctx.lineTo(24, 178);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      for (const x of [30, 39, 48, 57]) {
        ctx.moveTo(x - 3, 180 + (x - 24) * 0.15);
        ctx.lineTo(x - 4, 194 + (x - 24) * 0.15);
      }
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(-84, 66);
      ctx.quadraticCurveTo(0, 114, 84, 66);
      ctx.lineTo(80, 100);
      ctx.quadraticCurveTo(0, 146, -80, 100);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(-82, 84);
      ctx.quadraticCurveTo(0, 130, 82, 84);
      ctx.moveTo(32, 128);
      ctx.lineTo(64, 132);
      ctx.moveTo(30, 152);
      ctx.lineTo(63, 156);
      ctx.stroke();
      return;
    case 'bowtie':
      ctx.fillStyle = '#3a6ae0';
      for (const side of [-1, 1]) {
        ctx.beginPath();
        ctx.moveTo(0, 104);
        ctx.lineTo(side * 46, 84);
        ctx.quadraticCurveTo(side * 54, 104, side * 46, 124);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }
      ctx.beginPath();
      ctx.roundRect(-11, 93, 22, 22, 6);
      ctx.fill();
      ctx.stroke();
      return;
    case 'bell':
      ctx.fillStyle = '#e0404a';
      ctx.beginPath();
      ctx.moveTo(-82, 74);
      ctx.quadraticCurveTo(0, 116, 82, 74);
      ctx.lineTo(80, 90);
      ctx.quadraticCurveTo(0, 132, -80, 90);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      bell(ctx, 0, 118);
      return;
    case 'cape':
      // The cape itself hangs behind the body (drawBodyBack); this is its cord and clasp
      ctx.strokeStyle = '#c8283a';
      ctx.lineWidth = 12;
      ctx.beginPath();
      ctx.moveTo(-74, 74);
      ctx.quadraticCurveTo(-36, 100, 0, 102);
      ctx.quadraticCurveTo(36, 100, 74, 74);
      ctx.stroke();
      ctx.strokeStyle = INK;
      ctx.lineWidth = 4;
      ctx.fillStyle = '#ffd24a';
      ctx.beginPath();
      ctx.arc(0, 104, 14, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      return;
  }
}

function bell(ctx: CanvasRenderingContext2D, x: number, y: number) {
  const g = ctx.createRadialGradient(x - 6, y - 6, 2, x, y, 18);
  g.addColorStop(0, '#fff3b0');
  g.addColorStop(1, '#e0a420');
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(x, y, 17, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x - 15, y);
  ctx.lineTo(x + 15, y);
  ctx.moveTo(x, y + 3);
  ctx.lineTo(x, y + 15);
  ctx.stroke();
  ctx.fillStyle = INK;
  ctx.beginPath();
  ctx.arc(x, y + 6, 4, 0, Math.PI * 2);
  ctx.fill();
}

/** Body accessories that hang behind the cat: a cape or a pair of wings. */
function drawBodyBack(ctx: CanvasRenderingContext2D, t: Traits, head: Head) {
  if (t.body !== 'cape' && t.body !== 'wings') return;
  ctx.save();
  ctx.translate(head.x, head.y);
  ctx.scale(head.s, head.s);
  ctx.strokeStyle = INK;
  ctx.lineWidth = 6;
  ctx.lineJoin = 'round';
  if (t.body === 'cape') {
    ctx.fillStyle = '#c8283a';
    ctx.beginPath();
    ctx.moveTo(-70, 70);
    ctx.quadraticCurveTo(-150, 140, -176, 236);
    for (let i = 0; i < 4; i++) {
      const x0 = -176 + i * 88;
      ctx.quadraticCurveTo(x0 + 44, 216, x0 + 88, 236);
    }
    ctx.quadraticCurveTo(150, 140, 70, 70);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.lineWidth = 5;
    ctx.beginPath();
    for (const x of [-120, 120]) {
      ctx.moveTo(x * 0.55, 110);
      ctx.quadraticCurveTo(x * 0.9, 170, x, 222);
    }
    ctx.stroke();
  } else {
    for (const side of [-1, 1]) {
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = INK;
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(side * 60, 118);
      ctx.bezierCurveTo(side * 120, 20, side * 200, -30, side * 228, -10);
      // Three feather tips back along the bottom edge
      ctx.quadraticCurveTo(side * 226, 50, side * 190, 70);
      ctx.quadraticCurveTo(side * 196, 110, side * 150, 120);
      ctx.quadraticCurveTo(side * 146, 160, side * 100, 158);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.strokeStyle = 'rgba(120, 140, 200, 0.45)';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(side * 98, 112);
      ctx.quadraticCurveTo(side * 150, 60, side * 196, 30);
      ctx.moveTo(side * 100, 140);
      ctx.quadraticCurveTo(side * 140, 100, side * 160, 96);
      ctx.stroke();
    }
  }
  ctx.restore();
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
    case 'donut': {
      const x = head.x;
      const y = pawY - 14;
      const ring = new Path2D();
      ring.arc(x, y, 44, 0, Math.PI * 2);
      ring.arc(x, y, 14, 0, Math.PI * 2, true);
      ctx.fillStyle = '#e0a868';
      ctx.fill(ring);
      ctx.stroke(ring);
      ctx.save();
      ctx.clip(ring);
      ctx.fillStyle = '#ff8ab8';
      ctx.beginPath();
      for (let i = 0; i <= 24; i++) {
        const ang = (i / 24) * Math.PI * 2;
        const r = 36 + (i % 2 ? 4 : 0);
        ctx.lineTo(x + Math.cos(ang) * r, y + Math.sin(ang) * r - 3);
      }
      ctx.fill();
      const rand = seededRandom('sprinkles');
      for (let i = 0; i < 14; i++) {
        const ang = rand() * Math.PI * 2;
        const r = 20 + rand() * 14;
        ctx.save();
        ctx.translate(x + Math.cos(ang) * r, y + Math.sin(ang) * r - 3);
        ctx.rotate(rand() * Math.PI);
        ctx.fillStyle = ['#ffffff', '#ffe14a', '#5ac8f0', '#7be08a'][i % 4];
        ctx.fillRect(-5, -1.5, 10, 3);
        ctx.restore();
      }
      ctx.restore();
      ctx.beginPath();
      ctx.arc(x, y, 14, 0, Math.PI * 2);
      ctx.stroke();
      return;
    }
    case 'wand':
      ctx.save();
      // Leans outward so the star stays clear of the face
      ctx.translate(head.x + 96 * s, pawY - 10);
      ctx.rotate(0.3);
      ctx.fillStyle = '#3a2a4a';
      ctx.beginPath();
      ctx.roundRect(-6, -150, 12, 170, 6);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(-5, -147, 10, 20);
      // Glow from layered discs rather than shadowBlur, which some GPUs render wrongly
      for (const [r, c] of [
        [46, 'rgba(255, 230, 120, 0.18)'],
        [32, 'rgba(255, 230, 120, 0.3)'],
      ] as const) {
        ctx.fillStyle = c;
        ctx.beginPath();
        ctx.arc(0, -172, r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = '#ffe14a';
      star(ctx, 0, -172, 26);
      ctx.fillStyle = '#ffffff';
      star(ctx, -38, -206, 7);
      star(ctx, 34, -214, 5);
      star(ctx, 40, -150, 6);
      ctx.restore();
      return;
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

/** Glowing cracks across a lava cat's head (head-local, clipped to the head). */
const lavaCracks: Draw = (ctx) => {
  const cracks = [
    [[-96, -30], [-60, -10], [-70, 30], [-40, 60]],
    [[80, -60], [50, -34], [70, 0], [96, 20]],
    [[-20, -90], [-6, -60], [-30, -50]],
    [[30, 50], [52, 70], [40, 92]],
  ];
  ctx.save();
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  // Glow from layered strokes rather than shadowBlur, which some GPUs render wrongly
  for (const [width, color] of [
    [14, 'rgba(255, 90, 20, 0.35)'],
    [6, '#ff8a2a'],
    [2.5, '#ffe68a'],
  ] as const) {
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.beginPath();
    for (const crack of cracks) {
      ctx.moveTo(crack[0][0], crack[0][1]);
      for (const [x, y] of crack.slice(1)) ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
  ctx.restore();
};

/** Pink sky, a blossoming branch across the top corner and falling petals. */
function sakura(ctx: CanvasRenderingContext2D, a: ArtArea, rand: () => number) {
  const g = ctx.createLinearGradient(0, a.y, 0, a.y + a.h);
  g.addColorStop(0, '#ffd0e2');
  g.addColorStop(1, '#ffeef4');
  ctx.fillStyle = g;
  ctx.fillRect(a.x, a.y, a.w, a.h);
  ctx.strokeStyle = '#6a4434';
  ctx.lineCap = 'round';
  ctx.lineWidth = 12;
  ctx.beginPath();
  ctx.moveTo(a.x - 10, a.y + 70);
  ctx.quadraticCurveTo(a.x + 120, a.y + 40, a.x + 190, a.y - 10);
  ctx.moveTo(a.x + 80, a.y + 52);
  ctx.lineTo(a.x + 120, a.y + 96);
  ctx.stroke();
  for (const [x, y, r] of [
    [40, 58, 18],
    [110, 34, 20],
    [168, 8, 16],
    [122, 100, 17],
  ]) {
    flower(ctx, a.x + x, a.y + y, r);
  }
  ctx.fillStyle = 'rgba(255, 140, 180, 0.7)';
  for (let i = 0; i < 26; i++) {
    const r = 5 + rand() * 4;
    ctx.beginPath();
    ctx.ellipse(a.x + rand() * a.w, a.y + 60 + rand() * (a.h - 60), r, r * 0.6, rand() * Math.PI, 0, Math.PI * 2);
    ctx.fill();
  }
}

function flower(ctx: CanvasRenderingContext2D, x: number, y: number, r: number) {
  ctx.fillStyle = '#ff9cc0';
  for (let i = 0; i < 5; i++) {
    const ang = (i / 5) * Math.PI * 2 - Math.PI / 2;
    ctx.beginPath();
    ctx.ellipse(x + Math.cos(ang) * r * 0.55, y + Math.sin(ang) * r * 0.55, r * 0.5, r * 0.38, ang, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = '#ffe14a';
  ctx.beginPath();
  ctx.arc(x, y, r * 0.2, 0, Math.PI * 2);
  ctx.fill();
}

/** Synthwave: dark sky, a striped sun on the horizon and a glowing grid floor. */
function neon(ctx: CanvasRenderingContext2D, hue: number, a: ArtArea) {
  const g = ctx.createLinearGradient(0, a.y, 0, a.y + a.h);
  g.addColorStop(0, '#0a0620');
  g.addColorStop(0.6, '#2a0a4a');
  g.addColorStop(1, '#0a0620');
  ctx.fillStyle = g;
  ctx.fillRect(a.x, a.y, a.w, a.h);
  const cx = a.x + a.w / 2;
  const horizon = a.y + a.h * 0.62;
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, horizon, 130, Math.PI, 0);
  ctx.clip();
  const sun = ctx.createLinearGradient(0, horizon - 130, 0, horizon);
  sun.addColorStop(0, '#ffe66a');
  sun.addColorStop(1, '#ff3a9a');
  ctx.fillStyle = sun;
  ctx.fillRect(cx - 130, horizon - 130, 260, 130);
  ctx.fillStyle = '#2a0a4a';
  for (let i = 0; i < 5; i++) ctx.fillRect(cx - 130, horizon - 50 + i * 10, 260, 2 + i);
  ctx.restore();
  ctx.save();
  ctx.beginPath();
  ctx.rect(a.x, horizon, a.w, a.h);
  ctx.clip();
  ctx.strokeStyle = `hsl(${(hue % 60) + 170}, 100%, 60%)`;
  // Glow from layered strokes rather than shadowBlur
  for (const [width, alpha] of [
    [8, 0.2],
    [3, 0.9],
  ] as const) {
    ctx.globalAlpha = alpha;
    ctx.lineWidth = width;
    ctx.beginPath();
    for (let i = -8; i <= 8; i++) {
      ctx.moveTo(cx + i * 20, horizon);
      ctx.lineTo(cx + i * 110, a.y + a.h);
    }
    for (let k = 1; k <= 6; k++) {
      const y = horizon + (a.y + a.h - horizon) * Math.pow(k / 6, 1.8);
      ctx.moveTo(a.x, y);
      ctx.lineTo(a.x + a.w, y);
    }
    ctx.stroke();
  }
  ctx.restore();
}

