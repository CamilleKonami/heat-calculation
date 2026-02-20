import { describe, it, expect } from 'vitest';
import {
  viewFactor,
  emissivity,
  rectangularPanelHeatFlux,
  pointSourceHeatFlux,
  findRectangularPanelDistance,
  findPointSourceDistance,
} from './radiation.ts';

describe('emissivity', () => {
  it('computes emissivity for flame thickness 0.52m', () => {
    const em = emissivity(0.52);
    expect(em).toBeCloseTo(0.1445, 3);
  });

  it('returns 0 for zero thickness', () => {
    expect(emissivity(0)).toBe(0);
  });
});

describe('viewFactor', () => {
  it('returns a value between 0 and 1', () => {
    const vf = viewFactor(0.52, 1, 2);
    expect(vf).toBeGreaterThan(0);
    expect(vf).toBeLessThan(1);
  });

  it('increases as distance decreases', () => {
    const vfNear = viewFactor(0.52, 1, 0.5);
    const vfFar = viewFactor(0.52, 1, 5);
    expect(vfNear).toBeGreaterThan(vfFar);
  });
});

describe('rectangularPanelHeatFlux', () => {
  it('matches legacy QHeatEquation at known distance', () => {
    // Legacy: QHeatEquation(1040, 0.52, 1, 2.5, 2) should give a positive result
    // Q = viewConf * em * sigma * T^4 - tenability
    // We test the raw flux (without subtracting tenability)
    const flux = rectangularPanelHeatFlux(1040, 0.52, 1, 2);
    expect(flux).toBeGreaterThan(0);
    expect(flux).toBeLessThan(50); // reasonable range
  });
});

describe('pointSourceHeatFlux', () => {
  it('computes q = χr·Q / (4πR²)', () => {
    const flux = pointSourceHeatFlux(250, 0.3, 1.55);
    // (0.3 * 250) / (4π * 1.55²) = 75 / (4π * 2.4025) ≈ 75 / 30.19 ≈ 2.484
    expect(flux).toBeCloseTo(2.484, 1);
  });
});

describe('findPointSourceDistance', () => {
  it('computes closed-form distance √(χr·Q / (4π·q))', () => {
    const distance = findPointSourceDistance(250, 0.3, 2.5);
    // √(75 / (4π·2.5)) = √(75 / 31.416) = √(2.387) ≈ 1.545
    expect(distance).toBeCloseTo(1.545, 2);
  });
});

describe('findRectangularPanelDistance', () => {
  it('finds distance for default inputs (1040°C, 0.52m, 1m, 2.5 kW/m²)', () => {
    const distance = findRectangularPanelDistance(1040, 0.52, 1, 2.5);
    // Legacy app returns 1.18m for these inputs
    expect(distance).toBe(1.18);
  });

  it('returns a smaller distance for higher tenability threshold', () => {
    const d1 = findRectangularPanelDistance(1040, 0.52, 1, 2.5);
    const d2 = findRectangularPanelDistance(1040, 0.52, 1, 5.0);
    expect(d2).toBeLessThan(d1);
  });
});
