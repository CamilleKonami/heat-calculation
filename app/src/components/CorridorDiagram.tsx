import Plot from '../lib/plotly.ts';

interface CorridorDiagramProps {
  lateralDistance: number;
  passbyOffset: number;
  totalTravelDistance: number;
}

export function CorridorDiagram({ lateralDistance, passbyOffset, totalTravelDistance }: CorridorDiagramProps) {
  // Walking path: horizontal line from x=0 to x=totalTravelDistance at y=0
  const pathStartX = 0;
  const pathEndX = totalTravelDistance;

  // Fire position: at x=passbyOffset, y=lateralDistance
  const fireX = passbyOffset;
  const fireY = lateralDistance;

  // Margin for the plot
  const xMax = Math.max(pathEndX, fireX) + 1;
  const yMax = fireY + 1;

  return (
    <Plot
      data={[
        // Walking path
        {
          x: [pathStartX, pathEndX],
          y: [0, 0],
          type: 'scatter',
          mode: 'lines+markers',
          name: 'Walking path',
          line: { color: '#1c7ed6', width: 3 },
          marker: { size: 8, symbol: ['circle', 'triangle-right'], color: '#1c7ed6' },
        },
        // Fire position
        {
          x: [fireX],
          y: [fireY],
          type: 'scatter',
          mode: 'text+markers',
          name: 'Fire',
          marker: { size: 16, color: '#e03131', symbol: 'star' },
          text: ['Fire'],
          textposition: 'top center',
          textfont: { color: '#e03131', size: 12 },
        },
        // Lateral distance line (dashed vertical)
        {
          x: [fireX, fireX],
          y: [0, fireY],
          type: 'scatter',
          mode: 'lines',
          name: `Lateral: ${lateralDistance}m`,
          line: { color: '#868e96', dash: 'dash', width: 2 },
        },
        // Pass-by offset annotation line
        {
          x: [0, fireX],
          y: [-yMax * 0.08, -yMax * 0.08],
          type: 'scatter',
          mode: 'lines',
          name: `Offset: ${passbyOffset}m`,
          line: { color: '#868e96', dash: 'dot', width: 1 },
          showlegend: true,
        },
      ]}
      layout={{
        title: { text: 'Corridor Geometry (top view)' },
        xaxis: {
          title: { text: 'Distance along path (m)' },
          range: [-0.5, xMax],
          zeroline: false,
        },
        yaxis: {
          title: { text: 'Lateral distance (m)' },
          range: [-yMax * 0.15, yMax],
          zeroline: false,
          scaleanchor: 'x',
        },
        height: 300,
        margin: { t: 40, r: 20, b: 50, l: 60 },
        legend: { x: 0.7, y: 0.95 },
        annotations: [
          {
            x: fireX / 2,
            y: -yMax * 0.08,
            text: `${passbyOffset}m`,
            showarrow: false,
            font: { size: 11, color: '#868e96' },
            yshift: -12,
          },
          {
            x: fireX,
            y: fireY / 2,
            text: `${lateralDistance}m`,
            showarrow: false,
            font: { size: 11, color: '#868e96' },
            xshift: 20,
          },
          {
            x: pathEndX,
            y: 0,
            text: '→',
            showarrow: false,
            font: { size: 18, color: '#1c7ed6' },
            xshift: 10,
          },
        ],
      }}
      config={{ responsive: true }}
      style={{ width: '100%' }}
    />
  );
}
