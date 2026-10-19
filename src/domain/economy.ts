import type { Copy, PullKind } from './pull';
import type { Rarity } from './rarity';

export const PULL_COST: Record<PullKind, number> = { single: 100, ten: 900 };
export const STARTER_GIFT = 3000;
export const DAILY_GIFT = 1000;
export const DUPLICATE_REFUND: Record<Rarity, number> = { N: 10, R: 30, SR: 100, SSR: 400 };

/** The player's spendable state: Fish, the last day a Daily Gift was given, and the Pity Counter. */
export interface Wallet {
  fish: number;
  /** Local date (YYYY-MM-DD) of the last Daily Gift, or null if never. */
  lastDaily: string | null;
  pity: number;
  /** Local date the Tap Fish count belongs to; a new day resets it. */
  tapDay: string | null;
  /** Tap Fish earned on `tapDay`. */
  tapped: number;
}

/** Most Tap Fish a player can earn per local day. */
export const TAP_DAILY_CAP = 500;
/** Taps per second a person can plausibly make; faster taps don't earn. */
export const TAP_MAX_PER_SECOND = 12;

/** A brand-new player's wallet, Starter Gift included. */
export function newWallet(): Wallet {
  return { fish: STARTER_GIFT, lastDaily: null, pity: 0, tapDay: null, tapped: 0 };
}

/** Fills in fields added after a wallet was first saved. */
export function upgradeWallet(saved: Partial<Wallet> & { fish: number }): Wallet {
  return { ...newWallet(), ...saved };
}

/** Tap Fish earned so far today. */
export function tappedToday(wallet: Wallet, today: string): number {
  return wallet.tapDay === today ? wallet.tapped : 0;
}

/** One Tap Fish, unless today's cap is reached. Pure. */
export function claimTap(wallet: Wallet, today: string): { wallet: Wallet; granted: number } {
  const tapped = tappedToday(wallet, today);
  if (tapped >= TAP_DAILY_CAP) return { wallet, granted: 0 };
  return { wallet: { ...wallet, fish: wallet.fish + 1, tapDay: today, tapped: tapped + 1 }, granted: 1 };
}

/** Sliding one-second window: rejects taps beyond what a person can make. */
export class TapLimiter {
  private times: number[] = [];

  constructor(private maxPerSecond = TAP_MAX_PER_SECOND) {}

  allow(nowMs: number): boolean {
    this.times = this.times.filter((t) => nowMs - t < 1000);
    if (this.times.length >= this.maxPerSecond) return false;
    this.times.push(nowMs);
    return true;
  }
}

/** Local calendar date, so the Daily Gift resets at the player's midnight. */
export function localDay(now: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

/** Gives the Daily Gift if it hasn't been given today. Pure. */
export function claimDaily(wallet: Wallet, today: string): { wallet: Wallet; granted: number } {
  if (wallet.lastDaily === today) return { wallet, granted: 0 };
  return { wallet: { ...wallet, fish: wallet.fish + DAILY_GIFT, lastDaily: today }, granted: DAILY_GIFT };
}

export function canAfford(wallet: Wallet, kind: PullKind): boolean {
  return wallet.fish >= PULL_COST[kind];
}

export function spend(wallet: Wallet, kind: PullKind): Wallet {
  if (!canAfford(wallet, kind)) throw new Error(`Not enough Fish for a ${kind} Pull`);
  return { ...wallet, fish: wallet.fish - PULL_COST[kind] };
}

/** Fish returned for every Copy that isn't a New Card. */
export function duplicateRefund(copies: Copy[], newCopies: Set<number>): number {
  return copies
    .filter((c) => !newCopies.has(c.index))
    .reduce((sum, c) => sum + DUPLICATE_REFUND[c.card.rarity], 0);
}
