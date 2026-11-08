export const SYSTEM_KEYS = ['lifeSupport', 'power', 'radiation', 'hydroponics', 'crew'] as const;

export type SystemKey = (typeof SYSTEM_KEYS)[number];

export type MetricMap = Record<SystemKey, number>;

export type MissionStatus = 'nominal' | 'caution' | 'critical' | 'failed';

export type LogSeverity = 'info' | 'success' | 'warning' | 'critical';

export type EmergencyTone = 'safe' | 'balanced' | 'risky';

export interface MissionLogEntry {
  id: string;
  sol: number;
  clock: string;
  message: string;
  severity: LogSeverity;
  system?: SystemKey;
}

export interface EmergencyChoice {
  id: string;
  label: string;
  detail: string;
  effects: Partial<MetricMap>;
  tone: EmergencyTone;
  success: boolean;
  summary: string;
}

export interface EmergencyEvent {
  id: string;
  code: string;
  title: string;
  description: string;
  system: SystemKey;
  severity: Extract<LogSeverity, 'warning' | 'critical'>;
  windowSeconds: number;
  choices: readonly EmergencyChoice[];
}

export interface EmergencyResolution {
  event: EmergencyEvent;
  choice: EmergencyChoice;
  success: boolean;
  score: number;
  timedOut: boolean;
}

export interface SystemDefinition {
  key: SystemKey;
  label: string;
  shortLabel: string;
  unit: string;
  color: string;
  icon: string;
  blurb: string;
  criticalAt: number;
}

export type SystemHistory = Record<SystemKey, number[]>;

export interface MissionSnapshot {
  sol: number;
  minute: number;
  metrics: MetricMap;
  history: SystemHistory;
  status: MissionStatus;
  score: number;
}
