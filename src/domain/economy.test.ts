import { describe, expect, it } from 'vitest';
import { MEME_CATS } from './cards';
import {
  DAILY_GIFT,
  STARTER_GIFT,
  canAfford,
  claimDaily,
  duplicateRefund,
  localDay,
  newWallet,
  spend,
  TAP_DAILY_CAP,
  TapLimiter,
  claimTap,
  tappedToday,
  upgradeWallet,
  type Wallet,
} from './economy';
import { generateCat, numbersOf } from './generated';
import { PITY_LIMIT, createPull, type Copy, type Rng } from './pull';

const always = (value: number): Rng => () => value;
/** Never rolls an SSR on its own: every roll lands in N. */
const noLuck = always(0.01);

describe('Wallet', () => {
  it('starts with the Starter Gift', () => {
    expect(newWallet().fish).toBe(STARTER_GIFT);
  });

  it('gives the Daily Gift once per local day', () => {
    const day1 = claimDaily(newWallet(), '2026-10-20');
    expect(day1.granted).toBe(DAILY_GIFT);
    expect(day1.wallet.fish).toBe(STARTER_GIFT + DAILY_GIFT);

    const again = claimDaily(day1.wallet, '2026-10-20');
    expect(again.granted).toBe(0);
    expect(again.wallet).toBe(day1.wallet);

    expect(claimDaily(day1.wallet, '2026-10-21').granted).toBe(DAILY_GIFT);
  });

  it('formats the local day', () => {
    expect(localDay(new Date(2026, 0, 5, 23, 59))).toBe('2026-01-05');
  });

  it('charges 100 for a Single Pull and 900 for a Ten-Pull', () => {
    const w = { ...newWallet(), fish: 1000 };
    expect(spend(w, 'single').fish).toBe(900);
    expect(spend(w, 'ten').fish).toBe(100);
  });

  it('refuses a Pull the player cannot afford', () => {
    const broke = { ...newWallet(), fish: 899 };
    expect(canAfford(broke, 'ten')).toBe(false);
    expect(canAfford(broke, 'single')).toBe(true);
    expect(() => spend(broke, 'ten')).toThrow();
  });

  it('refunds Fish for duplicate Copies by Rarity, never for New Cards', () => {
    const oiia = MEME_CATS.find((c) => c.id === 'ssr-oiia')!;
    const n = generateCat(numbersOf('N')[0]);
    const copies: Copy[] = [
      { index: 0, card: n },
      { index: 1, card: oiia },
      { index: 2, card: oiia },
    ];
    // Copy 1 is the New Card; copy 2 is a duplicate SSR; copy 0 is a duplicate of an owned card.
    expect(duplicateRefund(copies, new Set([1]))).toBe(10 + 400);
  });
});

describe('Pity', () => {
  it('forces an SSR on the draw that reaches the limit', () => {
    const result = createPull('single', { rng: noLuck, pity: PITY_LIMIT - 1 });
    expect(result.best).toBe('SSR');
    expect(result.pity).toBe(0);
  });

  it('counts draws across Pulls until an SSR', () => {
    expect(createPull('single', { rng: noLuck, pity: 5 }).pity).toBe(6);
    // Ten-Pull Guarantee rolls SR on the last slot with this rng; still no SSR.
    expect(createPull('ten', { rng: noLuck, pity: 5 }).pity).toBe(15);
  });

  it('places the forced SSR mid Ten-Pull and counts on after it', () => {
    const result = createPull('ten', { rng: noLuck, pity: PITY_LIMIT - 3 });
    expect(result.copies.filter((c) => c.card.rarity === 'SSR')).toHaveLength(1);
    // Draws 1-2 count up, draw 3 is the SSR, draws 4-10 count again.
    expect(result.pity).toBe(7);
  });

  it('never lets a player go a full Pity window without an SSR', () => {
    let pity = 0;
    let longest = 0;
    let since = 0;
    for (let i = 0; i < 300; i++) {
      const result = createPull('single', { pity });
      since = result.best === 'SSR' ? 0 : since + 1;
      longest = Math.max(longest, since);
      pity = result.pity;
    }
    expect(longest).toBeLessThan(PITY_LIMIT);
  });
});

describe('Tap Fish', () => {
  it('gives one Fish per tap and counts them for the day', () => {
    const { wallet, granted } = claimTap(newWallet(), '2026-10-20');
    expect(granted).toBe(1);
    expect(wallet.fish).toBe(STARTER_GIFT + 1);
    expect(tappedToday(wallet, '2026-10-20')).toBe(1);
  });

  it('stops at the daily cap and resets the next day', () => {
    let w: Wallet = { ...newWallet(), tapDay: '2026-10-20', tapped: TAP_DAILY_CAP - 1 };
    w = claimTap(w, '2026-10-20').wallet;
    const capped = claimTap(w, '2026-10-20');
    expect(capped.granted).toBe(0);
    expect(capped.wallet.fish).toBe(w.fish);
    expect(tappedToday(w, '2026-10-21')).toBe(0);
    expect(claimTap(w, '2026-10-21').granted).toBe(1);
  });

  it('limits taps to a human rate within any one second', () => {
    const limiter = new TapLimiter(12);
    const allowed = Array.from({ length: 30 }, (_, i) => limiter.allow(i * 10)).filter(Boolean);
    expect(allowed).toHaveLength(12);
    expect(limiter.allow(1000)).toBe(true);
  });

  it('upgrades wallets saved before Tap Fish existed', () => {
    const w = upgradeWallet({ fish: 42, lastDaily: '2026-10-19', pity: 3 });
    expect(w).toEqual({ fish: 42, lastDaily: '2026-10-19', pity: 3, tapDay: null, tapped: 0 });
  });
});
