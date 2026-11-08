import { formatSolClock, formatSolLabel } from '../../../shared/utils';
import { useMissionStore } from '../store/missionStore';
import type { SystemKey } from '../types';

export function useMissionClock() {
  const sol = useMissionStore((state) => state.sol);
  const minute = useMissionStore((state) => state.minute);

  return {
    sol,
    minute,
    solLabel: formatSolLabel(sol),
    clock: formatSolClock(minute),
  };
}

export function useMetric(key: SystemKey): number {
  return useMissionStore((state) => state.metrics[key]);
}

export function useSystemHistory(key: SystemKey): number[] {
  return useMissionStore((state) => state.history[key]);
}

export function useMissionStatus() {
  return useMissionStore((state) => state.status);
}
