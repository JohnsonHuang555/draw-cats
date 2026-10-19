import { CanvasTexture, SRGBColorSpace, type Texture } from 'three';
import type { Card } from '../domain/cards';
import type { Rarity } from '../domain/rarity';
import { drawCatArt } from './catArt';

const FONT = '"Noto Sans TC", "Microsoft JhengHei", "PingFang TC", sans-serif';
export const CARD_TEX_W = 512;
export const CARD_TEX_H = 716;

function makeCanvas(w: number, h: number): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  return [canvas, canvas.getContext('2d')!];
}

function toTexture(canvas: HTMLCanvasElement, srgb = true): Texture {
  const tex = new CanvasTexture(canvas);
  if (srgb) tex.colorSpace = SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
}

/** Seeded pseudo-random so a Card's placeholder art is stable. */
function seededRandom(seed: string) {
  let h = 2166136261;
  for (const ch of seed) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
  return () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
}

const FRAME: Record<Rarity, [string, string, string]> = {
  N: ['#8a929e', '#c9d0da', '#5d6470'],
  R: ['#1d5fb8', '#7cc4ff', '#123a73'],
  SR: ['#6a24b8', '#e0a8ff', '#3c1270'],
  SSR: ['#b8860b', '#fff1a8', '#7a5200'],
};

const STARS: Record<Rarity, number> = { N: 1, R: 2, SR: 3, SSR: 4 };

const frontCache = new Map<string, Texture>();

export function cardFrontTexture(card: Card): Texture {
  const cached = frontCache.get(card.id);
  if (cached) return cached;

  const W = CARD_TEX_W;
  const H = CARD_TEX_H;
  const [canvas, ctx] = makeCanvas(W, H);
  const rand = seededRandom(card.id);
  const [frameA, frameB, frameC] = FRAME[card.rarity];

  // Frame
  roundRect(ctx, 0, 0, W, H, 34);
  const frameGrad = ctx.createLinearGradient(0, 0, W, H);
  frameGrad.addColorStop(0, frameB);
  frameGrad.addColorStop(0.35, frameA);
  frameGrad.addColorStop(0.65, frameB);
  frameGrad.addColorStop(1, frameC);
  ctx.fillStyle = frameGrad;
  ctx.fill();

  // Inner panel
  roundRect(ctx, 18, 18, W - 36, H - 36, 22);
  ctx.fillStyle = '#100c1c';
  ctx.fill();

  // Art area
  const artX = 34;
  const artY = 84;
  const artW = W - 68;
  const artH = 430;
  ctx.save();
  roundRect(ctx, artX, artY, artW, artH, 14);
  ctx.clip();
  const sky = ctx.createLinearGradient(0, artY, 0, artY + artH);
  sky.addColorStop(0, `hsl(${card.hue}, 65%, 22%)`);
  sky.addColorStop(1, `hsl(${(card.hue + 40) % 360}, 75%, 48%)`);
  ctx.fillStyle = sky;
  ctx.fillRect(artX, artY, artW, artH);

  // Sunburst behind the glyph
  const cx = W / 2;
  const cy = artY + artH * 0.48;
  ctx.globalAlpha = 0.18;
  ctx.fillStyle = `hsl(${(card.hue + 20) % 360}, 90%, 80%)`;
  const rays = 14 + Math.floor(rand() * 10);
  for (let i = 0; i < rays; i++) {
    const a = (i / rays) * Math.PI * 2 + rand() * 0.1;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, 420, a, a + Math.PI / rays / 1.6);
    ctx.closePath();
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  // Floating orbs
  for (let i = 0; i < 26; i++) {
    const r = 3 + rand() * 18;
    ctx.globalAlpha = 0.15 + rand() * 0.35;
    ctx.fillStyle = `hsl(${(card.hue + rand() * 80) % 360}, 90%, 75%)`;
    ctx.beginPath();
    ctx.arc(artX + rand() * artW, artY + rand() * artH, r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  // Soft halo behind the cat
  const halo = ctx.createRadialGradient(cx, cy, 10, cx, cy, 220);
  halo.addColorStop(0, 'rgba(255,255,255,0.35)');
  halo.addColorStop(0.5, `hsla(${card.hue}, 100%, 75%, 0.15)`);
  halo.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = halo;
  ctx.fillRect(artX, artY, artW, artH);
  const area = { x: artX, y: artY, w: artW, h: artH };
  drawCatArt(ctx, card.id, area);
  ctx.restore();

  const strokeArtBorder = () => {
    ctx.strokeStyle = frameB;
    ctx.lineWidth = 4;
    roundRect(ctx, artX, artY, artW, artH, 14);
    ctx.stroke();
  };
  strokeArtBorder();

  // Header: rarity badge + stars
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.font = `900 40px ${FONT}`;
  const badgeGrad = ctx.createLinearGradient(0, 30, 0, 74);
  badgeGrad.addColorStop(0, '#ffffff');
  badgeGrad.addColorStop(1, frameB);
  ctx.fillStyle = badgeGrad;
  ctx.fillText(card.rarity, 40, 52);
  ctx.textAlign = 'right';
  ctx.font = `34px ${FONT}`;
  ctx.fillStyle = frameB;
  ctx.fillText('★'.repeat(STARS[card.rarity]), W - 40, 52);

  // Name banner
  ctx.textAlign = 'center';
  ctx.fillStyle = '#ffffff';
  ctx.font = `700 52px ${FONT}`;
  ctx.fillText(card.name, W / 2, 576);
  ctx.fillStyle = 'rgba(255,255,255,0.65)';
  ctx.font = `28px ${FONT}`;
  ctx.fillText(card.title, W / 2, 632);
  ctx.strokeStyle = frameB;
  ctx.globalAlpha = 0.5;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(110, 605);
  ctx.lineTo(W - 110, 605);
  ctx.stroke();
  ctx.globalAlpha = 1;

  const tex = toTexture(canvas);
  frontCache.set(card.id, tex);

  // A real image dropped into src/assets/cards/ replaces the cartoon once it loads.
  const customUrl = CUSTOM_ART.get(card.id);
  if (customUrl) {
    const img = new Image();
    img.onload = () => {
      ctx.save();
      roundRect(ctx, area.x, area.y, area.w, area.h, 14);
      ctx.clip();
      const scale = Math.max(area.w / img.width, area.h / img.height);
      const w = img.width * scale;
      const h = img.height * scale;
      ctx.drawImage(img, area.x + (area.w - w) / 2, area.y + (area.h - h) / 2, w, h);
      ctx.restore();
      strokeArtBorder();
      tex.needsUpdate = true;
    };
    img.src = customUrl;
  }
  return tex;
}

/** Card id → URL of a custom image in src/assets/cards/, resolved at build time. */
const CUSTOM_ART = new Map(
  Object.entries(
    import.meta.glob('../assets/cards/*.{png,jpg,jpeg,webp,gif}', {
      eager: true,
      query: '?url',
      import: 'default',
    }) as Record<string, string>,
  ).map(([path, url]) => [path.split('/').pop()!.replace(/\.\w+$/, ''), url]),
);

let backTex: Texture | undefined;

export function cardBackTexture(): Texture {
  if (backTex) return backTex;
  const W = CARD_TEX_W;
  const H = CARD_TEX_H;
  const [canvas, ctx] = makeCanvas(W, H);
  roundRect(ctx, 0, 0, W, H, 34);
  const g = ctx.createLinearGradient(0, 0, W, H);
  g.addColorStop(0, '#1b1440');
  g.addColorStop(1, '#0a0820');
  ctx.fillStyle = g;
  ctx.fill();

  ctx.strokeStyle = '#d9b25f';
  ctx.lineWidth = 6;
  roundRect(ctx, 22, 22, W - 44, H - 44, 22);
  ctx.stroke();
  ctx.lineWidth = 2;
  roundRect(ctx, 36, 36, W - 72, H - 72, 16);
  ctx.stroke();

  // Lattice
  ctx.globalAlpha = 0.18;
  ctx.lineWidth = 1.5;
  for (let i = -H; i < W + H; i += 36) {
    ctx.beginPath();
    ctx.moveTo(i, 40);
    ctx.lineTo(i + H, H - 40);
    ctx.moveTo(i + H, 40);
    ctx.lineTo(i, H - 40);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;

  // Emblem
  const cx = W / 2;
  const cy = H / 2;
  const halo = ctx.createRadialGradient(cx, cy, 0, cx, cy, 170);
  halo.addColorStop(0, 'rgba(255, 214, 120, 0.55)');
  halo.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = halo;
  ctx.fillRect(0, 0, W, H);
  ctx.beginPath();
  ctx.arc(cx, cy, 110, 0, Math.PI * 2);
  ctx.strokeStyle = '#f3d283';
  ctx.lineWidth = 4;
  ctx.stroke();
  ctx.fillStyle = '#f3d283';
  drawPaw(ctx, cx, cy + 8, 1.15);

  backTex = toTexture(canvas);
  return backTex;
}

/** Cat paw print, filled with the current fillStyle. ~140px tall at scale 1. */
function drawPaw(ctx: CanvasRenderingContext2D, cx: number, cy: number, s: number) {
  ctx.beginPath();
  ctx.ellipse(cx, cy + 22 * s, 42 * s, 36 * s, 0, 0, Math.PI * 2);
  ctx.fill();
  for (const [dx, dy, r] of [
    [-50, -22, 17],
    [-19, -50, 18],
    [19, -50, 18],
    [50, -22, 17],
  ]) {
    ctx.beginPath();
    ctx.ellipse(cx + dx * s, cy + dy * s, r * s, r * 1.2 * s, dx * 0.006, 0, Math.PI * 2);
    ctx.fill();
  }
}

/** Cat head silhouette with ears, filled with the current fillStyle. */
function catHeadPath(ctx: CanvasRenderingContext2D, cx: number, cy: number, s: number) {
  ctx.beginPath();
  ctx.moveTo(cx - 108 * s, cy - 10 * s);
  ctx.lineTo(cx - 95 * s, cy - 125 * s);
  ctx.lineTo(cx - 40 * s, cy - 78 * s);
  ctx.quadraticCurveTo(cx, cy - 90 * s, cx + 40 * s, cy - 78 * s);
  ctx.lineTo(cx + 95 * s, cy - 125 * s);
  ctx.lineTo(cx + 108 * s, cy - 10 * s);
  ctx.bezierCurveTo(cx + 120 * s, cy + 90 * s, cx - 120 * s, cy + 90 * s, cx - 108 * s, cy - 10 * s);
  ctx.closePath();
}

export const PACK_TEX_W = 512;
export const PACK_TEX_H = 768;
/** Fraction of the Pack (from the top) that tears off. */
export const PACK_TEAR_LINE = 0.16;

let packTex: Texture | undefined;

export function packTexture(): Texture {
  if (packTex) return packTex;
  const W = PACK_TEX_W;
  const H = PACK_TEX_H;
  const [canvas, ctx] = makeCanvas(W, H);

  // Crimped silhouette
  const crimp = 18;
  ctx.beginPath();
  ctx.moveTo(0, crimp);
  for (let x = 0; x <= W; x += 16) ctx.lineTo(x, (x / 16) % 2 === 0 ? crimp : 0);
  ctx.lineTo(W, H - crimp);
  for (let x = W; x >= 0; x -= 16) ctx.lineTo(x, (x / 16) % 2 === 0 ? H - crimp : H);
  ctx.closePath();
  ctx.save();
  ctx.clip();

  const g = ctx.createLinearGradient(0, 0, W, H);
  g.addColorStop(0, '#2a1d6b');
  g.addColorStop(0.45, '#120c33');
  g.addColorStop(0.55, '#3a2a8a');
  g.addColorStop(1, '#0b0820');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);

  // Metallic sheen stripes
  ctx.globalAlpha = 0.12;
  for (let i = -H; i < W; i += 28) {
    ctx.fillStyle = i % 56 === 0 ? '#ffffff' : '#9a8cff';
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i + 10, 0);
    ctx.lineTo(i + 10 + H * 0.5, H);
    ctx.lineTo(i + H * 0.5, H);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  // Starfield
  const rand = seededRandom('pack');
  for (let i = 0; i < 90; i++) {
    ctx.globalAlpha = 0.3 + rand() * 0.7;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(rand() * W, rand() * H, rand() * 2.2, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  // Tear line perforation
  const tearY = H * PACK_TEAR_LINE;
  ctx.setLineDash([10, 8]);
  ctx.strokeStyle = 'rgba(255, 230, 170, 0.55)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(10, tearY);
  ctx.lineTo(W - 10, tearY);
  ctx.stroke();
  ctx.setLineDash([]);

  // Emblem + title
  const cx = W / 2;
  const cy = H * 0.5;
  const halo = ctx.createRadialGradient(cx, cy, 0, cx, cy, 200);
  halo.addColorStop(0, 'rgba(255, 220, 140, 0.5)');
  halo.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = halo;
  ctx.fillRect(0, 0, W, H);
  // Scattered paw prints
  ctx.fillStyle = 'rgba(255, 243, 196, 0.12)';
  for (const [px, py, ps, rot] of [
    [90, 210, 0.45, -0.4],
    [420, 260, 0.38, 0.3],
    [70, 520, 0.4, 0.5],
    [440, 640, 0.45, -0.3],
    [130, 700, 0.3, 0.2],
  ]) {
    ctx.save();
    ctx.translate(px, py);
    ctx.rotate(rot);
    drawPaw(ctx, 0, 0, ps);
    ctx.restore();
  }

  // Cat head emblem
  catHeadPath(ctx, cx, cy, 1.15);
  const headGrad = ctx.createLinearGradient(cx - 120, cy - 140, cx + 120, cy + 100);
  headGrad.addColorStop(0, '#fff3c4');
  headGrad.addColorStop(0.5, '#e0a93a');
  headGrad.addColorStop(1, '#fff3c4');
  ctx.fillStyle = headGrad;
  ctx.fill();
  ctx.fillStyle = '#1a1240';
  for (const side of [-1, 1]) {
    ctx.beginPath();
    ctx.ellipse(cx + side * 42, cy - 8, 13, 20, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.beginPath();
  ctx.moveTo(cx - 10, cy + 22);
  ctx.lineTo(cx + 10, cy + 22);
  ctx.lineTo(cx, cy + 33);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#1a1240';
  ctx.lineWidth = 5;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.arc(cx - 10, cy + 36, 10, 0, Math.PI);
  ctx.moveTo(cx + 20, cy + 36);
  ctx.arc(cx + 10, cy + 36, 10, 0, Math.PI);
  ctx.stroke();

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#fff3c4';
  ctx.font = `900 64px ${FONT}`;
  ctx.shadowColor = '#e0a93a';
  ctx.shadowBlur = 24;
  ctx.fillText('喵喵卡包', cx, H * 0.76);
  ctx.shadowBlur = 0;
  ctx.font = `600 22px ${FONT}`;
  ctx.fillStyle = 'rgba(255,243,196,0.7)';
  ctx.fillText('MEME  CAT  BOOSTER', cx, H * 0.83);
  ctx.restore();

  packTex = toTexture(canvas);
  return packTex;
}

let glowTex: Texture | undefined;

/** Soft white radial gradient, tinted by the material colour. */
export function glowTexture(): Texture {
  if (glowTex) return glowTex;
  const [canvas, ctx] = makeCanvas(256, 256);
  const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(0.25, 'rgba(255,255,255,0.45)');
  g.addColorStop(0.6, 'rgba(255,255,255,0.1)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 256, 256);
  glowTex = toTexture(canvas, false);
  return glowTex;
}

let beamTex: Texture | undefined;

/** Vertical light beam: bright at the bottom and centre, fading up and to the sides. */
export function beamTexture(): Texture {
  if (beamTex) return beamTex;
  const [canvas, ctx] = makeCanvas(128, 512);
  const img = ctx.createImageData(128, 512);
  for (let y = 0; y < 512; y++) {
    const v = Math.pow(y / 511, 1.6);
    for (let x = 0; x < 128; x++) {
      const u = Math.abs(x / 127 - 0.5) * 2;
      const a = v * Math.pow(1 - u, 2.2);
      const i = (y * 128 + x) * 4;
      img.data[i] = img.data[i + 1] = img.data[i + 2] = 255;
      img.data[i + 3] = Math.round(a * 255);
    }
  }
  ctx.putImageData(img, 0, 0);
  beamTex = toTexture(canvas, false);
  return beamTex;
}
