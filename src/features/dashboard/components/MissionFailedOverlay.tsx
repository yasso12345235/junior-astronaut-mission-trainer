import LottieView from 'lottie-react-native';
import { MotiView } from 'moti';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { NeonButton } from '../../../shared/components/NeonButton';
import { haptics } from '../../../shared/design/haptics';
import { motiSpring, motiTiming } from '../../../shared/design/motion';
import { fonts, palette, spacing, typography } from '../../../shared/design/tokens';
import { useMissionStore } from '../../mission/store/missionStore';

export function MissionFailedOverlay() {
  const status = useMissionStore((state) => state.status);
  const drills = useMissionStore((state) => state.drillsCompleted);
  const bestScore = useMissionStore((state) => state.bestScore);
  const resetMission = useMissionStore((state) => state.resetMission);

  useEffect(() => {
    if (status === 'failed') haptics.error();
  }, [status]);

  if (status !== 'failed') return null;

  return (
    <MotiView
      from={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={motiTiming(320)}
      style={styles.overlay}
    >
      <View style={styles.card}>
        <MotiView
          from={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={motiSpring(13, 150)}
          style={styles.lottieWrap}
        >
          <LottieView
            source={require('../../../../assets/lottie/alert.json')}
            autoPlay
            loop
            style={styles.lottie}
          />
        </MotiView>

        <Text style={styles.kicker}>SIMULATION TERMINATED</Text>
        <Text style={styles.title}>Base integrity lost</Text>
        <Text style={styles.copy}>
          A critical system hit zero. Review the black box, adjust your trade-offs and run the mission again.
        </Text>

        <View style={styles.stats}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{drills}</Text>
            <Text style={styles.statLabel}>DRILLS</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.stat}>
            <Text style={styles.statValue}>{bestScore}</Text>
            <Text style={styles.statLabel}>BEST INDEX</Text>
          </View>
        </View>

        <NeonButton
          label="RESTART SIMULATION"
          icon="refresh"
          variant="danger"
          onPress={() => {
            haptics.confirm();
            resetMission();
          }}
          style={styles.cta}
        />
      </View>
    </MotiView>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(5, 7, 9, 0.92)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    zIndex: 20,
  },
  card: {
    width: '100%',
    maxWidth: 380,
    alignItems: 'center',
    borderRadius: 28,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,51,102,0.35)',
    backgroundColor: '#0C111A',
    padding: spacing.xl,
    shadowColor: palette.red,
    shadowOpacity: 0.35,
    shadowRadius: 30,
    shadowOffset: { width: 0, height: 0 },
    elevation: 20,
  },
  lottieWrap: {
    width: 130,
    height: 130,
    marginBottom: -10,
  },
  lottie: {
    width: '100%',
    height: '100%',
  },
  kicker: {
    ...typography.label,
    color: palette.red,
    letterSpacing: 2,
  },
  title: {
    ...typography.headline,
    color: palette.white,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  copy: {
    ...typography.body,
    color: palette.textSecondary,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xl,
    width: '100%',
  },
  stat: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  statValue: {
    fontFamily: fonts.display,
    fontSize: 24,
    color: palette.textPrimary,
  },
  statLabel: {
    ...typography.micro,
    fontSize: 8,
    color: palette.textMuted,
  },
  divider: {
    width: StyleSheet.hairlineWidth,
    height: 26,
    backgroundColor: palette.lineSoft,
  },
  cta: {
    width: '100%',
    marginTop: spacing.xl,
  },
});
