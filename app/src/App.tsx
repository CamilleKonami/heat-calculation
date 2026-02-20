import { useState } from 'react';
import { Container, Title } from '@mantine/core';
import type { RadiationInputs, FedInputs } from './lib/types.ts';
import { RadiantHeatSection } from './components/RadiantHeatSection.tsx';
import { FedSection } from './components/FedSection.tsx';

const defaultRadiationInputs: RadiationInputs = {
  temperature: 1040,
  width: 0.52,
  height: 1,
  tenability: 2.5,
  hrr: 250,
  chiR: 0.3,
};

const defaultFedInputs: FedInputs = {
  totalTravelDistance: 6,
  timestep: 0.5,
  walkingSpeed: 1,
};

export function App() {
  const [radiationInputs, setRadiationInputs] = useState<RadiationInputs>(defaultRadiationInputs);
  const [fedInputs, setFedInputs] = useState<FedInputs>(defaultFedInputs);

  return (
    <Container size="lg" py="xl">
      <Title order={1} mb="xl">
        Fire Safety Heat Calculator
      </Title>
      <RadiantHeatSection
        inputs={radiationInputs}
        onChange={setRadiationInputs}
      />
      <FedSection
        radiationInputs={radiationInputs}
        fedInputs={fedInputs}
        onFedInputsChange={setFedInputs}
      />
    </Container>
  );
}
