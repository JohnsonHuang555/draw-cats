import { describe, expect, it } from 'vitest';
import { createPull, type Rng } from './pull';
import { rank } from './rarity';

function seeded(seed: number): Rng {
  return () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };
}

const always = (value: number): Rng => () => value;

describe('createPull', () => {
  it('a Single Pull produces one Copy, a Ten-Pull ten', () => {
    expect(createPull('single', { rng: seeded(1) }).copies).toHaveLength(1);
    expect(createPull('ten', { rng: seeded(1) }).copies).toHaveLength(10);
  });

  it('every Ten-Pull contains at least one SR or higher', () => {
    const rng = seeded(42);
    for (let i = 0; i < 2000; i++) {
      const result = createPull('ten', { rng });
      expect(result.copies.some((c) => rank(c.card.rarity) >= rank('SR'))).toBe(true);
    }
  });

  it('applies the Ten-Pull Guarantee even when every roll is N', () => {
    const result = createPull('ten', { rng: always(0) });
    expect(result.copies.filter((c) => c.card.rarity === 'N')).toHaveLength(9);
    expect(result.best).toBe('SR');
  });

  it('puts Copies in Reveal Order, lowest Rarity first', () => {
    const rng = seeded(7);
    for (let i = 0; i < 200; i++) {
      const ranks = createPull('ten', { rng }).copies.map((c) => rank(c.card.rarity));
      expect(ranks).toEqual([...ranks].sort((a, b) => a - b));
    }
  });

  it('roughly matches the Rates over many Single Pulls', () => {
    const rng = seeded(123);
    const counts = { N: 0, R: 0, SR: 0, SSR: 0 };
    const n = 100_000;
    for (let i = 0; i < n; i++) counts[createPull('single', { rng }).best]++;
    expect(counts.N / n).toBeCloseTo(0.6, 1);
    expect(counts.R / n).toBeCloseTo(0.3, 1);
    expect(counts.SR / n).toBeGreaterThan(0.07);
    expect(counts.SSR / n).toBeGreaterThan(0.01);
    expect(counts.SSR / n).toBeLessThan(0.02);
  });

  it('only fakes out when the Pull contains an SSR, showing a lower Pack Hint', () => {
    const rng = seeded(9);
    let fakeOuts = 0;
    for (let i = 0; i < 3000; i++) {
      const result = createPull('ten', { rng });
      if (result.fakeOut) {
        fakeOuts++;
        expect(result.best).toBe('SSR');
        expect(rank(result.packHint)).toBeLessThan(rank('SSR'));
      } else {
        expect(result.packHint).toBe(result.best);
      }
    }
    expect(fakeOuts).toBeGreaterThan(0);
  });

  it('dev overrides force an SSR with a Fake-out', () => {
    const result = createPull('single', { rng: seeded(3), forceRarity: 'SSR', forceFakeOut: true });
    expect(result.best).toBe('SSR');
    expect(result.fakeOut).toBe(true);
    expect(result.packHint).toBe('SR');
  });
});
