import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MotiView } from 'moti';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { RootStackParamList } from '../../../app/navigation/types';
import { NeonButton } from '../../../shared/components/NeonButton';
import { SkiaBackground } from '../../../shared/components/SkiaBackground';
import { haptics } from '../../../shared/design/haptics';
import { motiTiming } from '../../../shared/design/motion';
import { fonts, palette, spacing, typography } from '../../../shared/design/tokens';
import { withAlpha } from '../../../shared/design/theme';
import { useMissionStore } from '../../mission/store/missionStore';
import { OnboardingVisual } from '../components/OnboardingVisual';
import { ONBOARDING_SLIDES } from '../data/slides';

type Props = NativeStackScreenProps<RootStackParamList, 'Onboarding'>;

export function OnboardingScreen({ navigation }: Props) {
  const [index, setIndex] = useState(0);
  const completeOnboarding = useMissionStore((state) => state.completeOnboarding);
  const slide = ONBOARDING_SLIDES[index] ?? ONBOARDING_SLIDES[0];
  const isLast = index === ONBOARDING_SLIDES.length - 1;

  const finish = () => {
    completeOnboarding();
    haptics.confirm();
    navigation.replace('Main');
  };

  const next = () => {
    if (isLast) {
      finish();
      return;
    }
    haptics.select();
    setIndex((current) => Math.min(ONBOARDING_SLIDES.length - 1, current + 1));
  };

  return (
    <View style={styles.root}>
      <SkiaBackground accent={slide.accent} />
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={styles.topbar}>
          <Text style={styles.brand}>JAMT / TRAINING</Text>
          <Pressable hitSlop={12} onPress={finish}>
            <Text style={styles.skip}>SKIP</Text>
          </Pressable>
        </View>

        <View style={styles.hero}>
          <OnboardingVisual accent={slide.accent} icon={slide.icon} />

          <MotiView
            key={slide.id}
            from={{ opacity: 0, translateY: 26 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={motiTiming(420)}
            style={styles.copy}
          >
            <Text style={[styles.kicker, { color: slide.accent }]}>{slide.kicker}</Text>
            <Text style={styles.title}>{slide.title}</Text>
            <Text style={styles.body}>{slide.body}</Text>
          </MotiView>
        </View>

        <View style={styles.footer}>
          <View style={styles.dots}>
            {ONBOARDING_SLIDES.map((item, dotIndex) => (
              <MotiView
                key={item.id}
                animate={{
                  width: dotIndex === index ? 26 : 6,
                  backgroundColor: dotIndex === index ? slide.accent : withAlpha(palette.textSecondary, 0.3),
                }}
                transition={motiTiming(240)}
                style={styles.dot}
              />
            ))}
          </View>

          <NeonButton
            label={isLast ? 'BEGIN TRAINING' : 'CONTINUE'}
            icon={isLast ? 'rocket' : 'arrow-forward'}
            onPress={next}
            style={styles.cta}
          />

          <Text style={styles.counter}>
            {String(index + 1).padStart(2, '0')} / {String(ONBOARDING_SLIDES.length).padStart(2, '0')}
          </Text>
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
  },
  topbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: spacing.md,
  },
  brand: {
    ...typography.label,
    color: palette.textMuted,
  },
  skip: {
    ...typography.label,
    color: palette.textSecondary,
    letterSpacing: 2,
  },
  hero: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.lg,
  },
  copy: {
    width: '100%',
    gap: spacing.sm,
  },
  kicker: {
    ...typography.label,
    letterSpacing: 2,
  },
  title: {
    ...typography.display,
    color: palette.white,
    fontSize: 38,
    lineHeight: 42,
  },
  body: {
    ...typography.bodyLarge,
    color: palette.textSecondary,
    maxWidth: 360,
  },
  footer: {
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
    gap: spacing.md,
    alignItems: 'center',
  },
  dots: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    height: 8,
  },
  dot: {
    height: 6,
    borderRadius: 3,
  },
  cta: {
    width: '100%',
  },
  counter: {
    ...typography.micro,
    color: palette.textMuted,
    fontFamily: fonts.mono,
  },
});
