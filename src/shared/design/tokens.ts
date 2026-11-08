/**
 * JAMT Design Tokens
 * Single source of truth for color, spacing, radii, typography and motion.
 * Never hard-code raw values in feature components — import from this file.
 */

export const palette = {
  // Core surfaces
  voidBlack: '#050709',
  spaceBlue: '#0B0E14',
  surface: '#111722',
  surfaceElevated: '#161E2C',
  surfaceGlass: 'rgba(22, 30, 44, 0.72)',
  line: '#223046',
  lineSoft: 'rgba(143, 163, 191, 0.14)',

  // Signal colors
  cyan: '#00F0FF',
  cyanSoft: 'rgba(0, 240, 255, 0.16)',
  amber: '#FFB800',
  amberSoft: 'rgba(255, 184, 0, 0.16)',
  red: '#FF3366',
  redSoft: 'rgba(255, 51, 102, 0.16)',
  green: '#00E676',
  greenSoft: 'rgba(0, 230, 118, 0.16)',
  plasma: '#8B7CFF',
  plasmaSoft: 'rgba(139, 124, 255, 0.16)',
  rose: '#FF6FA5',
  roseSoft: 'rgba(255, 111, 165, 0.16)',

  // Text
  white: '#F7FCFF',
  textPrimary: '#E9F4FF',
  textSecondary: '#8FA3BF',
  textMuted: '#5A6B85',
  textInverse: '#050709',
} as const;

export const spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
  huge: 64,
} as const;

export const radius = {
  sm: 8,
  md: 14,
  lg: 20,
  xl: 26,
  xxl: 34,
  pill: 999,
} as const;

export const fonts = {
  display: 'SpaceGrotesk_700Bold',
  heading: 'SpaceGrotesk_600SemiBold',
  medium: 'SpaceGrotesk_500Medium',
  body: 'SpaceGrotesk_400Regular',
  mono: 'JetBrainsMono_400Regular',
  monoMedium: 'JetBrainsMono_500Medium',
  monoBold: 'JetBrainsMono_700Bold',
} as const;

export const fontSize = {
  micro: 9,
  caption: 11,
  label: 12,
  body: 14,
  bodyLarge: 16,
  title: 20,
  headline: 26,
  display: 36,
  hero: 48,
} as const;

export const typography = {
  hero: {
    fontFamily: fonts.display,
    fontSize: fontSize.hero,
    lineHeight: 50,
    letterSpacing: -1.6,
  },
  display: {
    fontFamily: fonts.display,
    fontSize: fontSize.display,
    lineHeight: 40,
    letterSpacing: -1.2,
  },
  headline: {
    fontFamily: fonts.heading,
    fontSize: fontSize.headline,
    lineHeight: 30,
    letterSpacing: -0.6,
  },
  title: {
    fontFamily: fonts.heading,
    fontSize: fontSize.title,
    lineHeight: 25,
    letterSpacing: -0.3,
  },
  body: {
    fontFamily: fonts.body,
    fontSize: fontSize.body,
    lineHeight: 21,
  },
  bodyLarge: {
    fontFamily: fonts.body,
    fontSize: fontSize.bodyLarge,
    lineHeight: 24,
  },
  label: {
    fontFamily: fonts.monoMedium,
    fontSize: fontSize.caption,
    lineHeight: 15,
    letterSpacing: 1.6,
    textTransform: 'uppercase' as const,
  },
  micro: {
    fontFamily: fonts.monoMedium,
    fontSize: fontSize.micro,
    lineHeight: 12,
    letterSpacing: 1.2,
    textTransform: 'uppercase' as const,
  },
  mono: {
    fontFamily: fonts.mono,
    fontSize: fontSize.label,
    lineHeight: 17,
    letterSpacing: 0.4,
  },
  monoBold: {
    fontFamily: fonts.monoBold,
    fontSize: fontSize.label,
    lineHeight: 17,
    letterSpacing: 0.6,
  },
  metric: {
    fontFamily: fonts.display,
    fontSize: 32,
    lineHeight: 34,
    letterSpacing: -1.4,
  },
  metricSmall: {
    fontFamily: fonts.display,
    fontSize: 20,
    lineHeight: 22,
    letterSpacing: -0.6,
  },
} as const;

export const layout = {
  screenPadding: spacing.lg,
  cardGap: spacing.md,
  bottomDockHeight: 92,
  maxContentWidth: 560,
} as const;

export const motion = {
  instant: 120,
  fast: 220,
  base: 360,
  slow: 620,
  splash: 2600,
  pour: 900,
  stagger: 70,
} as const;

export const elevation = {
  card: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.45,
    shadowRadius: 28,
    elevation: 12,
  },
  glow: (color: string) => ({
    shadowColor: color,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.55,
    shadowRadius: 18,
    elevation: 10,
  }),
} as const;

export const gradients = {
  cardSheen: ['rgba(255,255,255,0.10)', 'rgba(255,255,255,0.01)', 'rgba(255,255,255,0)'] as const,
  cyan: [palette.cyan, 'rgba(0, 240, 255, 0.02)'] as const,
  amber: [palette.amber, 'rgba(255, 184, 0, 0.02)'] as const,
  red: [palette.red, 'rgba(255, 51, 102, 0.02)'] as const,
  green: [palette.green, 'rgba(0, 230, 118, 0.02)'] as const,
  plasma: [palette.plasma, 'rgba(139, 124, 255, 0.02)'] as const,
  rose: [palette.rose, 'rgba(255, 111, 165, 0.02)'] as const,
  void: [palette.spaceBlue, palette.voidBlack] as const,
  cta: [palette.cyan, '#00A9B8'] as const,
  danger: [palette.red, '#B3123F'] as const,
  warn: [palette.amber, '#C88F00'] as const,
} as const;

export type PaletteColor = keyof typeof palette;
export type Spacing = keyof typeof spacing;
