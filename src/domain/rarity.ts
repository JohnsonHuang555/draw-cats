export const RARITIES = ['N', 'R', 'SR', 'SSR'] as const;
export type Rarity = (typeof RARITIES)[number];

export const RATES: Record<Rarity, number> = {
  N: 0.6,
  R: 0.3,
  SR: 0.085,
  SSR: 0.015,
};

/** Chance that a Pull containing an SSR plays a Fake-out on its Pack Hint. */
export const FAKE_OUT_CHANCE = 0.3;

export function rank(rarity: Rarity): number {
  return RARITIES.indexOf(rarity);
}

export function highest(rarities: Rarity[]): Rarity {
  return rarities.reduce<Rarity>((best, r) => (rank(r) > rank(best) ? r : best), 'N');
}

export function hasFoil(rarity: Rarity): boolean {
  return rank(rarity) >= rank('SR');
}
