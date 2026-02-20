import Plot from '../lib/plotly.ts';
import type { FedResult } from '../lib/types.ts';

interface FedChartProps {
  result: FedResult;
}

export function FedChart({ result }: FedChartProps) {
  return (
    <Plot
      data={[
        {
          x: result.times,
          y: result.rectangularPanelCumulative,
          type: 'scatter',
          mode: 'lines',
          name: 'Rectangular panel',
          line: { color: '#1c7ed6' },
        },
        {
          x: result.times,
          y: result.pointSourceCumulative,
          type: 'scatter',
          mode: 'lines',
          name: 'Point source',
          line: { color: '#37b24d' },
        },
        {
          x: [result.times[0], result.times[result.times.length - 1]],
          y: [1, 1],
          type: 'scatter',
          mode: 'lines',
          name: 'FED = 1',
          line: { color: '#e03131', dash: 'dash', width: 2 },
        },
        {
          x: [result.times[0], result.times[result.times.length - 1]],
          y: [0.5, 0.5],
          type: 'scatter',
          mode: 'lines',
          name: 'FED = 0.5',
          line: { color: '#f08c00', dash: 'dash', width: 2 },
        },
      ]}
      layout={{
        title: { text: 'Cumulative FED vs Time' },
        xaxis: { title: { text: 'Time (s)' } },
        yaxis: { title: { text: 'Cumulative FED' } },
        height: 400,
        margin: { t: 40, r: 20, b: 50, l: 60 },
        legend: { x: 0.02, y: 0.95 },
      }}
      config={{ responsive: true }}
      style={{ width: '100%' }}
    />
  );
}
