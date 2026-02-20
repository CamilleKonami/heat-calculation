import Plot from '../lib/plotly.ts';
import type { HeatFluxCurvePoint } from '../lib/types.ts';

interface HeatFluxChartProps {
  data: HeatFluxCurvePoint[];
  tenability: number;
}

export function HeatFluxChart({ data, tenability }: HeatFluxChartProps) {
  const distances = data.map((p) => p.distance);
  const rectFlux = data.map((p) => p.rectangularPanelFlux);
  const pointFlux = data.map((p) => p.pointSourceFlux);

  return (
    <Plot
      data={[
        {
          x: distances,
          y: rectFlux,
          type: 'scatter',
          mode: 'lines',
          name: 'Rectangular panel',
          line: { color: '#1c7ed6' },
        },
        {
          x: distances,
          y: pointFlux,
          type: 'scatter',
          mode: 'lines',
          name: 'Point source',
          line: { color: '#37b24d' },
        },
        {
          x: [distances[0], distances[distances.length - 1]],
          y: [tenability, tenability],
          type: 'scatter',
          mode: 'lines',
          name: `Tenability (${tenability} kW/m²)`,
          line: { color: '#e03131', dash: 'dash', width: 2 },
        },
      ]}
      layout={{
        title: { text: 'Heat Flux vs Distance' },
        xaxis: { title: { text: 'Distance (m)' } },
        yaxis: { title: { text: 'Heat flux (kW/m²)' }, type: 'log' },
        height: 400,
        margin: { t: 40, r: 20, b: 50, l: 60 },
        legend: { x: 0.6, y: 0.95 },
      }}
      config={{ responsive: true }}
      style={{ width: '100%' }}
    />
  );
}
