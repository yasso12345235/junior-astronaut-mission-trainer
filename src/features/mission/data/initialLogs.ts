import { formatSolClock } from '../../../shared/utils';
import type { MissionLogEntry } from '../types';

export function createInitialLogs(sol = 12): MissionLogEntry[] {
  const stamp = (clock: string) => clock;
  return [
    {
      id: 'boot-01',
      sol,
      clock: stamp('04:12'),
      severity: 'info',
      message: 'Mission clock synchronized. All five systems reporting.',
    },
    {
      id: 'boot-02',
      sol,
      clock: stamp('04:15'),
      severity: 'success',
      message: 'Hydroponic tray 2 reached 74% yield. Fresh greens for the next cycle.',
      system: 'hydroponics',
    },
    {
      id: 'boot-03',
      sol,
      clock: formatSolClock(258),
      severity: 'warning',
      message: 'Radiation shield shows micro-fractures on the west face.',
      system: 'radiation',
    },
    {
      id: 'boot-04',
      sol,
      clock: formatSolClock(262),
      severity: 'info',
      message: 'Commander on deck. Training simulation armed — expect the unexpected.',
    },
  ];
}
