import type { GeneratedCat } from './cards';
import { RARITIES, RATES, type Rarity } from './rarity';
import { TRAITS, TRAIT_KEYS, traitValue, type TraitKey, type TraitValue, type Traits } from './traits';

export const COLLECTION_SIZE = 9999;

/** The generator this code implements. Album entries record it so old cats can keep their look. */
export const GENERATOR_VERSION = 1;

/** How many Traits are forced to a rare value, by Rarity. N and R never get rare values. */
const RARE_TRAITS: Record<Rarity, number> = { N: 0, R: 0, SR: 1, SSR: 2 };

/** Order in which Traits are tried when naming a cat: the most eye-catching first. */
const NAME_ORDER: TraitKey[] = ['headwear', 'held', 'face', 'eyes', 'expression'];

const cache = new Map<number, GeneratedCat>();
let byRarity: Record<Rarity, number[]> | undefined;
let shares: Map<string, number> | undefined;

/** Deterministic PRNG for a Cat Number. */
function rngFor(n: number, salt: number) {
  let s = Math.imul(n ^ 0x9e3779b9, 0x85ebca6b) ^ salt;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** A Cat Number's Rarity, spread across the collection in proportion to the Rates. */
export function rarityOfNumber(n: number): Rarity {
  let roll = rngFor(n, 0x5eed)();
  for (const rarity of RARITIES) {
    roll -= RATES[rarity];
    if (roll < 0) return rarity;
  }
  return 'N';
}

export function numbersOf(rarity: Rarity): number[] {
  if (!byRarity) {
    byRarity = { N: [], R: [], SR: [], SSR: [] };
    for (let n = 1; n <= COLLECTION_SIZE; n++) byRarity[rarityOfNumber(n)].push(n);
  }
  return byRarity[rarity];
}

export function generateCat(n: number): GeneratedCat {
  const cached = cache.get(n);
  if (cached) return cached;

  const rarity = rarityOfNumber(n);
  const traits = rollTraits(n, rarity);
  const cat: GeneratedCat = {
    kind: 'generated',
    id: `cat-${n}`,
    number: n,
    name: nameFor(traits),
    title: `#${String(n).padStart(4, '0')}`,
    rarity,
    hue: Math.floor(rngFor(n, 0x4e)() * 360),
    traits,
  };
  cache.set(n, cat);
  return cat;
}

function rollTraits(n: number, rarity: Rarity): Traits {
  const rng = rngFor(n, 0x7a17);
  const rareKeys = new Set<TraitKey>();
  const pool = [...TRAIT_KEYS];
  for (let i = 0; i < RARE_TRAITS[rarity]; i++) {
    rareKeys.add(pool.splice(Math.floor(rng() * pool.length), 1)[0]);
  }
  const traits = {} as Traits;
  for (const key of TRAIT_KEYS) {
    const values = TRAITS[key].filter((v) => !!v.rare === rareKeys.has(key));
    traits[key] = weightedPick(rng, values).id;
  }
  return traits;
}

function weightedPick(rng: () => number, values: TraitValue[]): TraitValue {
  const total = values.reduce((sum, v) => sum + (v.weight ?? 1), 0);
  let roll = rng() * total;
  for (const v of values) {
    roll -= v.weight ?? 1;
    if (roll < 0) return v;
  }
  return values[values.length - 1];
}

/** e.g. 「戴皇冠的橘貓」: the rarest named Trait first, then the fur. */
function nameFor(traits: Traits): string {
  const named = NAME_ORDER.map((key) => traitValue(key, traits[key])).filter((v) => v.prefix);
  const best = named.find((v) => v.rare) ?? named[0];
  const fur = traitValue('fur', traits.fur).label;
  const noun = fur.endsWith('貓') ? fur : `${fur}貓`;
  return `${best?.prefix ?? ''}${noun}`;
}

/** Share of the whole collection that has this Trait value, e.g. 0.031 for 3.1%. */
export function traitShare(key: TraitKey, id: string): number {
  if (!shares) {
    shares = new Map();
    for (let n = 1; n <= COLLECTION_SIZE; n++) {
      const traits = rollTraits(n, rarityOfNumber(n));
      for (const k of TRAIT_KEYS) shares.set(`${k}:${traits[k]}`, (shares.get(`${k}:${traits[k]}`) ?? 0) + 1);
    }
  }
  return (shares.get(`${key}:${id}`) ?? 0) / COLLECTION_SIZE;
}

export function rareTraitCount(cat: GeneratedCat): number {
  return TRAIT_KEYS.filter((k) => traitValue(k, cat.traits[k]).rare).length;
}

