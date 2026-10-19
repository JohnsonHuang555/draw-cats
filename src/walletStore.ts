import {
  canAfford,
  claimDaily,
  localDay,
  newWallet,
  spend,
  type Wallet,
} from './domain/economy';
import type { PullKind } from './domain/pull';

const KEY = 'draw-card-game:wallet';

interface SaveFile {
  version: 1;
  wallet: Wallet;
}

/**
 * The player's Fish, Daily Gift date and Pity Counter, persisted in this browser's localStorage.
 * Like the Album, it falls back to memory when storage is unavailable.
 */
export class WalletStore {
  wallet: Wallet;
  /** True on the very first visit, when the Starter Gift was just given. */
  readonly isNew: boolean;

  constructor() {
    const saved = load();
    this.isNew = !saved;
    this.wallet = saved ?? newWallet();
    this.save();
  }

  /** Gives today's Daily Gift if not yet claimed; returns the Fish granted. */
  claimDaily(now = new Date()): number {
    const { wallet, granted } = claimDaily(this.wallet, localDay(now));
    this.wallet = wallet;
    this.save();
    return granted;
  }

  canAfford(kind: PullKind): boolean {
    return canAfford(this.wallet, kind);
  }

  spend(kind: PullKind) {
    this.wallet = spend(this.wallet, kind);
    this.save();
  }

  earn(fish: number) {
    if (fish <= 0) return;
    this.wallet = { ...this.wallet, fish: this.wallet.fish + fish };
    this.save();
  }

  setPity(pity: number) {
    this.wallet = { ...this.wallet, pity };
    this.save();
  }

  private save() {
    const file: SaveFile = { version: 1, wallet: this.wallet };
    try {
      localStorage.setItem(KEY, JSON.stringify(file));
    } catch {
      // Storage unavailable: keep the wallet in memory only.
    }
  }
}

function load(): Wallet | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const file = JSON.parse(raw) as SaveFile;
    return file.version === 1 && file.wallet ? file.wallet : null;
  } catch {
    return null;
  }
}
