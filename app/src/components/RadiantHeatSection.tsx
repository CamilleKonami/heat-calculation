import { useState } from 'react';
import { Stack, Group, NumberInput, Button, Title, Image, Text } from '@mantine/core';
import type { RadiationInputs, HeatFluxCurvePoint } from '../lib/types.ts';
import {
  findRectangularPanelDistance,
  findPointSourceDistance,
  generateHeatFluxCurve,
} from '../lib/radiation.ts';
import { HeatFluxChart } from './HeatFluxChart.tsx';

interface RadiantHeatSectionProps {
  inputs: RadiationInputs;
  onChange: (inputs: RadiationInputs) => void;
}

export function RadiantHeatSection({ inputs, onChange }: RadiantHeatSectionProps) {
  const [rectDistance, setRectDistance] = useState<number | null>(null);
  const [pointDistance, setPointDistance] = useState<number | null>(null);
  const [chartData, setChartData] = useState<HeatFluxCurvePoint[]>([]);

  function update(field: keyof RadiationInputs, value: string | number) {
    onChange({ ...inputs, [field]: Number(value) });
  }

  function calculate() {
    const rd = findRectangularPanelDistance(
      inputs.temperature,
      inputs.width,
      inputs.height,
      inputs.tenability,
    );
    setRectDistance(rd);

    const pd = findPointSourceDistance(inputs.hrr, inputs.chiR, inputs.tenability);
    setPointDistance(Math.round(pd * 100) / 100);

    const maxDist = Math.max(rd, pd) * 2.5;
    const curve = generateHeatFluxCurve(
      inputs.temperature,
      inputs.width,
      inputs.height,
      inputs.hrr,
      inputs.chiR,
      maxDist,
    );
    setChartData(curve);
  }

  return (
    <Stack mb="xl">
      <Title order={2}>Exposure to radiant heat at a specific distance</Title>
      <Group align="flex-start" gap="xl">
        <Stack style={{ flex: 1 }}>
          <NumberInput
            label="Temperature of source (°C)"
            value={inputs.temperature}
            onChange={(v) => update('temperature', v)}
          />
          <NumberInput
            label={<>Width of fire <Text span c="red" inherit>a</Text> (m)</>}
            value={inputs.width}
            onChange={(v) => update('width', v)}
            decimalScale={2}
            step={0.01}
          />
          <NumberInput
            label={<>Height of fire <Text span c="red" inherit>b</Text> (m)</>}
            value={inputs.height}
            onChange={(v) => update('height', v)}
            decimalScale={2}
            step={0.01}
          />
          <NumberInput
            label="Tenability criteria (kW/m²)"
            value={inputs.tenability}
            onChange={(v) => update('tenability', v)}
            decimalScale={1}
            step={0.1}
          />
          <NumberInput
            label={<>Heat release rate (kW) <Text span fs="italic" c="dimmed" inherit>— point source</Text></>}
            value={inputs.hrr}
            onChange={(v) => update('hrr', v)}
          />
          <NumberInput
            label={<>Radiative fraction χ<sub>r</sub> <Text span fs="italic" c="dimmed" inherit>— point source</Text></>}
            value={inputs.chiR}
            onChange={(v) => update('chiR', v)}
            decimalScale={2}
            step={0.05}
          />
          <Button onClick={calculate}>Launch calculation</Button>
          <NumberInput
            label={<>Rectangular panel: distance <Text span c="red" inherit>c</Text> (m)</>}
            value={rectDistance ?? ''}
            readOnly
            variant="filled"
          />
          <NumberInput
            label={<>Point source: distance <Text span c="red" inherit>c</Text> (m)</>}
            value={pointDistance ?? ''}
            readOnly
            variant="filled"
          />
        </Stack>
        <Image
          src="/radiating-panel.jpg"
          alt="Radiating panel diagram"
          w={300}
          h={300}
          fit="contain"
        />
      </Group>
      {chartData.length > 0 && (
        <HeatFluxChart data={chartData} tenability={inputs.tenability} />
      )}
    </Stack>
  );
}
