import { memesOf, type Card } from './cards';
import { generateCat, numbersOf } from './generated';
import { FAKE_OUT_CHANCE, RARITIES, RATES, highest, rank, type Rarity } from './rarity';

/** Chance that a draw, after its Rarity is rolled, yields a Meme Cat rather than a Generated Cat. */
export const MEME_CHANCE = 0.3;

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
  /** Pity Counter after this Pull. */
  pity: number;
}

/** An SSR is guaranteed on this many draws without one. */
export const PITY_LIMIT = 90;

export type Rng = () => number;

export interface PullOptions {
  rng?: Rng;
  /** Dev: guarantee at least one Copy of this Rarity. */
  forceRarity?: Rarity;
  /** Dev: force a Fake-out whenever the Pull contains an SSR. */
  forceFakeOut?: boolean;
  /** Pity Counter before this Pull (draws since the last SSR). */
  pity?: number;
}

export function createPull(kind: PullKind, options: PullOptions = {}): PullResult {
  const rng = options.rng ?? Math.random;
  const size = kind === 'ten' ? 10 : 1;

  // Rolled in draw order; Pity forces an SSR on the draw that reaches the limit.
  let sinceSSR = options.pity ?? 0;
  const rarities: Rarity[] = Array.from({ length: size }, () => {
    const rarity = sinceSSR + 1 >= PITY_LIMIT ? 'SSR' : rollRarity(rng, RARITIES);
    sinceSSR = rarity === 'SSR' ? 0 : sinceSSR + 1;
    return rarity;
  });

  if (kind === 'ten' && rarities.every((r) => rank(r) < rank('SR'))) {
    rarities[size - 1] = rollRarity(rng, ['SR', 'SSR']);
  }
  if (options.forceRarity && !rarities.includes(options.forceRarity)) {
    rarities[size - 1] = options.forceRarity;
  }
  const lastSSR = rarities.lastIndexOf('SSR');
  const pity = lastSSR >= 0 ? size - 1 - lastSSR : (options.pity ?? 0) + size;

  const copies = rarities
    .map((rarity) => drawCard(rng, rarity))
    .sort((a, b) => rank(a.rarity) - rank(b.rarity))
    .map((card, index) => ({ index, card }));

  const best = highest(rarities);
  const fakeOut = best === 'SSR' && (options.forceFakeOut === true || rng() < FAKE_OUT_CHANCE);

  return { kind, copies, best, packHint: fakeOut ? 'SR' : best, fakeOut, pity };
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

function drawCard(rng: Rng, rarity: Rarity): Card {
  if (rng() < MEME_CHANCE) return pick(rng, memesOf(rarity));
  return generateCat(pick(rng, numbersOf(rarity)));
}

function pick<T>(rng: Rng, items: T[]): T {
  return items[Math.floor(rng() * items.length)];
}
