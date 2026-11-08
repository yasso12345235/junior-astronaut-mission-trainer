import { StyleSheet, Text, View } from 'react-native';

import { GlowCard } from '../../../shared/components/GlowCard';
import { fonts, palette, spacing, typography } from '../../../shared/design/tokens';
import { withAlpha } from '../../../shared/design/theme';
import { computeScore } from '../../mission/constants';
import { useMissionStatus } from '../../mission/hooks/useMissionClock';
import { useMissionStore } from '../../mission/store/missionStore';
import type { MissionStatus } from '../../mission/types';
import { TelemetryGauge } from '../../telemetry/components/TelemetryGauge';

const STATUS_COPY: Record<MissionStatus, string> = {
  nominal: 'All five systems are holding. Keep the base ahead of the curve.',
  caution: 'One system is drifting. Inspect the grid before the next drill.',
  critical: 'Threshold breach. Stabilize the base or the sim will end.',
  failed: 'Base integrity lost. Restart the simulation and review your calls.',
};

const STATUS_COLOR: Record<MissionStatus, string> = {
  nominal: palette.cyan,
  caution: palette.amber,
  critical: palette.red,
  failed: palette.red,
};

export function MissionSummary() {
  const metrics = useMissionStore((state) => state.metrics);
  const status = useMissionStatus();
  const drills = useMissionStore((state) => state.drillsCompleted);
  const bestScore = useMissionStore((state) => state.bestScore);
  const score = computeScore(metrics);
  const accent = STATUS_COLOR[status];

  return (
    <GlowCard accent={accent} delay={60}>
      <View style={styles.headerRow}>
        <Text style={styles.eyebrow}>MISSION HEALTH</Text>
        <View style={styles.liveRow}>
          <View style={[styles.liveDot, { backgroundColor: accent }]} />
          <Text style={[styles.live, { color: accent }]}>LIVE</Text>
        </View>
      </View>

      <View style={styles.content}>
        <TelemetryGauge value={score} color={accent} size={118} strokeWidth={9} unit="INDEX" />

        <View style={styles.copy}>
          <Text style={styles.scoreLabel}>COMPOSITE READINESS</Text>
          <Text style={styles.copyText}>{STATUS_COPY[status]}</Text>
          <Text style={styles.objective}>OBJECTIVE · KEEP EVERY SYSTEM ABOVE 30%</Text>
        </View>
      </View>

      <View style={styles.stats}>
        <Stat label="DRILLS" value={String(drills).padStart(2, '0')} />
        <View style={styles.divider} />
        <Stat label="BEST INDEX" value={String(bestScore || score).padStart(2, '0')} accent={palette.cyan} />
        <View style={styles.divider} />
        <Stat label="CREW" value="06" />
      </View>
    </GlowCard>
  );
}

function Stat({ label, value, accent = palette.textPrimary }: { label: string; value: string; accent?: string }) {
  return (
    <View style={styles.stat}>
      <Text style={[styles.statValue, { color: accent }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  eyebrow: {
    ...typography.micro,
    color: palette.textMuted,
    letterSpacing: 1.6,
  },
  liveRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  liveDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
  },
  live: {
    fontFamily: fonts.monoBold,
    fontSize: 9,
    letterSpacing: 1.4,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
  },
  copy: {
    flex: 1,
    gap: spacing.sm,
  },
  scoreLabel: {
    ...typography.micro,
    fontSize: 8,
    color: palette.textMuted,
  },
  copyText: {
    ...typography.body,
    color: palette.textPrimary,
    fontSize: 13,
    lineHeight: 19,
  },
  objective: {
    fontFamily: fonts.monoMedium,
    fontSize: 8,
    letterSpacing: 0.9,
    color: withAlpha(palette.cyan, 0.75),
    lineHeight: 12,
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: palette.lineSoft,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  statValue: {
    fontFamily: fonts.display,
    fontSize: 22,
    lineHeight: 24,
    letterSpacing: -0.5,
  },
  statLabel: {
    ...typography.micro,
    fontSize: 8,
    color: palette.textMuted,
    letterSpacing: 1,
  },
  divider: {
    width: StyleSheet.hairlineWidth,
    height: 26,
    backgroundColor: palette.lineSoft,
  },
});
