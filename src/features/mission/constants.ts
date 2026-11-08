import { palette } from '../../shared/design/tokens';
import { average, clamp } from '../../shared/utils';
import type { MetricMap, MissionStatus, SystemDefinition, SystemHistory, SystemKey } from './types';

export const INITIAL_METRICS: MetricMap = {
  lifeSupport: 92,
  power: 78,
  radiation: 86,
  hydroponics: 74,
  crew: 88,
};

export const SYSTEM_DEFINITIONS: Record<SystemKey, SystemDefinition> = {
  lifeSupport: {
    key: 'lifeSupport',
    label: 'Life Support',
    shortLabel: 'O₂ / H₂O',
    unit: '%',
    color: palette.cyan,
    icon: 'water',
    blurb: 'Oxygen generation, water recycling and cabin pressure for the whole crew.',
    criticalAt: 25,
  },
  power: {
    key: 'power',
    label: 'Power Grid',
    shortLabel: 'BATTERY',
    unit: '%',
    color: palette.amber,
    icon: 'flash',
    blurb: 'Solar array output and battery reserve feeding every base subsystem.',
    criticalAt: 25,
  },
  radiation: {
    key: 'radiation',
    label: 'Radiation Shield',
    shortLabel: 'SHIELD',
    unit: '%',
    color: palette.plasma,
    icon: 'shield-half',
    blurb: 'Regolith shielding integrity against solar particle events.',
    criticalAt: 25,
  },
  hydroponics: {
    key: 'hydroponics',
    label: 'Hydroponics',
    shortLabel: 'FOOD',
    unit: '%',
    color: palette.green,
    icon: 'leaf',
    blurb: 'Nutrient loop and grow-light output for fresh food production.',
    criticalAt: 25,
  },
  crew: {
    key: 'crew',
    label: 'Crew Morale',
    shortLabel: 'CREW',
    unit: '%',
    color: palette.rose,
    icon: 'heart',
    blurb: 'Fatigue, sleep debt and team cohesion across the habitat.',
    criticalAt: 25,
  },
};

export interface BoostDefinition {
  label: string;
  detail: string;
  delta: number;
  powerCost: number;
  icon: string;
}

export const BOOSTS: Record<SystemKey, BoostDefinition> = {
  lifeSupport: {
    label: 'Run O₂ scrubber',
    detail: 'Flush the CO₂ loop and repressurize the cabin.',
    delta: 9,
    powerCost: 7,
    icon: 'water',
  },
  power: {
    label: 'Deploy solar wing',
    detail: 'Unfurl the auxiliary array toward the sun.',
    delta: 12,
    powerCost: 0,
    icon: 'flash',
  },
  radiation: {
    label: 'Pack regolith',
    detail: '3D-print a fresh layer over the storm shelter.',
    delta: 8,
    powerCost: 4,
    icon: 'shield-half',
  },
  hydroponics: {
    label: 'Feed nutrient loop',
    detail: 'Dose the reservoir and recalibrate grow lights.',
    delta: 10,
    powerCost: 5,
    icon: 'leaf',
  },
  crew: {
    label: 'Schedule shore leave',
    detail: 'Rotate the crew through a low-gravity rest cycle.',
    delta: 9,
    powerCost: 2,
    icon: 'heart',
  },
};

export function computeScore(metrics: MetricMap): number {
  return Math.round(average(Object.values(metrics)));
}

export function deriveStatus(metrics: MetricMap): MissionStatus {
  const lowest = Math.min(...Object.values(metrics));
  if (lowest <= 0.5) return 'failed';
  if (lowest < 30) return 'critical';
  if (lowest < 55) return 'caution';
  return 'nominal';
}

export function mapSystems(metrics: MetricMap, effects: Partial<MetricMap>): MetricMap {
  const next = { ...metrics };
  (Object.keys(effects) as SystemKey[]).forEach((key) => {
    next[key] = clamp(next[key] + (effects[key] ?? 0));
  });
  return next;
}

const SEED_OFFSETS = [6, 4, 7, 3, 5, 2, 4, 1, 3, 0];

export function createSeedHistory(): SystemHistory {
  return (Object.keys(INITIAL_METRICS) as SystemKey[]).reduce<SystemHistory>((acc, key) => {
    acc[key] = SEED_OFFSETS.map((offset) => clamp(INITIAL_METRICS[key] - offset));
    return acc;
  }, {} as SystemHistory);
}
