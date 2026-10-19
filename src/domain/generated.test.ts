import { describe, expect, it } from 'vitest';
import { COLLECTION_SIZE, generateCat, numbersOf, rareTraitCount, traitShare } from './generated';
import { createPull, MEME_CHANCE, type Rng } from './pull';
import { RARITIES, RATES } from './rarity';
import { TRAITS } from './traits';

function seeded(seed: number): Rng {
  return () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };
}

describe('Generated Cats', () => {
  it('the same Cat Number always gives the same cat', () => {
    const a = generateCat(4821);
    const b = generateCat(4821);
    expect(b).toEqual(a);
    expect(a.title).toBe('#4821');
  });

  it('every Cat Number has exactly one Rarity, spread roughly by the Rates', () => {
    const total = RARITIES.reduce((sum, r) => sum + numbersOf(r).length, 0);
    expect(total).toBe(COLLECTION_SIZE);
    for (const r of RARITIES) {
      expect(numbersOf(r).length / COLLECTION_SIZE).toBeCloseTo(RATES[r], 1);
      expect(numbersOf(r).length).toBeGreaterThan(0);
    }
  });

  it('N and R cats never have rare Traits; SR has one, SSR has two', () => {
    const expected = { N: 0, R: 0, SR: 1, SSR: 2 };
    for (const r of RARITIES) {
      for (const n of numbersOf(r).slice(0, 300)) {
        expect(rareTraitCount(generateCat(n))).toBe(expected[r]);
      }
    }
  });

  it('names the cat after its Traits', () => {
    for (let n = 1; n <= 200; n++) expect(generateCat(n).name).toMatch(/貓$/);
  });

  it('Trait shares add up to the whole collection for each Trait', () => {
    for (const [key, values] of Object.entries(TRAITS)) {
      const sum = values.reduce((s, v) => s + traitShare(key as keyof typeof TRAITS, v.id), 0);
      expect(sum).toBeCloseTo(1, 5);
    }
  });
});

describe('Meme Chance', () => {
  it('about 30% of drawn Copies are Meme Cats', () => {
    const rng = seeded(77);
    let memes = 0;
    let total = 0;
    for (let i = 0; i < 2000; i++) {
      for (const copy of createPull('ten', { rng }).copies) {
        total++;
        if (copy.card.kind === 'meme') memes++;
      }
    }
    expect(memes / total).toBeCloseTo(MEME_CHANCE, 1);
  });
});
