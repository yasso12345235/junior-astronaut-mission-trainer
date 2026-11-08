import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';

import { StatusPill } from '../../../shared/components/StatusPill';
import { fonts, palette, spacing, typography } from '../../../shared/design/tokens';
import { withAlpha } from '../../../shared/design/theme';
import { useMissionClock, useMissionStatus } from '../../mission/hooks/useMissionClock';
import type { MissionStatus } from '../../mission/types';

const STATUS_META: Record<MissionStatus, { label: string; color: string }> = {
  nominal: { label: 'Nominal', color: palette.green },
  caution: { label: 'Caution', color: palette.amber },
  critical: { label: 'Critical', color: palette.red },
  failed: { label: 'Offline', color: palette.red },
};

export function CommanderHeader() {
  const { solLabel, clock } = useMissionClock();
  const status = useMissionStatus();
  const meta = STATUS_META[status];

  return (
    <View style={styles.root}>
      <View style={styles.identity}>
        <LinearGradient
          colors={[withAlpha(palette.cyan, 0.9), withAlpha(palette.plasma, 0.3)]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.patch}
        >
          <View style={styles.patchInner}>
            <Ionicons name="planet" size={20} color={palette.cyan} />
          </View>
        </LinearGradient>

        <View style={styles.titles}>
          <Text style={styles.eyebrow}>
            ARTEMIS BASE <Text style={styles.dot}>·</Text> {solLabel}
          </Text>
          <Text style={styles.name}>Commander Nova</Text>
        </View>
      </View>

      <View style={styles.meta}>
        <Text style={styles.clock}>{clock}</Text>
        <StatusPill label={meta.label} color={meta.color} compact />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: spacing.sm,
    gap: spacing.md,
  },
  identity: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flex: 1,
  },
  patch: {
    width: 42,
    height: 42,
    borderRadius: 21,
    padding: 1,
    shadowColor: palette.cyan,
    shadowOpacity: 0.5,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 0 },
    elevation: 8,
  },
  patchInner: {
    flex: 1,
    borderRadius: 20,
    backgroundColor: palette.spaceBlue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titles: {
    gap: 2,
    flex: 1,
  },
  eyebrow: {
    ...typography.micro,
    color: palette.textMuted,
    letterSpacing: 1.3,
  },
  dot: {
    color: palette.cyan,
  },
  name: {
    ...typography.title,
    fontSize: 18,
    lineHeight: 22,
    color: palette.textPrimary,
  },
  meta: {
    alignItems: 'flex-end',
    gap: spacing.xs,
  },
  clock: {
    fontFamily: fonts.monoBold,
    fontSize: 15,
    letterSpacing: 1.6,
    color: palette.cyan,
  },
});
