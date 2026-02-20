# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A fire safety engineering calculator that determines safe distances between kitchen hobs and internal escape routes in flats. It computes radiant heat exposure and Fractional Effective Dose (FED) along evacuation paths, based on standards PD 7974-6, BR 187, BS EN 1991-1-2, and the SFPE Handbook (5th Edition).

## Architecture

### React app (`app/`)

React 18 + TypeScript + Vite + Mantine v8 + Plotly.js application.

**Key directories:**
- `app/src/lib/` — Pure physics functions (radiation.ts, fed.ts) with shared types and constants
- `app/src/components/` — React components for each section
- `app/src/lib/plotly.ts` — Plotly wrapper using the basic bundle for smaller size

**Physics modules** (`app/src/lib/`):
- `radiation.ts` — viewFactor, emissivity, rectangularPanelHeatFlux, pointSourceHeatFlux, findDistance functions
- `fed.ts` — toleranceTime, computeFed (generic with heat flux callback), computeBothFed
- `constants.ts` — Stefan-Boltzmann constant, absorption coefficient
- `types.ts` — Shared TypeScript interfaces

**Components** (`app/src/components/`):
- `RadiantHeatSection.tsx` — Section 1: radiant heat distance calculation with inputs and results
- `FedSection.tsx` — Section 2: FED calculation with dynamic table generation
- `FedTable.tsx` — Editable timestep table for distance-to-fire inputs
- `HeatFluxChart.tsx` — Plotly chart: heat flux vs distance (both models + tenability line)
- `FedChart.tsx` — Plotly chart: cumulative FED vs time (both models + threshold lines)

### Legacy (`index.html`)

Single-file vanilla HTML/CSS/JavaScript application kept as reference. Open directly in a browser.

### Key physics formulas implemented:

- Radiant heat flux: Q = Φ · ε · σ · T⁴
- View factor: SFPE rectangular panel-to-point formula (parallel plane)
- Emissivity: ε = 1 - e^(-0.3d)
- Tolerance time: t_tolrad = 1.33 / Q^1.33 (converted to seconds)
- FED: Σ (1/t_tolrad) · dt

## Development

```bash
cd app
npm install          # Install dependencies
npm run dev          # Start dev server
npm run build        # Production build (tsc + vite build)
npx vitest           # Run unit tests (watch mode)
npx vitest run       # Run unit tests (single run)
```

## Conventions

- Commit messages are written in French
- Units are metric (kW/m², meters, seconds, Kelvin)
