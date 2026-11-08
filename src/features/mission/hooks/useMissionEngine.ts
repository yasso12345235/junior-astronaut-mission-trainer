import { useEffect } from 'react';
import { AppState } from 'react-native';

import { useMissionStore } from '../store/missionStore';

/**
 * Owns all timers for the simulation. Mounted once at the Main navigator level
 * so navigation between screens never duplicates intervals.
 */
export function useMissionEngine(): void {
  useEffect(() => {
    const id = setInterval(() => {
      if (AppState.currentState !== 'active') return;
      useMissionStore.getState().tick();
    }, 3000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      const state = useMissionStore.getState();
      if (state.status === 'failed' || state.activeEmergency) return;
      if (Math.random() < 0.24) state.triggerEmergency();
    }, 42000);
    return () => clearInterval(id);
  }, []);

  // First drill arrives shortly after the commander reaches the dashboard.
  useEffect(() => {
    const id = setTimeout(() => {
      const state = useMissionStore.getState();
      if (!state.activeEmergency && state.status !== 'failed') state.triggerEmergency();
    }, 16000);
    return () => clearTimeout(id);
  }, []);
}
