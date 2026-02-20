import { useState, useCallback } from 'react';
import { Stack, Group, NumberInput, Button, Title, Text, Switch } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import type { RadiationInputs, FedInputs, FedTimestepEntry, FedResult } from '../lib/types.ts';
import { computeBothFed } from '../lib/fed.ts';
import { generateEntries } from '../lib/geometry.ts';
import { FedTable } from './FedTable.tsx';
import { FedChart } from './FedChart.tsx';
import { CorridorDiagram } from './CorridorDiagram.tsx';
import { DistanceProfileChart } from './DistanceProfileChart.tsx';

interface FedSectionProps {
  radiationInputs: RadiationInputs;
  fedInputs: FedInputs;
  onFedInputsChange: (inputs: FedInputs) => void;
}

export function FedSection({ radiationInputs, fedInputs, onFedInputsChange }: FedSectionProps) {
  const [entries, setEntries] = useState<FedTimestepEntry[]>([]);
  const [fedResult, setFedResult] = useState<FedResult | null>(null);
  const [advancedMode, setAdvancedMode] = useState(false);
  const [manuallyEdited, setManuallyEdited] = useState(false);

  function updateInput(field: keyof FedInputs, value: string | number) {
    onFedInputsChange({ ...fedInputs, [field]: Number(value) });
  }

  function calculateFed() {
    const generated = generateEntries(fedInputs);
    setEntries(generated);
    setManuallyEdited(false);

    const result = computeBothFed(
      generated,
      fedInputs.timestep,
      radiationInputs.temperature,
      radiationInputs.width,
      radiationInputs.height,
      radiationInputs.hrr,
      radiationInputs.chiR,
    );
    setFedResult(result);
  }

  function recalculate() {
    const hasEmpty = entries.some((e) => e.distanceToFire === null);
    if (hasEmpty) {
      notifications.show({
        title: 'Missing inputs',
        message: 'Please fill all distance-to-fire inputs',
        color: 'red',
      });
      return;
    }

    const result = computeBothFed(
      entries,
      fedInputs.timestep,
      radiationInputs.temperature,
      radiationInputs.width,
      radiationInputs.height,
      radiationInputs.hrr,
      radiationInputs.chiR,
    );
    setFedResult(result);
    setManuallyEdited(false);
  }

  const handleDistanceChange = useCallback((index: number, value: number | string) => {
    setEntries((prev) =>
      prev.map((e) =>
        e.index === index
          ? { ...e, distanceToFire: typeof value === 'number' ? value : null }
          : e,
      ),
    );
    setManuallyEdited(true);
  }, []);

  return (
    <Stack>
      <Title order={2}>FED Calculation</Title>

      <CorridorDiagram
        lateralDistance={fedInputs.lateralDistance}
        passbyOffset={fedInputs.passbyOffset}
        totalTravelDistance={fedInputs.totalTravelDistance}
      />

      <Group>
        <NumberInput
          label="Lateral distance (m)"
          description="Perpendicular distance from path to fire"
          value={fedInputs.lateralDistance}
          onChange={(v) => updateInput('lateralDistance', v)}
          decimalScale={2}
          step={0.1}
          min={0.1}
        />
        <NumberInput
          label="Pass-by offset (m)"
          description="Distance along path to closest approach"
          value={fedInputs.passbyOffset}
          onChange={(v) => updateInput('passbyOffset', v)}
          decimalScale={2}
          step={0.5}
          min={0}
        />
      </Group>
      <Group>
        <NumberInput
          label="Total travel distance (m)"
          value={fedInputs.totalTravelDistance}
          onChange={(v) => updateInput('totalTravelDistance', v)}
        />
        <NumberInput
          label="Timestep (s)"
          value={fedInputs.timestep}
          onChange={(v) => updateInput('timestep', v)}
          decimalScale={1}
          step={0.1}
        />
        <NumberInput
          label="Walking speed (m/s)"
          value={fedInputs.walkingSpeed}
          onChange={(v) => updateInput('walkingSpeed', v)}
          decimalScale={1}
          step={0.1}
        />
      </Group>

      <Button onClick={calculateFed} w="fit-content">
        Calculate FED
      </Button>

      {entries.length > 0 && fedResult && (
        <>
          <DistanceProfileChart entries={entries} />

          <Group>
            <NumberInput
              label={<Text fw={500}>Rectangular panel FED</Text>}
              value={Math.round(fedResult.rectangularPanelFed * 1000) / 1000}
              readOnly
              variant="filled"
            />
            <NumberInput
              label={<Text fw={500}>Point source FED</Text>}
              value={Math.round(fedResult.pointSourceFed * 1000) / 1000}
              readOnly
              variant="filled"
            />
          </Group>

          <FedChart result={fedResult} />

          <Switch
            label="Advanced: edit distances manually"
            checked={advancedMode}
            onChange={(event) => setAdvancedMode(event.currentTarget.checked)}
          />

          {advancedMode && (
            <>
              <FedTable entries={entries} onChange={handleDistanceChange} />
              {manuallyEdited && (
                <Button onClick={recalculate} variant="outline" w="fit-content">
                  Recalculate
                </Button>
              )}
            </>
          )}
        </>
      )}
    </Stack>
  );
}
