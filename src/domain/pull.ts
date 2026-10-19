import { cardsOf, type Card } from './cards';
import { FAKE_OUT_CHANCE, RARITIES, RATES, highest, rank, type Rarity } from './rarity';

export type PullKind = 'single' | 'ten';

export interface Copy {
  /** Unique within its Pull Result. */
  index: number;
  card: Card;
}

export interface PullResult {
  kind: PullKind;
  /** Copies in Reveal Order: lowest Rarity first. */
  copies: Copy[];
  /** The true highest Rarity in this Pull. */
  best: Rarity;
  /** What the Pack Hint shows before the Tear (lower than `best` on a Fake-out). */
  packHint: Rarity;
  fakeOut: boolean;
}

export type Rng = () => number;

export interface PullOptions {
  rng?: Rng;
  /** Dev: guarantee at least one Copy of this Rarity. */
  forceRarity?: Rarity;
  /** Dev: force a Fake-out whenever the Pull contains an SSR. */
  forceFakeOut?: boolean;
}

export function createPull(kind: PullKind, options: PullOptions = {}): PullResult {
  const rng = options.rng ?? Math.random;
  const size = kind === 'ten' ? 10 : 1;

  const rarities: Rarity[] = Array.from({ length: size }, () => rollRarity(rng, RARITIES));

  if (kind === 'ten' && rarities.every((r) => rank(r) < rank('SR'))) {
    rarities[size - 1] = rollRarity(rng, ['SR', 'SSR']);
  }
  if (options.forceRarity && !rarities.includes(options.forceRarity)) {
    rarities[size - 1] = options.forceRarity;
  }

  const copies = rarities
    .map((rarity) => pick(rng, cardsOf(rarity)))
    .sort((a, b) => rank(a.rarity) - rank(b.rarity))
    .map((card, index) => ({ index, card }));

  const best = highest(rarities);
  const fakeOut = best === 'SSR' && (options.forceFakeOut === true || rng() < FAKE_OUT_CHANCE);

  return { kind, copies, best, packHint: fakeOut ? 'SR' : best, fakeOut };
}

function rollRarity(rng: Rng, among: readonly Rarity[]): Rarity {
  const total = among.reduce((sum, r) => sum + RATES[r], 0);
  let roll = rng() * total;
  for (const rarity of among) {
    roll -= RATES[rarity];
    if (roll < 0) return rarity;
  }
  return among[among.length - 1];
}

function pick<T>(rng: Rng, items: T[]): T {
  return items[Math.floor(rng() * items.length)];
}
