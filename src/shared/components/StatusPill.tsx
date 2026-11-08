import { MotiView } from 'moti';
import { StyleSheet, Text, View } from 'react-native';

import { motiTiming } from '../design/motion';
import { fonts, palette, radius, spacing } from '../design/tokens';
import { withAlpha } from '../design/theme';

interface StatusPillProps {
  label: string;
  color?: string;
  pulse?: boolean;
  compact?: boolean;
}

export function StatusPill({ label, color = palette.green, pulse = true, compact }: StatusPillProps) {
  return (
    <View
      style={[
        styles.pill,
        { backgroundColor: withAlpha(color, 0.12), borderColor: withAlpha(color, 0.35) },
        compact && styles.compact,
      ]}
    >
      <MotiView
        from={pulse ? { opacity: 0.35, scale: 0.7 } : { opacity: 1, scale: 1 }}
        animate={pulse ? { opacity: 1, scale: 1 } : { opacity: 1, scale: 1 }}
        transition={pulse ? motiTiming(1400, 0, true) : motiTiming(200)}
        style={[styles.dot, { backgroundColor: color, shadowColor: color }]}
      />
      <Text style={[styles.label, compact && styles.labelCompact, { color }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderRadius: radius.pill,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
  },
  compact: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    shadowOpacity: 0.9,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 0 },
  },
  label: {
    fontFamily: fonts.monoMedium,
    fontSize: 10,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  labelCompact: {
    fontSize: 9,
  },
});
