import { Pressable, StyleSheet, Text, View } from 'react-native';

import { SectionHeader } from '../../../shared/components/SectionHeader';
import { haptics } from '../../../shared/design/haptics';
import { fonts, palette, spacing } from '../../../shared/design/tokens';
import type { SystemKey } from '../../mission/types';
import { CommanderHeader } from './CommanderHeader';
import { EmergencyBanner } from './EmergencyBanner';
import { MetricCard } from './MetricCard';
import { MissionSummary } from './MissionSummary';

export type LogFilter = 'all' | 'alerts';

interface DashboardHeaderProps {
  filter: LogFilter;
  onChangeFilter: (filter: LogFilter) => void;
  onOpenSystem: (system: SystemKey) => void;
  onRunDrill: () => void;
  logCount: number;
  alertCount: number;
}

export function DashboardHeader({
  filter,
  onChangeFilter,
  onOpenSystem,
  onRunDrill,
  logCount,
  alertCount,
}: DashboardHeaderProps) {
  return (
    <View>
      <CommanderHeader />

      <View style={styles.summary}>
        <MissionSummary />
      </View>

      <View style={styles.section}>
        <SectionHeader eyebrow="TELEMETRY" title="Base systems" icon="pulse" />
        <View style={styles.grid}>
          <MetricCard system="lifeSupport" onPress={onOpenSystem} delay={120} />
          <MetricCard system="power" onPress={onOpenSystem} delay={180} />
        </View>
        <View style={styles.grid}>
          <MetricCard system="radiation" onPress={onOpenSystem} delay={240} />
          <MetricCard system="hydroponics" onPress={onOpenSystem} delay={300} />
        </View>
        <MetricCard system="crew" onPress={onOpenSystem} delay={360} wide />
      </View>

      <View style={styles.divider} />

      <EmergencyBanner onRunDrill={onRunDrill} />

      <View style={styles.logHeader}>
        <SectionHeader eyebrow="BLACK BOX" title="Mission log" icon="list" />
        <View style={styles.filters}>
          <FilterChip
            label={`All ${String(logCount).padStart(2, '0')}`}
            active={filter === 'all'}
            onPress={() => onChangeFilter('all')}
          />
          <FilterChip
            label={`Alerts ${String(alertCount).padStart(2, '0')}`}
            active={filter === 'alerts'}
            color={palette.amber}
            onPress={() => onChangeFilter('alerts')}
          />
        </View>
      </View>
    </View>
  );
}

function FilterChip({
  label,
  active,
  onPress,
  color = palette.cyan,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
  color?: string;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      onPress={() => {
        haptics.select();
        onPress();
      }}
      style={[
        styles.chip,
        active && {
          backgroundColor: `${color}18`,
          borderColor: `${color}66`,
        },
      ]}
    >
      <Text style={[styles.chipLabel, active && { color }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  summary: {
    marginTop: spacing.xl,
  },
  section: {
    marginTop: spacing.xxl,
    gap: spacing.md,
  },
  grid: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: palette.lineSoft,
    marginVertical: spacing.xxl,
  },
  logHeader: {
    marginTop: spacing.xxl,
  },
  filters: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: palette.line,
    backgroundColor: 'rgba(255,255,255,0.02)',
  },
  chipLabel: {
    fontFamily: fonts.monoMedium,
    fontSize: 9,
    letterSpacing: 1,
    color: palette.textMuted,
    textTransform: 'uppercase',
  },
});
