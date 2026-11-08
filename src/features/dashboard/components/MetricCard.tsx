import { Ionicons } from '@expo/vector-icons';
import { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { GlowCard } from '../../../shared/components/GlowCard';
import { withAlpha } from '../../../shared/design/theme';
import { fonts, palette, spacing, typography } from '../../../shared/design/tokens';
import { SYSTEM_DEFINITIONS } from '../../mission/constants';
import { useMetric } from '../../mission/hooks/useMissionClock';
import type { SystemKey } from '../../mission/types';
import { MetricBar } from '../../telemetry/components/MetricBar';

interface MetricCardProps {
  system: SystemKey;
  onPress: (system: SystemKey) => void;
  delay?: number;
  wide?: boolean;
}

export const MetricCard = memo(function MetricCard({
  system,
  onPress,
  delay = 0,
  wide = false,
}: MetricCardProps) {
  const value = useMetric(system);
  const definition = SYSTEM_DEFINITIONS[system];
  const status =
    value < 30 ? 'CRITICAL' : value < 55 ? 'WATCH' : 'STABLE';
  const statusColor =
    value < 30 ? palette.red : value < 55 ? palette.amber : definition.color;

  return (
    <GlowCard
      accent={definition.color}
      delay={delay}
      onPress={() => onPress(system)}
      style={wide ? styles.wide : undefined}
      accessibilityLabel={`Open ${definition.label} details`}
    >
      <View style={styles.header}>
        <View
          style={[
            styles.iconWrap,
            {
              backgroundColor: withAlpha(definition.color, 0.14),
              borderColor: withAlpha(definition.color, 0.3),
            },
          ]}
        >
          <Ionicons
            name={definition.icon as keyof typeof Ionicons.glyphMap}
            size={16}
            color={definition.color}
          />
        </View>
        <View style={styles.titles}>
          <Text style={styles.short}>{definition.shortLabel}</Text>
          <Text style={styles.label} numberOfLines={1}>
            {definition.label}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={14} color={palette.textMuted} />
      </View>

      <View style={styles.valueRow}>
        <Text style={[styles.value, { color: statusColor }]}>{Math.round(value)}</Text>
        <Text style={[styles.unit, { color: withAlpha(statusColor, 0.75) }]}>
          {definition.unit}
        </Text>
        <View style={styles.statusWrap}>
          <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
          <Text style={[styles.status, { color: statusColor }]}>{status}</Text>
        </View>
      </View>

      <MetricBar value={value} color={statusColor} />

      <View style={styles.footer}>
        <Text style={styles.blurb} numberOfLines={1}>
          {definition.blurb.split('.')[0]}.
        </Text>
      </View>
    </GlowCard>
  );
});

const styles = StyleSheet.create({
  wide: {
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  iconWrap: {
    width: 30,
    height: 30,
    borderRadius: 9,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titles: {
    flex: 1,
    gap: 1,
  },
  short: {
    fontFamily: fonts.monoMedium,
    fontSize: 8,
    letterSpacing: 1.2,
    color: palette.textMuted,
  },
  label: {
    ...typography.body,
    fontFamily: fonts.heading,
    fontSize: 13,
    lineHeight: 17,
    color: palette.textPrimary,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 3,
    marginBottom: spacing.sm,
  },
  value: {
    fontFamily: fonts.display,
    fontSize: 34,
    lineHeight: 36,
    letterSpacing: -1.6,
  },
  unit: {
    fontFamily: fonts.monoBold,
    fontSize: 11,
    lineHeight: 20,
    marginBottom: 2,
  },
  statusWrap: {
    marginLeft: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 6,
  },
  statusDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  status: {
    fontFamily: fonts.monoBold,
    fontSize: 8,
    letterSpacing: 1,
  },
  footer: {
    marginTop: spacing.sm,
  },
  blurb: {
    ...typography.mono,
    fontSize: 9,
    lineHeight: 13,
    color: palette.textMuted,
  },
});
