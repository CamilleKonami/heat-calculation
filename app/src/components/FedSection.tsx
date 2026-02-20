import { useState, useCallback } from 'react';
import { Stack, Group, NumberInput, Button, Title, Text } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import type { RadiationInputs, FedInputs, FedTimestepEntry, FedResult } from '../lib/types.ts';
import { computeBothFed } from '../lib/fed.ts';
import { FedTable } from './FedTable.tsx';
import { FedChart } from './FedChart.tsx';

interface FedSectionProps {
  radiationInputs: RadiationInputs;
  fedInputs: FedInputs;
  onFedInputsChange: (inputs: FedInputs) => void;
}

export function FedSection({ radiationInputs, fedInputs, onFedInputsChange }: FedSectionProps) {
  const [entries, setEntries] = useState<FedTimestepEntry[]>([]);
  const [fedResult, setFedResult] = useState<FedResult | null>(null);

  function updateInput(field: keyof FedInputs, value: string | number) {
    onFedInputsChange({ ...fedInputs, [field]: Number(value) });
  }

  function createTable() {
    const { totalTravelDistance, timestep, walkingSpeed } = fedInputs;
    const timeslot = totalTravelDistance / walkingSpeed;
    const rowCount = Math.ceil(timeslot / timestep) + 1;

    const newEntries: FedTimestepEntry[] = [];
    for (let i = 0; i < rowCount; i++) {
      newEntries.push({
        index: i,
        time: Math.round(i * timestep * 10) / 10,
        distanceToFire: null,
      });
    }
    setEntries(newEntries);
    setFedResult(null);
  }

  const handleDistanceChange = useCallback((index: number, value: number | string) => {
    setEntries((prev) =>
      prev.map((e) =>
        e.index === index
          ? { ...e, distanceToFire: typeof value === 'number' ? value : null }
          : e,
      ),
    );
  }, []);

  function calculateFed() {
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
  }

  return (
    <Stack>
      <Title order={2}>FED Calculation</Title>
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
      <Button onClick={createTable} variant="outline" w="fit-content">
        Create input table
      </Button>

      {entries.length > 0 && (
        <>
          <FedTable entries={entries} onChange={handleDistanceChange} />
          <Button onClick={calculateFed} w="fit-content">
            Calculate FED
          </Button>
        </>
      )}

      {fedResult && (
        <>
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
        </>
      )}
    </Stack>
  );
}
