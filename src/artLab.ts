/** Dev page (art-lab.html): every chosen Card drawn in the classic and inked art styles, side by side. */
import { MEME_CATS, type Card } from './domain/cards';
import { generateCat } from './domain/generated';
import { setArtStyle, type ArtStyle } from './scene/catKit';
import { paintCardFront } from './scene/textures';

const TEMPLATES = ['ssr-grumpy', 'ssr-floppa', 'r-maxwell', 'sr-pop', 'r-huh'];

const params = new URLSearchParams(location.search);
const ids = params.get('ids')?.split(',') ?? TEMPLATES;
const memes = params.has('all') ? MEME_CATS : MEME_CATS.filter((c) => ids.includes(c.id));
const numbers = (params.get('n') ?? '42,777,2024').split(',').map(Number).filter((n) => n >= 1 && n <= 9999);
const cards: Card[] = [...memes, ...numbers.map(generateCat)];

const motions: ((time: number) => void)[] = [];
const rows = document.getElementById('rows')!;
for (const card of cards) {
  const row = document.createElement('div');
  row.className = 'row';
  for (const style of ['classic', 'inked'] as ArtStyle[]) {
    setArtStyle(style);
    const fig = document.createElement('figure');
    const caption = document.createElement('figcaption');
    caption.textContent = `${card.name} · ${style}`;
    const moving: ((time: number) => void)[] = [];
    fig.append(caption, paintCardFront(card, undefined, (paintArt) => moving.push(paintArt)));
    // Each style keeps its own repaint; the style is switched back in on every frame
    for (const paintArt of moving) {
      motions.push((time) => {
        setArtStyle(style);
        paintArt(time);
      });
    }
    row.append(fig);
  }
  rows.append(row);
}
setArtStyle('classic');

const play = (ms: number) => {
  for (const motion of motions) motion(ms / 1000);
  setArtStyle('classic');
  requestAnimationFrame(play);
};
// ?t=1.5 freezes moving art at that moment instead of playing it
const frozen = params.get('t');
if (frozen !== null) {
  for (const motion of motions) motion(Number(frozen));
  setArtStyle('classic');
} else if (motions.length) {
  requestAnimationFrame(play);
}
