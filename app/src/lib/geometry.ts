import type { FedInputs, FedTimestepEntry } from './types.ts';

/**
 * Compute the distance from a person on the walking path to the fire
 * at a given time, using the corridor geometry model.
 *
 * d(t) = sqrt(lateral² + (passbyOffset - walkingSpeed × t)²)
 */
export function computeDistanceToFire(
  lateralDistance: number,
  passbyOffset: number,
  walkingSpeed: number,
  time: number,
): number {
  const along = passbyOffset - walkingSpeed * time;
  return Math.sqrt(lateralDistance ** 2 + along ** 2);
}

/**
 * Generate timestep entries with auto-computed distances from corridor geometry.
 */
export function generateEntries(inputs: FedInputs): FedTimestepEntry[] {
  const { totalTravelDistance, timestep, walkingSpeed, lateralDistance, passbyOffset } = inputs;
  const totalTime = totalTravelDistance / walkingSpeed;
  const rowCount = Math.ceil(totalTime / timestep) + 1;

  const entries: FedTimestepEntry[] = [];
  for (let i = 0; i < rowCount; i++) {
    const time = Math.round(i * timestep * 10) / 10;
    entries.push({
      index: i,
      time,
      distanceToFire: Math.round(computeDistanceToFire(lateralDistance, passbyOffset, walkingSpeed, time) * 100) / 100,
    });
  }
  return entries;
}
