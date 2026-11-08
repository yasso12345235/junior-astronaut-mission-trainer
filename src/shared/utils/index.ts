export const clamp = (value: number, min = 0, max = 100): number =>
  Math.min(max, Math.max(min, value));

export const average = (values: readonly number[]): number =>
  values.length === 0 ? 0 : values.reduce((sum, value) => sum + value, 0) / values.length;

export const roundTo = (value: number, decimals = 0): number => {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
};

export const pad = (value: number, size = 2): string => String(value).padStart(size, '0');

/** Mission minutes are 1-based inside a 24h sol. */
export function formatSolClock(minuteOfSol: number): string {
  const hour = Math.floor(minuteOfSol / 60) % 24;
  const minute = minuteOfSol % 60;
  return `${pad(hour)}:${pad(minute)}`;
}

export function formatSolLabel(sol: number): string {
  return `SOL ${pad(sol, 3)}`;
}

export function createId(prefix = 'id'): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}

export function pickRandom<T>(items: readonly T[], exclude?: T): T {
  const pool = items.length > 1 && exclude !== undefined ? items.filter((item) => item !== exclude) : items;
  return pool[Math.floor(Math.random() * pool.length)] as T;
}

export function severityRank(severity: string): number {
  switch (severity) {
    case 'critical':
      return 3;
    case 'warning':
      return 2;
    case 'success':
      return 1;
    default:
      return 0;
  }
}
