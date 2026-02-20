import { Table, NumberInput } from '@mantine/core';
import type { FedTimestepEntry } from '../lib/types.ts';

interface FedTableProps {
  entries: FedTimestepEntry[];
  onChange: (index: number, distance: number | string) => void;
}

export function FedTable({ entries, onChange }: FedTableProps) {
  return (
    <Table striped highlightOnHover>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Points</Table.Th>
          <Table.Th>Time (s)</Table.Th>
          <Table.Th>Distance to fire (m)</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {entries.map((entry) => (
          <Table.Tr key={entry.index}>
            <Table.Td>t{entry.index}</Table.Td>
            <Table.Td>{entry.time.toFixed(1)}</Table.Td>
            <Table.Td>
              <NumberInput
                value={entry.distanceToFire ?? ''}
                onChange={(v) => onChange(entry.index, v)}
                size="xs"
                style={{ maxWidth: 120 }}
                error={entry.distanceToFire === null}
              />
            </Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  );
}
