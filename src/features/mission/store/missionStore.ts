import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { clamp, createId, formatSolClock, formatSolLabel, pickRandom } from '../../../shared/utils';
import {
  BOOSTS,
  INITIAL_METRICS,
  SYSTEM_DEFINITIONS,
  computeScore,
  createSeedHistory,
  deriveStatus,
  mapSystems,
} from '../constants';
import { SYSTEM_KEYS } from '../types';
import { EMERGENCIES } from '../data/emergencies';
import { createInitialLogs } from '../data/initialLogs';
import type {
  EmergencyEvent,
  EmergencyResolution,
  LogSeverity,
  MetricMap,
  MissionLogEntry,
  MissionStatus,
  SystemHistory,
  SystemKey,
} from '../types';

const MAX_LOGS = 80;
const MAX_HISTORY = 48;

interface MissionState {
  hasOnboarded: boolean;
  commander: string;
  baseName: string;
  sol: number;
  minute: number;
  metrics: MetricMap;
  history: SystemHistory;
  logs: MissionLogEntry[];
  status: MissionStatus;
  activeEmergency: EmergencyEvent | null;
  lastResolution: EmergencyResolution | null;
  drillsCompleted: number;
  bestScore: number;

  completeOnboarding: () => void;
  tick: () => void;
  triggerEmergency: (event?: EmergencyEvent) => void;
  resolveEmergency: (choiceId: string, timedOut?: boolean) => void;
  dismissResolution: () => void;
  applyBoost: (system: SystemKey) => boolean;
  resetMission: () => void;
}

type PersistedMission = Pick<
  MissionState,
  | 'hasOnboarded'
  | 'sol'
  | 'minute'
  | 'metrics'
  | 'history'
  | 'logs'
  | 'bestScore'
  | 'drillsCompleted'
>;

const INITIAL_LOGS = createInitialLogs();

function makeLog(
  sol: number,
  minute: number,
  message: string,
  severity: LogSeverity,
  system?: SystemKey,
): MissionLogEntry {
  return {
    id: createId('log'),
    sol,
    clock: formatSolClock(minute),
    message,
    severity,
    system,
  };
}

function trimLogs(logs: MissionLogEntry[]): MissionLogEntry[] {
  return logs.slice(0, MAX_LOGS);
}

function pushHistory(history: SystemHistory, metrics: MetricMap): SystemHistory {
  const next = { ...history };
  SYSTEM_KEYS.forEach((key) => {
    next[key] = [...history[key], Math.round(metrics[key])].slice(-MAX_HISTORY);
  });
  return next;
}

const createInitialState = () => ({
  hasOnboarded: false,
  commander: 'CDR. NOVA',
  baseName: 'ARTEMIS BASE',
  sol: 12,
  minute: 262,
  metrics: { ...INITIAL_METRICS },
  history: createSeedHistory(),
  logs: INITIAL_LOGS,
  status: 'nominal' as MissionStatus,
  activeEmergency: null,
  lastResolution: null,
  drillsCompleted: 0,
  bestScore: 0,
});

export const useMissionStore = create<MissionState>()(
  persist<MissionState, [], [], PersistedMission>(
    (set, get) => ({
      ...createInitialState(),

      completeOnboarding: () => {
        set((state) => ({
          hasOnboarded: true,
          logs: trimLogs([
            makeLog(
              state.sol,
              state.minute,
              'Commander certified. Live mission simulation starting now.',
              'success',
            ),
            ...state.logs,
          ]),
        }));
      },

      tick: () => {
        const state = get();
        if (state.activeEmergency || state.status === 'failed') return;

        const rawMinute = state.minute + 1;
        const sol = rawMinute >= 1440 ? state.sol + 1 : state.sol;
        const minute = rawMinute % 1440;
        const powerStrain = state.metrics.power < 22 ? 0.16 : 0;
        const foodStress = state.metrics.hydroponics < 40 ? 0.1 : 0.02;

        const metrics: MetricMap = {
          lifeSupport: clamp(state.metrics.lifeSupport - 0.09 - powerStrain),
          power: clamp(state.metrics.power - 0.06),
          radiation: clamp(state.metrics.radiation - 0.03),
          hydroponics: clamp(
            state.metrics.hydroponics + (state.metrics.power > 18 ? 0.03 : -0.08),
          ),
          crew: clamp(state.metrics.crew - 0.04 - foodStress),
        };

        const status = deriveStatus(metrics);
        const alerts: MissionLogEntry[] = [];

        SYSTEM_KEYS.forEach((key) => {
          const wasHealthy = state.metrics[key] >= 30;
          const isCritical = metrics[key] < 30;
          if (wasHealthy && isCritical) {
            alerts.push(
              makeLog(
                sol,
                minute,
                `${SYSTEM_DEFINITIONS[key].label} dropped below critical threshold.`,
                'warning',
                key,
              ),
            );
          }
        });

        if (status === 'failed') {
          alerts.unshift(
            makeLog(
              sol,
              minute,
              'Base integrity lost. Simulation terminated — review the timeline and try again.',
              'critical',
            ),
          );
        } else if (minute === 0) {
          alerts.push(
            makeLog(sol, minute, `${formatSolLabel(sol)} begins. New shift, new unknowns.`, 'info'),
          );
        }

        set({
          sol,
          minute,
          metrics,
          status,
          history: pushHistory(state.history, metrics),
          logs: alerts.length > 0 ? trimLogs([...alerts, ...state.logs]) : state.logs,
        });
      },

      triggerEmergency: (event) => {
        const state = get();
        const lastId = state.activeEmergency?.id;
        if (state.activeEmergency || state.status === 'failed') return;

        const nextEvent =
          event ?? pickRandom(EMERGENCIES, EMERGENCIES.find((item) => item.id === lastId));

        set({
          activeEmergency: nextEvent,
          logs: trimLogs([
            makeLog(
              state.sol,
              state.minute,
              `${nextEvent.code} — ${nextEvent.title}. Awaiting commander decision.`,
              nextEvent.severity,
              nextEvent.system,
            ),
            ...state.logs,
          ]),
        });
      },

      resolveEmergency: (choiceId, timedOut = false) => {
        const state = get();
        const event = state.activeEmergency;
        if (!event) return;

        const choice =
          event.choices.find((item) => item.id === choiceId) ??
          event.choices[event.choices.length - 1];

        const metrics = mapSystems(state.metrics, choice.effects);
        const status = deriveStatus(metrics);
        const success = choice.success && status !== 'failed';
        const score = computeScore(metrics);

        set({
          activeEmergency: null,
          lastResolution: { event, choice, success, score, timedOut },
          metrics,
          status,
          history: pushHistory(state.history, metrics),
          drillsCompleted: state.drillsCompleted + 1,
          bestScore: Math.max(state.bestScore, score),
          logs: trimLogs([
            makeLog(
              state.sol,
              state.minute,
              `${event.code} ${timedOut ? 'auto-resolved (window expired)' : 'resolved'}: ${choice.label}. ${choice.summary}`,
              success ? 'success' : 'critical',
              event.system,
            ),
            ...state.logs,
          ]),
        });
      },

      dismissResolution: () => set({ lastResolution: null }),

      applyBoost: (system) => {
        const state = get();
        if (state.status === 'failed') return false;

        const boost = BOOSTS[system];
        if (system !== 'power' && state.metrics.power < boost.powerCost) return false;

        const metrics: MetricMap = {
          ...state.metrics,
          [system]: clamp(state.metrics[system] + boost.delta),
        };

        if (boost.powerCost > 0) {
          metrics.power = clamp(metrics.power - boost.powerCost);
        }

        set({
          metrics,
          status: deriveStatus(metrics),
          history: pushHistory(state.history, metrics),
          logs: trimLogs([
            makeLog(
              state.sol,
              state.minute,
              `${boost.label} complete. ${SYSTEM_DEFINITIONS[system].label} is now ${Math.round(metrics[system])}%.`,
              'success',
              system,
            ),
            ...state.logs,
          ]),
        });
        return true;
      },

      resetMission: () => {
        const state = get();
        set({
          ...createInitialState(),
          hasOnboarded: state.hasOnboarded,
          bestScore: state.bestScore,
          logs: createInitialLogs(state.sol),
        });
      },
    }),
    {
      name: 'jamt-mission-v1',
      version: 1,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        hasOnboarded: state.hasOnboarded,
        sol: state.sol,
        minute: state.minute,
        metrics: state.metrics,
        history: state.history,
        logs: state.logs,
        bestScore: state.bestScore,
        drillsCompleted: state.drillsCompleted,
      }),
    },
  ),
);

export const selectScore = (state: MissionState): number => computeScore(state.metrics);
export const selectIsCritical = (state: MissionState): boolean =>
  state.status === 'critical' || state.status === 'failed';

export type { MissionState, PersistedMission };
