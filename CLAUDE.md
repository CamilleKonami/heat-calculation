# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A fire safety engineering calculator that determines safe distances between kitchen hobs and internal escape routes in flats. It computes radiant heat exposure and Fractional Effective Dose (FED) along evacuation paths, based on standards PD 7974-6, BR 187, BS EN 1991-1-2, and the SFPE Handbook (5th Edition).

## Architecture

Single-file vanilla HTML/CSS/JavaScript application (`index.html`, ~265 lines). No build system, no dependencies, no frameworks. Open the file directly in a browser to use.

### Two calculation sections:

1. **Radiant heat distance** (lines 21-55, JS function `QHeatEquation`): Given fire temperature, dimensions, and a tenability threshold, finds the distance where radiant heat drops below the threshold. Uses linear search from 0-100m in 0.01m increments.

2. **FED along escape route** (lines 56-158, JS functions `getTtolrad` + FED summation): User specifies travel distance, timestep, and walking speed to generate a table. Each row takes a distance-to-fire input. Calculates cumulative FED over the evacuation path.

### Key physics formulas implemented:

- Radiant heat flux: Q = Φ · ε · σ · T⁴
- View factor: SFPE rectangular panel-to-point formula (parallel plane)
- Emissivity: ε = 1 - e^(-0.3d)
- Tolerance time: t_tolrad = 1.33 / Q^1.33 (converted to seconds)
- FED: Σ (1/t_tolrad) · dt

### Shared calculation logic

`QHeatEquation` and `getTtolrad` both compute view factor, emissivity, and radiant heat flux with duplicated code. Both share inputs from Section 1 (temperature, width, height).

## Development

No build or test commands. To work on this project, edit `index.html` and open it in a browser. All CSS is in `<style>` tags and all JS is in a `<script>` block at the end of the file.

## Conventions

- Commit messages are written in French
- Units are metric (kW/m², meters, seconds, Kelvin)
