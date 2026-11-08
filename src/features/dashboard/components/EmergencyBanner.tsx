import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { GlowCard } from '../../../shared/components/GlowCard';
import { NeonButton } from '../../../shared/components/NeonButton';
import { StatusPill } from '../../../shared/components/StatusPill';
import { haptics } from '../../../shared/design/haptics';
import { fonts, palette, spacing, typography } from '../../../shared/design/tokens';
import { useMissionStatus } from '../../mission/hooks/useMissionClock';
import { useMissionStore } from '../../mission/store/missionStore';

interface EmergencyBannerProps {
  onRunDrill: () => void;
}

export function EmergencyBanner({ onRunDrill }: EmergencyBannerProps) {
  const active = useMissionStore((state) => state.activeEmergency);
  const drills = useMissionStore((state) => state.drillsCompleted);
  const status = useMissionStatus();

  if (active) {
    return (
      <GlowCard accent={palette.red} delay={100}>
        <View style={styles.alertHeader}>
          <StatusPill label="Priority alert" color={palette.red} compact />
          <Text style={styles.code}>{active.code}</Text>
        </View>
        <Text style={styles.alertTitle}>{active.title}</Text>
        <Text style={styles.copy}>
          Decision window is open. The console will auto-resolve with the riskiest option when it expires.
        </Text>
      </GlowCard>
    );
  }

  return (
    <GlowCard accent={palette.amber} delay={100}>
      <View style={styles.row}>
        <View style={styles.iconWrap}>
          <Ionicons name="warning" size={22} color={palette.amber} />
        </View>
        <View style={styles.copyWrap}>
          <Text style={styles.eyebrow}>EMERGENCY DRILL</Text>
          <Text style={styles.title}>Train under pressure</Text>
        </View>
        <Text style={styles.count}>{String(drills).padStart(2, '0')}</Text>
      </View>

      <Text style={styles.copy}>
        Launch a live scenario and choose a response before the timer runs out. Every decision shifts the base.
      </Text>

      <NeonButton
        label="RUN EMERGENCY DRILL"
        icon="alert-circle"
        variant="amber"
        disabled={status === 'failed'}
        onPress={() => {
          haptics.warning();
          onRunDrill();
        }}
        style={styles.cta}
      />
    </GlowCard>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: 'rgba(255,184,0,0.12)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,184,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  copyWrap: {
    flex: 1,
    gap: 2,
  },
  eyebrow: {
    ...typography.micro,
    color: palette.amber,
    letterSpacing: 1.6,
  },
  title: {
    ...typography.title,
    fontSize: 18,
    lineHeight: 22,
    color: palette.textPrimary,
  },
  count: {
    fontFamily: fonts.display,
    fontSize: 22,
    color: 'rgba(255,184,0,0.55)',
    letterSpacing: -0.5,
  },
  copy: {
    ...typography.body,
    fontSize: 13,
    lineHeight: 19,
    color: palette.textSecondary,
    marginTop: spacing.md,
  },
  cta: {
    marginTop: spacing.lg,
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  code: {
    fontFamily: fonts.monoBold,
    fontSize: 10,
    letterSpacing: 1.4,
    color: palette.textMuted,
  },
  alertTitle: {
    ...typography.headline,
    fontSize: 22,
    lineHeight: 26,
    color: palette.white,
    marginTop: spacing.md,
  },
});
