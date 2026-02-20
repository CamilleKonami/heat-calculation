import Plot from '../lib/plotly.ts';
import type { FedTimestepEntry } from '../lib/types.ts';

interface DistanceProfileChartProps {
  entries: FedTimestepEntry[];
}

export function DistanceProfileChart({ entries }: DistanceProfileChartProps) {
  return (
    <Plot
      data={[
        {
          x: entries.map((e) => e.time),
          y: entries.map((e) => e.distanceToFire),
          type: 'scatter',
          mode: 'lines+markers',
          name: 'Distance to fire',
          line: { color: '#1c7ed6' },
          marker: { size: 4 },
        },
      ]}
      layout={{
        title: { text: 'Distance to Fire vs Time' },
        xaxis: { title: { text: 'Time (s)' } },
        yaxis: { title: { text: 'Distance to fire (m)' } },
        height: 350,
        margin: { t: 40, r: 20, b: 50, l: 60 },
      }}
      config={{ responsive: true }}
      style={{ width: '100%' }}
    />
  );
}
