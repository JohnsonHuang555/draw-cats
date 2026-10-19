import gsap from 'gsap';
import type { Card } from '../domain/cards';
import { traitShare } from '../domain/generated';
import { PULL_COST } from '../domain/economy';
import { PITY_LIMIT, type PullKind } from '../domain/pull';
import { TRAIT_KEYS, TRAIT_LABELS, traitValue } from '../domain/traits';
import { RARITY_CSS } from '../scene/palette';
import { AlbumView } from './albumView';

export type SummaryAction = PullKind | 'home';

export interface DevOptions {
  forceSSR: boolean;
  forceFakeOut: boolean;
}

function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className = '',
  html = '',
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  node.className = className;
  node.innerHTML = html;
  return node;
}

/** DOM layer above the canvas: home screen, prompts, SSR caption, Summary buttons, toolbar and dev panel. */
export class Overlay {
  readonly dev: DevOptions = { forceSSR: false, forceFakeOut: false };
  onPull?: (kind: PullKind) => void;
  onSummary?: (action: SummaryAction) => void;
  onRevealAll?: () => void;
  onMute?: (muted: boolean) => void;
  onOpenAlbum?: () => void;
  onClearAlbum?: () => void;
  onAddFish?: () => void;
  readonly album = new AlbumView();

  private home = el('section', 'home panel');
  private prompt = el('div', 'prompt');
  private revealAll = el('button', 'reveal-all', '全部翻開 ≫');
  private caption = el('div', 'caption');
  private traits = el('ul', 'traits');
  private summary = el('section', 'summary panel');
  private flashLayer = el('div', 'flash');
  private wallet = el('div', 'wallet');
  private toastEl = el('div', 'toast');
  private muteBtn = el('button', 'icon-btn');
  private reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    .matches;

  constructor(root: HTMLElement, muted: boolean, showDev: boolean) {
    this.home.innerHTML = `
      <header>
        <h1 class="title">喵喵抽卡</h1>
        <p class="subtitle">撕開卡包，蒐集你的貓貓</p>
      </header>
      <footer>
        <div class="actions">
          <button class="btn" data-open-album>卡冊</button>
          <button class="btn" data-pull="single">
            單抽<small>🐟${PULL_COST.single}</small>
          </button>
          <button class="btn btn-primary" data-pull="ten">
            十連抽<small>🐟${PULL_COST.ten}</small>
          </button>
        </div>
        <p class="rates">
          SSR 1.5% ・ SR 8.5% ・ R 30% ・ N 60%<br />
          十連抽必得 SR 以上 ・ ${PITY_LIMIT} 抽內必得 SSR
        </p>
      </footer>
    `;
    this.home
      .querySelectorAll<HTMLButtonElement>('[data-pull]')
      .forEach((b) =>
        b.addEventListener('click', () =>
          this.onPull?.(b.dataset.pull as PullKind),
        ),
      );

    this.summary.innerHTML = `
      <h2 class="summary-title">抽卡結果</h2>
      <p class="summary-hint">點擊卡片查看</p>
      <p class="summary-refund"></p>
      <div class="actions summary-actions">
        <button class="btn" data-action="home">返回</button>
        <button class="btn" data-open-album>卡冊</button>
        <button class="btn" data-action="single">
          再抽一次<small>🐟${PULL_COST.single}</small>
        </button>
        <button class="btn btn-primary" data-action="ten">
          十連抽<small>🐟${PULL_COST.ten}</small>
        </button>
      </div>
    `;
    this.summary
      .querySelectorAll<HTMLButtonElement>('[data-action]')
      .forEach((b) =>
        b.addEventListener('click', () =>
          this.onSummary?.(b.dataset.action as SummaryAction),
        ),
      );

    [this.home, this.summary].forEach((panel) =>
      panel
        .querySelectorAll<HTMLButtonElement>('[data-open-album]')
        .forEach((b) =>
          b.addEventListener('click', () => this.onOpenAlbum?.()),
        ),
    );

    this.revealAll.addEventListener('click', () => this.onRevealAll?.());

    const toolbar = el('div', 'toolbar');
    this.setMuteIcon(muted);
    this.muteBtn.setAttribute('aria-label', '靜音');
    this.muteBtn.addEventListener('click', () => {
      muted = !muted;
      this.setMuteIcon(muted);
      this.onMute?.(muted);
    });
    toolbar.append(this.muteBtn);

    if (showDev) {
      const devBtn = el('button', 'icon-btn', '⚙');
      devBtn.setAttribute('aria-label', '開發者面板');
      const panel = el('div', 'dev-panel');
      panel.innerHTML = `
        <strong>開發者面板</strong>
        <label><input type="checkbox" data-dev="forceSSR" /> 強制 SSR</label>
        <label><input type="checkbox" data-dev="forceFakeOut" /> 強制 Fake-out</label>
        <button class="dev-fish">+10000 小魚乾</button>
        <button class="dev-clear">清空卡冊</button>
      `;
      panel
        .querySelector('.dev-fish')!
        .addEventListener('click', () => this.onAddFish?.());
      panel.querySelector('.dev-clear')!.addEventListener('click', () => {
        if (window.confirm('確定要清空卡冊嗎？')) this.onClearAlbum?.();
      });
      panel.querySelectorAll<HTMLInputElement>('[data-dev]').forEach((input) =>
        input.addEventListener('change', () => {
          this.dev[input.dataset.dev as keyof DevOptions] = input.checked;
        }),
      );
      devBtn.addEventListener('click', () => panel.classList.toggle('open'));
      toolbar.append(devBtn, panel);
    }

    root.append(
      this.home,
      this.prompt,
      this.revealAll,
      this.caption,
      this.summary,
      this.album.el,
      this.traits,
      this.wallet,
      toolbar,
      this.toastEl,
      this.flashLayer,
    );
  }

  /** Fish balance and draws left until Pity. */
  setWallet(fish: number, pity: number) {
    this.wallet.innerHTML = `
      <span class="wallet-fish">🐟 <b>${fish.toLocaleString()}</b></span>
      <span class="wallet-pity">距離保底 <b>${PITY_LIMIT - pity}</b> 抽</span>
    `;
  }

  showWallet(visible: boolean) {
    this.toggle(this.wallet, visible);
  }

  /** Duplicate Refund line on the Summary; empty when nothing was refunded. */
  setRefund(fish: number) {
    const line = this.summary.querySelector<HTMLElement>('.summary-refund')!;
    line.textContent = fish > 0 ? `重複卡退還 +${fish} 🐟` : '';
  }

  /** A short message that fades out on its own. */
  toast(text: string) {
    this.toastEl.textContent = text;
    gsap.killTweensOf(this.toastEl);
    gsap.fromTo(
      this.toastEl,
      { opacity: 0, y: -12, xPercent: -50 },
      { opacity: 1, y: 0, xPercent: -50, duration: 0.3, ease: 'power2.out' },
    );
    gsap.to(this.toastEl, { opacity: 0, duration: 0.4, delay: 2.4 });
  }

  showHome(visible: boolean) {
    this.toggle(this.home, visible);
  }

  showSummary(visible: boolean) {
    this.toggle(this.summary, visible);
  }

  showRevealAll(visible: boolean) {
    this.toggle(this.revealAll, visible);
  }

  setPrompt(text: string | null) {
    if (text) this.prompt.textContent = text;
    this.toggle(this.prompt, !!text);
  }

  /** NFT-style Trait list for an inspected card; a Meme Cat shows its catchphrase instead. */
  showTraits(card: Card | null) {
    if (card?.kind === 'generated') {
      this.traits.innerHTML = TRAIT_KEYS.map((key) => {
        const value = traitValue(key, card.traits[key]);
        const share = traitShare(key, value.id) * 100;
        return `<li class="${value.rare ? 'rare' : ''}"><span>${TRAIT_LABELS[key]}</span><b>${value.label}</b><em>${share < 1 ? share.toFixed(2) : share.toFixed(1)}%</em></li>`;
      }).join('');
    } else if (card) {
      this.traits.innerHTML = `<li class="meme"><span>迷因貓</span><b>${card.title}</b></li>`;
    }
    this.toggle(this.traits, !!card);
  }

  showCaption(card: Card | null) {
    if (card) {
      const color = RARITY_CSS[card.rarity];
      this.caption.innerHTML = `
        <span class="caption-rarity" style="--c:${color}">${card.rarity}</span>
        <span class="caption-name">${card.name}</span>
        <span class="caption-title">${card.title}</span>
      `;
      gsap.fromTo(
        this.caption.children,
        { opacity: 0, y: 24, filter: 'blur(6px)' },
        {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 0.6,
          stagger: 0.12,
          ease: 'power3.out',
        },
      );
    }
    this.toggle(this.caption, !!card);
  }

  /** Full-screen colour flash. Softer when the viewer prefers reduced motion. */
  flash(color: string, intensity: number, duration = 0.6) {
    const peak = this.reducedMotion ? Math.min(intensity, 0.15) : intensity;
    this.flashLayer.style.background = color;
    gsap.fromTo(
      this.flashLayer,
      { opacity: peak },
      { opacity: 0, duration, ease: 'power2.out' },
    );
  }

  private setMuteIcon(muted: boolean) {
    this.muteBtn.textContent = muted ? '🔇' : '🔊';
  }

  private toggle(node: HTMLElement, visible: boolean) {
    node.classList.toggle('visible', visible);
  }
}
