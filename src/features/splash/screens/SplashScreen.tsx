import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import LottieView from 'lottie-react-native';
import { MotiView } from 'moti';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { RootStackParamList } from '../../../app/navigation/types';
import { SkiaBackground } from '../../../shared/components/SkiaBackground';
import { motiTiming } from '../../../shared/design/motion';
import { fonts, palette, spacing, typography } from '../../../shared/design/tokens';
import { withAlpha } from '../../../shared/design/theme';
import { useMissionStore } from '../../mission/store/missionStore';

type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>;

const BOOT_LINES = [
  'PRESSURIZING CABIN',
  'LINKING TELEMETRY',
  'CALIBRATING SHIELD ARRAY',
  'CREW MANIFEST VERIFIED',
  'MISSION CONTROL ONLINE',
];

export function SplashScreen({ navigation }: Props) {
  const [bootIndex, setBootIndex] = useState(0);
  const [barWidth, setBarWidth] = useState(0);
  const [percent, setPercent] = useState(0);
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(1, { duration: 2700, easing: Easing.inOut(Easing.cubic) });

    const bootTimer = setInterval(() => {
      setBootIndex((current) => (current + 1) % BOOT_LINES.length);
    }, 540);

    const percentTimer = setInterval(() => {
      setPercent(Math.round(Math.min(1, progress.value) * 100));
    }, 120);

    const navTimer = setTimeout(async () => {
      try {
        await useMissionStore.persist.rehydrate();
      } catch {
        // A failed rehydration should never block the mission.
      }
      const onboarded = useMissionStore.getState().hasOnboarded;
      navigation.replace(onboarded ? 'Main' : 'Onboarding');
    }, 3100);

    return () => {
      clearInterval(bootTimer);
      clearInterval(percentTimer);
      clearTimeout(navTimer);
    };
  }, [navigation, progress]);

  const barStyle = useAnimatedStyle(() => ({
    width: barWidth * progress.value,
  }));

  return (
    <View style={styles.root}>
      <SkiaBackground accent={palette.cyan} intensity={1.1} />
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={styles.top}>
          <Text style={styles.mono}>NASA SPACE APPS // 2026</Text>
          <View style={styles.liveTag}>
            <View style={styles.liveDot} />
            <Text style={styles.liveLabel}>SIM LIVE</Text>
          </View>
        </View>

        <View style={styles.center}>
          <MotiView
            from={{ opacity: 0, scale: 0.86 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={motiTiming(900)}
            style={styles.lottieWrap}
          >
            <LottieView
              source={require('../../../../assets/lottie/orbit.json')}
              autoPlay
              loop
              style={styles.lottie}
            />
          </MotiView>

          <MotiView
            from={{ opacity: 0, translateY: 18 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={motiTiming(620, 220)}
            style={styles.copy}
          >
            <Text style={styles.eyebrow}>ARTEMIS TRAINING PROGRAM</Text>
            <Text style={styles.title}>JUNIOR</Text>
            <Text style={[styles.title, styles.titleAccent]}>ASTRONAUT</Text>
            <View style={styles.rule} />
            <Text style={styles.subtitle}>MISSION TRAINER</Text>
          </MotiView>
        </View>

        <View style={styles.bottom}>
          <View style={styles.bootRow}>
            <Text style={styles.bootLabel}>{BOOT_LINES[bootIndex]}</Text>
            <Text style={styles.bootPercent}>{String(percent).padStart(3, '0')}%</Text>
          </View>

          <View style={styles.bar} onLayout={(event) => setBarWidth(event.nativeEvent.layout.width)}>
            <Animated.View style={[styles.barFill, barStyle]} />
          </View>

          <View style={styles.footerRow}>
            <Text style={styles.footerText}>v1.0.0</Text>
            <Text style={styles.footerText}>LUNAR HABITAT SIMULATION</Text>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: palette.voidBlack,
  },
  safe: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    justifyContent: 'space-between',
  },
  top: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.md,
  },
  mono: {
    ...typography.micro,
    color: palette.textMuted,
  },
  liveTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: withAlpha(palette.green, 0.4),
    backgroundColor: withAlpha(palette.green, 0.1),
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 20,
  },
  liveDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: palette.green,
  },
  liveLabel: {
    fontFamily: fonts.monoBold,
    fontSize: 8,
    letterSpacing: 1.2,
    color: palette.green,
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  lottieWrap: {
    width: 300,
    height: 300,
    marginBottom: -18,
  },
  lottie: {
    width: '100%',
    height: '100%',
  },
  copy: {
    alignItems: 'center',
  },
  eyebrow: {
    ...typography.micro,
    color: palette.cyan,
    letterSpacing: 2.4,
    marginBottom: spacing.sm,
  },
  title: {
    ...typography.hero,
    fontSize: 46,
    lineHeight: 48,
    letterSpacing: 6,
    color: palette.white,
    textAlign: 'center',
  },
  titleAccent: {
    color: palette.cyan,
    textShadowColor: withAlpha(palette.cyan, 0.55),
    textShadowRadius: 22,
  },
  rule: {
    width: 54,
    height: 1,
    backgroundColor: withAlpha(palette.cyan, 0.5),
    marginVertical: spacing.md,
  },
  subtitle: {
    fontFamily: fonts.monoMedium,
    fontSize: 11,
    letterSpacing: 5,
    color: palette.textSecondary,
  },
  bottom: {
    paddingBottom: spacing.md,
    gap: spacing.sm,
  },
  bootRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bootLabel: {
    ...typography.micro,
    color: palette.textSecondary,
    letterSpacing: 1.4,
  },
  bootPercent: {
    fontFamily: fonts.mono,
    fontSize: 10,
    color: palette.cyan,
    letterSpacing: 1,
  },
  bar: {
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: palette.cyan,
    shadowColor: palette.cyan,
    shadowOpacity: 1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 0 },
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
  },
  footerText: {
    ...typography.micro,
    fontSize: 8,
    color: palette.textMuted,
    letterSpacing: 1,
  },
});
