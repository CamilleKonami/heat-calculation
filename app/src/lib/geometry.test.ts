import { describe, it, expect } from 'vitest';
import { computeDistanceToFire, generateEntries } from './geometry.ts';

describe('computeDistanceToFire', () => {
  it('returns lateral distance at the point of closest approach', () => {
    // At time = passbyOffset / walkingSpeed, the along-path component is 0
    const lateral = 1.5;
    const passbyOffset = 3;
    const walkingSpeed = 1;
    const time = passbyOffset / walkingSpeed; // t = 3s
    expect(computeDistanceToFire(lateral, passbyOffset, walkingSpeed, time)).toBeCloseTo(lateral, 10);
  });

  it('satisfies Pythagorean identity (3-4-5 triangle)', () => {
    // lateral = 3, along = 4 → distance = 5
    // along = passbyOffset - speed * t = 4  →  with offset=4, speed=1, t=0: along=4
    expect(computeDistanceToFire(3, 4, 1, 0)).toBeCloseTo(5, 10);
  });

  it('is symmetric around the closest approach point', () => {
    const lateral = 2;
    const passbyOffset = 5;
    const speed = 1;
    const tClosest = passbyOffset / speed;
    const dt = 2;
    const dBefore = computeDistanceToFire(lateral, passbyOffset, speed, tClosest - dt);
    const dAfter = computeDistanceToFire(lateral, passbyOffset, speed, tClosest + dt);
    expect(dBefore).toBeCloseTo(dAfter, 10);
  });

  it('returns distance at t=0 correctly', () => {
    // d(0) = sqrt(1.5² + 3²) = sqrt(2.25 + 9) = sqrt(11.25)
    expect(computeDistanceToFire(1.5, 3, 1, 0)).toBeCloseTo(Math.sqrt(11.25), 10);
  });
});

describe('generateEntries', () => {
  it('generates correct number of entries', () => {
    const entries = generateEntries({
      totalTravelDistance: 6,
      timestep: 0.5,
      walkingSpeed: 1,
      lateralDistance: 1.5,
      passbyOffset: 3,
    });
    // totalTime = 6/1 = 6s, rows = ceil(6/0.5) + 1 = 13
    expect(entries).toHaveLength(13);
  });

  it('first entry is at time 0', () => {
    const entries = generateEntries({
      totalTravelDistance: 6,
      timestep: 0.5,
      walkingSpeed: 1,
      lateralDistance: 1.5,
      passbyOffset: 3,
    });
    expect(entries[0].time).toBe(0);
    expect(entries[0].index).toBe(0);
  });

  it('all distances are non-null numbers', () => {
    const entries = generateEntries({
      totalTravelDistance: 6,
      timestep: 0.5,
      walkingSpeed: 1,
      lateralDistance: 1.5,
      passbyOffset: 3,
    });
    for (const entry of entries) {
      expect(entry.distanceToFire).not.toBeNull();
      expect(entry.distanceToFire).toBeGreaterThan(0);
    }
  });

  it('minimum distance equals lateral distance (at closest approach)', () => {
    const entries = generateEntries({
      totalTravelDistance: 6,
      timestep: 0.5,
      walkingSpeed: 1,
      lateralDistance: 1.5,
      passbyOffset: 3,
    });
    const minDistance = Math.min(...entries.map((e) => e.distanceToFire!));
    expect(minDistance).toBe(1.5);
  });

  it('distances are computed correctly for each timestep', () => {
    const inputs = {
      totalTravelDistance: 2,
      timestep: 1,
      walkingSpeed: 1,
      lateralDistance: 3,
      passbyOffset: 4,
    };
    const entries = generateEntries(inputs);
    // t=0: sqrt(9 + 16) = 5
    // t=1: sqrt(9 + 9) = sqrt(18) ≈ 4.24
    // t=2: sqrt(9 + 4) = sqrt(13) ≈ 3.61
    expect(entries[0].distanceToFire).toBeCloseTo(5, 2);
    expect(entries[1].distanceToFire).toBeCloseTo(Math.sqrt(18), 2);
    expect(entries[2].distanceToFire).toBeCloseTo(Math.sqrt(13), 2);
  });
});
