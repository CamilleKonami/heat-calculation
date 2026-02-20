export interface RadiationInputs {
  /** Fire temperature in °C */
  temperature: number;
  /** Width of fire opening (m) — also used as flame thickness for emissivity */
  width: number;
  /** Height of fire opening (m) */
  height: number;
  /** Tenability threshold (kW/m²) */
  tenability: number;
  /** Heat release rate (kW) — point source model */
  hrr: number;
  /** Radiative fraction χr — point source model */
  chiR: number;
}

export interface FedInputs {
  /** Total travel distance (m) */
  totalTravelDistance: number;
  /** Timestep duration (s) */
  timestep: number;
  /** Walking speed (m/s) */
  walkingSpeed: number;
  /** Perpendicular distance from walking path to fire (m) */
  lateralDistance: number;
  /** Distance along path from start to the point of closest approach to fire (m) */
  passbyOffset: number;
}

export interface FedTimestepEntry {
  /** Row index */
  index: number;
  /** Time at this step (s) */
  time: number;
  /** Distance to fire (m), entered by user */
  distanceToFire: number | null;
}

export interface FedResult {
  /** Total FED — rectangular panel model */
  rectangularPanelFed: number;
  /** Total FED — point source model */
  pointSourceFed: number;
  /** Cumulative FED at each timestep — rectangular panel */
  rectangularPanelCumulative: number[];
  /** Cumulative FED at each timestep — point source */
  pointSourceCumulative: number[];
  /** Time values for each step (s) */
  times: number[];
}

export interface HeatFluxCurvePoint {
  distance: number;
  rectangularPanelFlux: number;
  pointSourceFlux: number;
}
