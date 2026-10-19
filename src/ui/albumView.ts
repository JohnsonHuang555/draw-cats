import type { AlbumSlot } from '../domain/album';
import type { Card } from '../domain/cards';
import { COLLECTION_SIZE } from '../domain/generated';
import { RARITIES, type Rarity } from '../domain/rarity';
import { paintCardFront } from '../scene/textures';

type Tab = 'meme' | 'generated';

const THUMB_W = 192;
const THUMB_H = 268;

/**
 * The Album screen: Meme Cats (all slots, unowned as silhouettes) and owned Generated Cats,
 * with lazily drawn 2D thumbnails. Tapping an owned card asks for the 3D inspect view.
 */
export class AlbumView {
  readonly el = document.createElement('section');
  onClose?: () => void;
  onCard?: (card: Card) => void;

  private tab: Tab = 'meme';
  private filter: Rarity | 'all' = 'all';
  private memes: AlbumSlot[] = [];
  private generated: AlbumSlot[] = [];
  private grid: HTMLElement;
  private observer: IntersectionObserver;

  constructor() {
    this.el.className = 'album';
    this.el.innerHTML = `
      <header class="album-head">
        <button class="icon-btn album-close" aria-label="關閉卡冊">✕</button>
        <h2>卡冊</h2>
        <span class="album-preview-tag">開發者預覽</span>
      </header>
      <nav class="album-tabs">
        <button data-tab="meme">迷因貓 <span></span></button>
        <button data-tab="generated">編號貓 <span></span></button>
      </nav>
      <div class="album-filters">
        ${['all', ...[...RARITIES].reverse()]
          .map((r) => `<button data-filter="${r}">${r === 'all' ? '全部' : r}</button>`)
          .join('')}
      </div>
      <div class="album-grid"></div>
    `;
    this.grid = this.el.querySelector('.album-grid')!;
    this.el.querySelector('.album-close')!.addEventListener('click', () => this.onClose?.());
    this.el.querySelectorAll<HTMLButtonElement>('[data-tab]').forEach((b) =>
      b.addEventListener('click', () => {
        this.tab = b.dataset.tab as Tab;
        this.render();
      }),
    );
    this.el.querySelectorAll<HTMLButtonElement>('[data-filter]').forEach((b) =>
      b.addEventListener('click', () => {
        this.filter = b.dataset.filter as Rarity | 'all';
        this.render();
      }),
    );
    this.grid.addEventListener('click', (e) => {
      const cell = (e.target as HTMLElement).closest<HTMLElement>('[data-index]');
      if (!cell) return;
      const slot = this.visibleSlots()[Number(cell.dataset.index)];
      if (slot && slot.count > 0) this.onCard?.(slot.card);
    });
    // Thumbnails are drawn only when scrolled into view.
    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const cell = entry.target as HTMLElement;
          this.observer.unobserve(cell);
          const slot = this.visibleSlots()[Number(cell.dataset.index)];
          if (slot) cell.prepend(thumbnail(slot.card));
        }
      },
      { root: this.grid, rootMargin: '200px' },
    );
  }

  /** `preview` marks a dev view where every Meme Cat is shown unlocked. */
  show(memes: AlbumSlot[], generated: AlbumSlot[], preview = false) {
    this.el.classList.toggle('preview', preview);
    if (preview) this.tab = 'meme';
    this.memes = memes;
    this.generated = generated;
    const ownedMemes = memes.filter((s) => s.count > 0).length;
    const [memeCount, genCount] = this.el.querySelectorAll('.album-tabs span');
    memeCount.textContent = `${ownedMemes}/${memes.length}`;
    genCount.textContent = `${generated.length}/${COLLECTION_SIZE}`;
    this.render();
    this.el.classList.add('visible');
  }

  hide() {
    this.el.classList.remove('visible', 'peek');
  }

  /** Steps aside while a card is inspected in 3D. */
  setPeek(peek: boolean) {
    this.el.classList.toggle('peek', peek);
  }

  private visibleSlots(): AlbumSlot[] {
    const slots = this.tab === 'meme' ? this.memes : this.generated;
    return this.filter === 'all' ? slots : slots.filter((s) => s.card.rarity === this.filter);
  }

  private render() {
    this.el.querySelectorAll<HTMLElement>('[data-tab]').forEach((b) => b.classList.toggle('active', b.dataset.tab === this.tab));
    this.el.querySelectorAll<HTMLElement>('[data-filter]').forEach((b) => b.classList.toggle('active', b.dataset.filter === this.filter));
    this.observer.disconnect();
    const slots = this.visibleSlots();
    if (slots.length === 0) {
      this.grid.innerHTML = `<p class="album-empty">${this.tab === 'generated' ? '還沒有編號貓，快去抽卡吧！' : '這個稀有度還沒有卡'}</p>`;
      return;
    }
    this.grid.innerHTML = slots
      .map((slot, i) => {
        const r = slot.card.rarity;
        if (slot.count === 0) {
          return `<div class="album-card locked r-${r}" data-index="${i}"><span>???</span><em>${r}</em></div>`;
        }
        const count = slot.count > 1 ? `<b class="album-count">×${slot.count}</b>` : '';
        return `<button class="album-card r-${r}" data-index="${i}" aria-label="${slot.card.name}">${count}</button>`;
      })
      .join('');
    this.grid.querySelectorAll('button.album-card').forEach((cell) => this.observer.observe(cell));
    this.grid.scrollTop = 0;
  }
}

function thumbnail(card: Card): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = THUMB_W;
  canvas.height = THUMB_H;
  const ctx = canvas.getContext('2d')!;
  const draw = (src: HTMLCanvasElement) => {
    ctx.clearRect(0, 0, THUMB_W, THUMB_H);
    ctx.drawImage(src, 0, 0, THUMB_W, THUMB_H);
  };
  draw(paintCardFront(card, draw));
  return canvas;
}
