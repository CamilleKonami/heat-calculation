import { rectangularPanelHeatFlux, pointSourceHeatFlux } from './radiation.ts';
import type { FedTimestepEntry, FedResult } from './types.ts';

/**
 * Tolerance time for a given radiant heat flux.
 * t_tolrad = (1.33 / Q^1.33) * 60 seconds
 * From PD 7974-6.
 */
export function toleranceTime(heatFlux: number): number {
  return (1.33 / heatFlux ** 1.33) * 60;
}

/**
 * Compute FED summation for a series of timestep entries using a heat flux function.
 * Returns cumulative FED at each step.
 *
 * FED = Σ (1/t_tolrad) · Δt, starting from index 1 (matching legacy behavior).
 */
export function computeFed(
  entries: FedTimestepEntry[],
  timestep: number,
  heatFluxFn: (distance: number) => number,
): { total: number; cumulative: number[] } {
  let sum = 0;
  const cumulative: number[] = [0]; // step 0 contributes nothing

  for (let i = 1; i < entries.length; i++) {
    const distance = entries[i].distanceToFire!;
    const flux = heatFluxFn(distance);
    const ttol = toleranceTime(flux);
    sum += (1 / ttol) * timestep;
    cumulative.push(sum);
  }

  return { total: sum, cumulative };
}

/**
 * Compute FED for both radiation models.
 */
export function computeBothFed(
  entries: FedTimestepEntry[],
  timestep: number,
  temperatureC: number,
  width: number,
  height: number,
  hrr: number,
  chiR: number,
): FedResult {
  const rectResult = computeFed(entries, timestep, (distance) =>
    rectangularPanelHeatFlux(temperatureC, width, height, distance),
  );

  const pointResult = computeFed(entries, timestep, (distance) =>
    pointSourceHeatFlux(hrr, chiR, distance),
  );

  return {
    rectangularPanelFed: rectResult.total,
    pointSourceFed: pointResult.total,
    rectangularPanelCumulative: rectResult.cumulative,
    pointSourceCumulative: pointResult.cumulative,
    times: entries.map((e) => e.time),
  };
}
