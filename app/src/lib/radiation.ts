import { STEFAN_BOLTZMANN, ABSORPTION_COEFFICIENT } from './constants.ts';
import type { HeatFluxCurvePoint } from './types.ts';

/**
 * SFPE centre-of-rectangle view factor for a parallel plane.
 * See SFPE Handbook 5th Edition.
 */
export function viewFactor(width: number, height: number, distance: number): number {
  const X = width / (2 * distance);
  const Y = height / (2 * distance);
  return (
    (2 / Math.PI) *
    (
      (X / Math.sqrt(1 + X ** 2)) * Math.atan(Y / Math.sqrt(1 + X ** 2)) +
      (Y / Math.sqrt(1 + Y ** 2)) * Math.atan(X / Math.sqrt(1 + Y ** 2))
    )
  );
}

/**
 * Flame emissivity — BS EN 1991-1-2 / BR 187.
 * ε = 1 - e^(-κ·d) where κ = 0.3 m⁻¹ and d = flame thickness.
 */
export function emissivity(flameThickness: number): number {
  return 1 - Math.exp(-ABSORPTION_COEFFICIENT * flameThickness);
}

/**
 * Radiant heat flux from a rectangular panel at a given distance.
 * Q = Φ · ε · σ · T⁴  (kW/m²)
 */
export function rectangularPanelHeatFlux(
  temperatureC: number,
  width: number,
  height: number,
  distance: number,
): number {
  const phi = viewFactor(width, height, distance);
  const em = emissivity(width);
  const tempK = temperatureC + 273;
  return phi * em * STEFAN_BOLTZMANN * tempK ** 4;
}

/**
 * Radiant heat flux from a point source.
 * q = (χr · Q) / (4πR²)  (kW/m²)
 */
export function pointSourceHeatFlux(hrr: number, chiR: number, distance: number): number {
  return (chiR * hrr) / (4 * Math.PI * distance ** 2);
}

/**
 * Find distance where rectangular panel heat flux drops below tenability.
 * Binary search on [0.01, 100] — heat flux is monotonically decreasing with distance.
 * Returns the last distance (rounded to 0.01m) where flux >= tenability.
 */
export function findRectangularPanelDistance(
  temperatureC: number,
  width: number,
  height: number,
  tenability: number,
): number {
  // If flux is already below tenability at the minimum distance, return 0
  if (rectangularPanelHeatFlux(temperatureC, width, height, 0.01) < tenability) {
    return 0;
  }

  let lo = 0.01;
  let hi = 100;

  // Binary search: find the boundary where flux crosses below tenability
  while (hi - lo > 0.001) {
    const mid = (lo + hi) / 2;
    const flux = rectangularPanelHeatFlux(temperatureC, width, height, mid);
    if (flux >= tenability) {
      lo = mid;
    } else {
      hi = mid;
    }
  }

  // Round down to nearest 0.01m (last distance where flux >= tenability)
  return Math.floor(lo * 100) / 100;
}

/**
 * Find distance where point source heat flux equals tenability.
 * Closed-form: R = √(χr·Q / (4π·q))
 */
export function findPointSourceDistance(hrr: number, chiR: number, tenability: number): number {
  return Math.sqrt((chiR * hrr) / (4 * Math.PI * tenability));
}

/**
 * Generate heat flux vs distance curves for both models.
 */
export function generateHeatFluxCurve(
  temperatureC: number,
  width: number,
  height: number,
  hrr: number,
  chiR: number,
  maxDistance: number,
  step: number = 0.1,
): HeatFluxCurvePoint[] {
  const points: HeatFluxCurvePoint[] = [];
  for (let d = step; d <= maxDistance; d += step) {
    points.push({
      distance: Math.round(d * 100) / 100,
      rectangularPanelFlux: rectangularPanelHeatFlux(temperatureC, width, height, d),
      pointSourceFlux: pointSourceHeatFlux(hrr, chiR, d),
    });
  }
  return points;
}
