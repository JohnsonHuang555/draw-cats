/**
 * Cartoon placeholder art for each meme cat, drawn with Canvas 2D.
 * A real image in src/assets/cards/<card-id>.(png|jpg|webp) replaces it (see textures.ts).
 */

export interface ArtArea {
  x: number;
  y: number;
  w: number;
  h: number;
}

type Eyes = 'normal' | 'grumpy' | 'teary' | 'wide' | 'happy' | 'dot' | 'squint' | 'closed';
type Mouth = 'w' | 'frown' | 'open' | 'o' | 'smile' | 'flat';
type Draw = (ctx: CanvasRenderingContext2D) => void;
type SceneDraw = (ctx: CanvasRenderingContext2D, a: ArtArea, head: { x: number; y: number; s: number }) => void;

interface CatSpec {
  fur: string;
  eyes: Eyes;
  mouth: Mouth;
  iris?: string;
  stripes?: string;
  tufts?: boolean;
  bigEars?: boolean;
  noEars?: boolean;
  spiky?: boolean;
  wrinkles?: boolean;
  blush?: boolean;
  tuxedo?: boolean;
  mask?: string;
  muzzle?: string;
  body?: boolean;
  tilt?: number;
  /** Head scale and offset from the art centre. */
  s?: number;
  dx?: number;
  dy?: number;
  /** Scene layers in art-area coordinates, behind and in front of the cat. */
  back?: SceneDraw;
  front?: SceneDraw;
  /** Extra layers in head-local coordinates. */
  under?: Draw;
  cover?: Draw;
}

const INK = '#241a2e';

const CATS: Record<string, CatSpec> = {
  'n-banana': {
    fur: '#f1ece4',
    eyes: 'teary',
    mouth: 'frown',
    noEars: true,
    under: (ctx) => {
      // Banana hood
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
  'n-crying': { fur: '#d9a066', stripes: '#a8693a', eyes: 'teary', mouth: 'frown', iris: '#6b4a2a' },
  'n-polite': {
    fur: '#f0b070',
    stripes: '#c47a3a',
    eyes: 'dot',
    mouth: 'flat',
    blush: true,
    body: true,
    tilt: 0.12,
    muzzle: '#fff4e6',
  },
  'n-huh': {
    fur: '#e2a25a',
    stripes: '#b3702e',
    eyes: 'wide',
    mouth: 'o',
    muzzle: '#fff4e6',
    tilt: -0.1,
    front: (ctx, a) => {
      bigText(ctx, '？', a.x + a.w - 80, a.y + 90, 90, '#ffffff', -0.2);
      bigText(ctx, '？', a.x + 70, a.y + 130, 60, '#ffffff', 0.2);
    },
  },
  'n-bingus': { fur: '#e9b6a6', eyes: 'normal', iris: '#9cc85a', mouth: 'w', bigEars: true, wrinkles: true },
  'n-chipi': {
    fur: '#f2f2f2',
    eyes: 'happy',
    mouth: 'smile',
    body: true,
    tilt: 0.15,
    front: (ctx, a) => notes(ctx, a, ['♪', '♫', '♪']),
  },
  'n-ceiling': {
    fur: '#f4f4f4',
    eyes: 'normal',
    iris: '#c8b850',
    mouth: 'w',
    dy: -40,
    back: (ctx, a, head) => {
      ctx.fillStyle = '#1a1210';
      ctx.beginPath();
      ctx.ellipse(head.x, a.y + 175, 150 * head.s, 26, 0, 0, Math.PI * 2);
      ctx.fill();
    },
    front: (ctx, a) => {
      ctx.fillStyle = '#e8dcc6';
      ctx.fillRect(a.x, a.y, a.w, 175);
      ctx.strokeStyle = 'rgba(80, 60, 40, 0.35)';
      ctx.lineWidth = 3;
      for (let x = a.x; x < a.x + a.w; x += 74) ctx.strokeRect(x, a.y - 4, 74, 179);
      ctx.strokeStyle = INK;
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(a.x, a.y + 175);
      ctx.lineTo(a.x + a.w, a.y + 175);
      ctx.stroke();
    },
  },
  'n-shocked': {
    fur: '#9c9ca4',
    stripes: '#6a6a72',
    eyes: 'wide',
    mouth: 'open',
    spiky: true,
    front: (ctx, a) => {
      bigText(ctx, '！', a.x + a.w - 70, a.y + 80, 80, '#fff27a', 0.15);
      bigText(ctx, '！', a.x + 60, a.y + 90, 64, '#fff27a', -0.15);
    },
  },
  'r-bongo': {
    fur: '#ffffff',
    eyes: 'dot',
    mouth: 'w',
    dy: -40,
    front: (ctx, a) => {
      const y = a.y + a.h - 110;
      for (const side of [-1, 1]) {
        const x = a.x + a.w / 2 + side * 85;
        ctx.fillStyle = '#a0522d';
        ctx.strokeStyle = INK;
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(x - 62, y);
        ctx.lineTo(x - 48, y + 100);
        ctx.lineTo(x + 48, y + 100);
        ctx.lineTo(x + 62, y);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#f2e1c0';
        ctx.beginPath();
        ctx.ellipse(x, y, 62, 18, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        // Paw slamming the drum
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.ellipse(x - side * 6, y - 22, 30, 20, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        motionLines(ctx, x - side * 6, y - 52, 3);
      }
    },
  },
  'r-pop': {
    fur: '#ece4da',
    eyes: 'normal',
    iris: '#7a9a50',
    mouth: 'open',
    muzzle: '#ffffff',
    back: (ctx, _a, head) => burstLines(ctx, head.x, head.y + 50, 12, 150, 200, 'rgba(255,255,255,0.5)'),
  },
  'r-vibing': {
    fur: '#f6f1e8',
    stripes: '#e0a050',
    eyes: 'closed',
    mouth: 'smile',
    tilt: 0.28,
    front: (ctx, a) => notes(ctx, a, ['♫', '♪', '♬']),
  },
  'r-longcat': {
    fur: '#ffffff',
    eyes: 'dot',
    mouth: 'w',
    s: 0.72,
    dy: -120,
    back: (ctx, a, head) => {
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = INK;
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.roundRect(head.x - 62, head.y + 20, 124, a.y + a.h - head.y + 40, 50);
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(head.x - 70, head.y + 120, 22, 30, 0.3, 0, Math.PI * 2);
      ctx.ellipse(head.x + 70, head.y + 120, 22, 30, -0.3, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    },
  },
  'r-maxwell': {
    fur: '#1e1e24',
    eyes: 'normal',
    iris: '#b8d84a',
    mouth: 'w',
    tuxedo: true,
    body: true,
    back: (ctx, _a, head) => spinArcs(ctx, head.x, head.y + 40, 175, 'rgba(255,255,255,0.7)'),
  },
  'r-happy': {
    fur: '#f2c48c',
    stripes: '#d08f48',
    eyes: 'happy',
    mouth: 'smile',
    body: true,
    dy: -20,
    front: (ctx, a, head) => {
      motionLines(ctx, head.x - 150, head.y + 170, 3);
      motionLines(ctx, head.x + 150, head.y + 170, 3);
      sparkle(ctx, a.x + 70, a.y + 80, 22);
      sparkle(ctx, a.x + a.w - 70, a.y + 110, 16);
    },
  },
  'sr-keyboard': {
    fur: '#e8a050',
    stripes: '#b8692a',
    eyes: 'normal',
    iris: '#a8c050',
    mouth: 'w',
    dy: -45,
    back: (ctx, _a, head) => {
      // Blue shirt
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
  'sr-smudge': {
    fur: '#fbfbf8',
    eyes: 'squint',
    mouth: 'frown',
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
  'sr-oiia': {
    fur: '#b8b4ac',
    stripes: '#7a766e',
    eyes: 'wide',
    mouth: 'o',
    muzzle: '#f4f0ea',
    back: (ctx, _a, head) => spinArcs(ctx, head.x, head.y, 170, 'rgba(255,255,255,0.8)'),
    front: (ctx, a) => bigText(ctx, 'OIIA', a.x + a.w / 2, a.y + 52, 56, '#ffffff', 0),
  },
  'sr-floppa': {
    fur: '#c99a63',
    eyes: 'normal',
    iris: '#c89a3a',
    mouth: 'flat',
    tufts: true,
    bigEars: true,
    muzzle: '#f4e6d2',
    body: true,
  },
  'ssr-nyan': {
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
      // Pop-Tart body
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
      for (let i = 0; i < 12; i++) {
        ctx.fillRect(bodyX + 30 + ((i * 53) % 130), top + 15 + ((i * 37) % 95), 9, 9);
      }
      // Legs and tail
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
  'ssr-grumpy': {
    fur: '#efe4d2',
    mask: '#8b6a4e',
    eyes: 'grumpy',
    iris: '#7cc6ee',
    mouth: 'frown',
    body: true,
    s: 1.08,
  },
};

export function drawCatArt(ctx: CanvasRenderingContext2D, cardId: string, a: ArtArea) {
  const spec = CATS[cardId];
  if (!spec) return;
  const s = spec.s ?? 1;
  const head = { x: a.x + a.w / 2 + (spec.dx ?? 0), y: a.y + a.h * 0.52 + (spec.dy ?? 0), s };

  ctx.save();
  spec.back?.(ctx, a, head);
  if (spec.body) drawBody(ctx, head, spec);
  ctx.translate(head.x, head.y);
  ctx.rotate(spec.tilt ?? 0);
  ctx.scale(s, s);
  drawHead(ctx, spec);
  ctx.restore();

  ctx.save();
  spec.front?.(ctx, a, head);
  ctx.restore();
}

function drawBody(ctx: CanvasRenderingContext2D, head: { x: number; y: number; s: number }, spec: CatSpec) {
  const s = head.s;
  ctx.fillStyle = spec.fur;
  ctx.strokeStyle = INK;
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.ellipse(head.x, head.y + 140 * s, 100 * s, 90 * s, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  if (spec.tuxedo || spec.muzzle) {
    ctx.fillStyle = spec.tuxedo ? '#ffffff' : spec.muzzle!;
    ctx.beginPath();
    ctx.ellipse(head.x, head.y + 150 * s, 50 * s, 65 * s, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = spec.tuxedo ? '#ffffff' : spec.fur;
  for (const side of [-1, 1]) {
    ctx.beginPath();
    ctx.ellipse(head.x + side * 38 * s, head.y + 215 * s, 28 * s, 20 * s, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }
}

function drawHead(ctx: CanvasRenderingContext2D, spec: CatSpec) {
  spec.under?.(ctx);
  ctx.strokeStyle = INK;
  ctx.lineWidth = 6;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';

  if (!spec.noEars) {
    const tip = spec.bigEars ? [-98, -168] : [-84, -138];
    for (const side of [-1, 1]) {
      ctx.fillStyle = spec.tufts ? '#4a3420' : spec.fur;
      ctx.beginPath();
      ctx.moveTo(side * -104, -30);
      ctx.lineTo(side * tip[0], tip[1]);
      ctx.lineTo(side * -22, -82);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = spec.tufts ? spec.fur : '#f4a8b8';
      ctx.beginPath();
      ctx.moveTo(side * -88, -50);
      ctx.lineTo(side * (tip[0] + 8), tip[1] + 30);
      ctx.lineTo(side * -44, -80);
      ctx.closePath();
      ctx.fill();
      if (spec.tufts) {
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(side * tip[0], tip[1]);
        ctx.lineTo(side * (tip[0] - 6), tip[1] - 34);
        ctx.moveTo(side * tip[0], tip[1]);
        ctx.lineTo(side * (tip[0] + 10), tip[1] - 30);
        ctx.stroke();
        ctx.lineWidth = 6;
      }
    }
  }

  // Head shape
  ctx.fillStyle = spec.fur;
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
  if (spec.wrinkles) {
    ctx.strokeStyle = 'rgba(120, 60, 50, 0.55)';
    ctx.lineWidth = 4;
    for (const y of [-70, -56, -42]) {
      ctx.beginPath();
      ctx.moveTo(-36, y);
      ctx.quadraticCurveTo(0, y - 10, 36, y);
      ctx.stroke();
    }
  }
  spec.cover?.(ctx);
  ctx.restore();

  ctx.strokeStyle = INK;
  ctx.lineWidth = 6;
  for (const side of [-1, 1]) drawEye(ctx, side * 42, -4, side, spec);

  // Nose
  ctx.fillStyle = '#f07890';
  ctx.beginPath();
  ctx.moveTo(-10, 20);
  ctx.lineTo(10, 20);
  ctx.lineTo(0, 31);
  ctx.closePath();
  ctx.fill();

  drawMouth(ctx, spec.mouth);

  // Whiskers
  ctx.strokeStyle = spec.fur === '#1e1e24' ? '#ffffff' : INK;
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
}

function drawEye(ctx: CanvasRenderingContext2D, x: number, y: number, side: number, spec: CatSpec) {
  ctx.strokeStyle = INK;
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
    case 'squint':
      ctx.beginPath();
      ctx.moveTo(x - 20, y + side * 0 - 4);
      ctx.quadraticCurveTo(x, y + 4, x + 20, y - 4);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x - 18 * side, y - 22);
      ctx.lineTo(x + 18 * side, y - 14);
      ctx.stroke();
      return;
    case 'dot':
      ctx.fillStyle = INK;
      ctx.beginPath();
      ctx.arc(x, y, 9, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(x - 3, y - 3, 3, 0, Math.PI * 2);
      ctx.fill();
      return;
    case 'wide':
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(x, y, 27, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = INK;
      ctx.beginPath();
      ctx.arc(x, y, 7, 0, Math.PI * 2);
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
  if (spec.iris) {
    ctx.fillStyle = spec.iris;
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

  if (spec.eyes === 'grumpy') {
    // Heavy lids slanting down toward the nose
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(x, y, rx + 1, ry + 1, 0, 0, Math.PI * 2);
    ctx.clip();
    ctx.fillStyle = spec.mask ?? spec.fur;
    ctx.beginPath();
    ctx.moveTo(x - 30, y - 30);
    ctx.lineTo(x + 30, y - 30);
    ctx.lineTo(x + 30, y + (side < 0 ? 4 : -8));
    ctx.lineTo(x - 30, y + (side < 0 ? -8 : 4));
    ctx.closePath();
    ctx.fill();
    ctx.restore();
    ctx.beginPath();
    ctx.moveTo(x - 24, y + (side < 0 ? -7 : 3));
    ctx.lineTo(x + 24, y + (side < 0 ? 3 : -7));
    ctx.stroke();
  }

  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  ctx.stroke();

  if (teary) {
    // Welling tears + a falling drop
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

function drawMouth(ctx: CanvasRenderingContext2D, mouth: Mouth) {
  ctx.strokeStyle = INK;
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
    case 'open':
      ctx.fillStyle = '#5a1424';
      ctx.beginPath();
      ctx.ellipse(0, 56, 26, 30, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#f07890';
      ctx.beginPath();
      ctx.ellipse(0, 72, 15, 10, 0, 0, Math.PI * 2);
      ctx.fill();
      return;
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
    [a.x + a.w - 90, a.y + a.h - 90, 0.1],
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
    ctx.beginPath();
    ctx.arc(x, y, r, start, start + 1.3);
    ctx.stroke();
    const end = start + 1.3;
    const ex = x + Math.cos(end) * r;
    const ey = y + Math.sin(end) * r;
    ctx.save();
    ctx.translate(ex, ey);
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
