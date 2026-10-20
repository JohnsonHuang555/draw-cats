import { describe, expect, it } from 'vitest';
import { turnsAt } from './catKit';

describe('turnsAt', () => {
  it('turns steadily when there is no pause', () => {
    expect(turnsAt({ spin: 4 }, 0)).toBe(0);
    expect(turnsAt({ spin: 4 }, 2)).toBe(0.5);
    expect(turnsAt({ spin: 4 }, 10)).toBe(2.5);
  });

  it('holds still through the delay', () => {
    const motion = { spin: 1, delay: 1, pause: 1 };
    expect(turnsAt(motion, 0)).toBe(0);
    expect(turnsAt(motion, 0.9)).toBe(0);
  });

  it('makes one full turn, then stops for the pause, over and over', () => {
    const motion = { spin: 1, delay: 1, pause: 1 };
    expect(turnsAt(motion, 1.5)).toBeCloseTo(0.5);
    expect(turnsAt(motion, 2)).toBeCloseTo(1);
    expect(turnsAt(motion, 2.6)).toBeCloseTo(1);
    expect(turnsAt(motion, 3.5)).toBeCloseTo(1.5);
    expect(turnsAt(motion, 4.4)).toBeCloseTo(2);
  });

  it('eases each turn in and out', () => {
    const motion = { spin: 1, pause: 1 };
    expect(turnsAt(motion, 0.1)).toBeLessThan(0.1);
    expect(turnsAt(motion, 0.9)).toBeGreaterThan(0.9);
  });
});
