import { describe, expect, it } from 'vitest';
import { boutAt, turnsAt } from './catKit';

describe('turnsAt', () => {
  it('turns steadily when there is no pause', () => {
    const motion = { kind: 'spin', period: 4 } as const;
    expect(turnsAt(motion, 0)).toBe(0);
    expect(turnsAt(motion, 2)).toBe(0.5);
    expect(turnsAt(motion, 10)).toBe(2.5);
  });

  it('holds still through the delay', () => {
    const motion = { kind: 'spin', period: 1, delay: 1, pause: 1 } as const;
    expect(turnsAt(motion, 0)).toBe(0);
    expect(turnsAt(motion, 0.9)).toBe(0);
  });

  it('makes one full turn, then stops for the pause, over and over', () => {
    const motion = { kind: 'spin', period: 1, delay: 1, pause: 1 } as const;
    expect(turnsAt(motion, 1.5)).toBeCloseTo(0.5);
    expect(turnsAt(motion, 2)).toBeCloseTo(1);
    expect(turnsAt(motion, 2.6)).toBeCloseTo(1);
    expect(turnsAt(motion, 3.5)).toBeCloseTo(1.5);
    expect(turnsAt(motion, 4.4)).toBeCloseTo(2);
  });

  it('eases each turn in and out', () => {
    const motion = { kind: 'spin', period: 1, pause: 1 } as const;
    expect(turnsAt(motion, 0.1)).toBeLessThan(0.1);
    expect(turnsAt(motion, 0.9)).toBeGreaterThan(0.9);
  });
});

describe('boutAt', () => {
  const drum = { kind: 'drum', period: 1, delay: 1, pause: 1 } as const;

  it('is undefined while holding still', () => {
    expect(boutAt(drum, 0.5)).toBeUndefined();
    expect(boutAt(drum, 2.5)).toBeUndefined();
  });

  it('counts seconds into each burst', () => {
    expect(boutAt(drum, 1.25)).toBeCloseTo(0.25);
    expect(boutAt(drum, 3.5)).toBeCloseTo(0.5);
  });

  it('never rests without a pause', () => {
    expect(boutAt({ kind: 'drum', period: 1 }, 7.25)).toBeCloseTo(0.25);
  });
});
