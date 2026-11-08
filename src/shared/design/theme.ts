import { DarkTheme, type Theme } from '@react-navigation/native';

import { palette, gradients } from './tokens';

/** Adds an alpha channel to a #RRGGBB / #RGB hex color. */
export function withAlpha(hex: string, alpha: number): string {
  if (hex.startsWith('rgba') || hex.startsWith('rgb')) return hex;

  const normalized = hex.replace('#', '');
  const full =
    normalized.length === 3
      ? normalized
          .split('')
          .map((char) => char + char)
          .join('')
      : normalized;

  const value = Number.parseInt(full, 16);
  const r = (value >> 16) & 255;
  const g = (value >> 8) & 255;
  const b = value & 255;
  return `rgba(${r}, ${g}, ${b}, ${Math.min(1, Math.max(0, alpha))})`;
}

export const navigationTheme: Theme = {
  ...DarkTheme,
  dark: true,
  colors: {
    ...DarkTheme.colors,
    primary: palette.cyan,
    background: palette.voidBlack,
    card: palette.spaceBlue,
    text: palette.textPrimary,
    border: palette.line,
    notification: palette.red,
  },
};

export { palette, gradients };
