import { describe, it, expect } from 'vitest';
import { toleranceTime, computeFed } from './fed.ts';

describe('toleranceTime', () => {
  it('computes t_tolrad = (1.33 / Q^1.33) * 60', () => {
    // For Q = 2.5 kW/m²:
    // 2.5^1.33 ≈ 3.395, t = (1.33 / 3.395) * 60 ≈ 23.5s
    const ttol = toleranceTime(2.5);
    expect(ttol).toBeCloseTo(23.5, 0);
  });

  it('higher flux gives shorter tolerance time', () => {
    expect(toleranceTime(5)).toBeLessThan(toleranceTime(2.5));
  });
});

describe('computeFed', () => {
  it('computes cumulative FED correctly', () => {
    const entries = [
      { index: 0, time: 0, distanceToFire: 3 },
      { index: 1, time: 0.5, distanceToFire: 3 },
      { index: 2, time: 1.0, distanceToFire: 3 },
    ];

    // Use a simple constant heat flux function
    const constantFlux = 2.5; // kW/m²
    const result = computeFed(entries, 0.5, () => constantFlux);

    const ttol = toleranceTime(constantFlux);
    const expectedPerStep = (1 / ttol) * 0.5;

    expect(result.cumulative[0]).toBe(0);
    expect(result.cumulative[1]).toBeCloseTo(expectedPerStep, 6);
    expect(result.cumulative[2]).toBeCloseTo(expectedPerStep * 2, 6);
    expect(result.total).toBeCloseTo(expectedPerStep * 2, 6);
  });

  it('returns zero FED for empty entries', () => {
    const entries = [{ index: 0, time: 0, distanceToFire: 3 }];
    const result = computeFed(entries, 0.5, () => 1);
    expect(result.total).toBe(0);
    expect(result.cumulative).toEqual([0]);
  });
});
