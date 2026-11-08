import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import type { ComponentProps } from 'react';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { palette } from '../../../shared/design/tokens';
import { withAlpha } from '../../../shared/design/theme';

interface OnboardingVisualProps {
  accent: string;
  icon: ComponentProps<typeof Ionicons>['name'];
}

function OrbitRing({
  size,
  duration,
  delay,
  color,
  dash,
}: {
  size: number;
  duration: number;
  delay: number;
  color: string;
  dash: number;
}) {
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withDelay(
      delay,
      withRepeat(withTiming(360, { duration, easing: Easing.linear }), -1, false),
    );
  }, [delay, duration, rotation]);

  const style = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <Animated.View
      style={[
        styles.ring,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          borderColor: withAlpha(color, 0.22),
          borderStyle: dash > 0 ? 'dashed' : 'solid',
          borderWidth: dash > 0 ? 0.8 : 1,
        },
        style,
      ]}
    >
      <View
        style={[
          styles.satellite,
          {
            backgroundColor: color,
            shadowColor: color,
            top: -4,
            left: size / 2 - 4,
          },
        ]}
      />
    </Animated.View>
  );
}

export function OnboardingVisual({ accent, icon }: OnboardingVisualProps) {
  return (
    <View style={styles.container}>
      <View style={[styles.aura, { backgroundColor: withAlpha(accent, 0.1) }]} />
      <OrbitRing size={286} duration={26000} delay={0} color={accent} dash={1} />
      <OrbitRing size={214} duration={18000} delay={400} color={accent} dash={0} />
      <OrbitRing size={142} duration={12000} delay={800} color={palette.amber} dash={1} />

      <LinearGradient
        colors={[withAlpha(accent, 0.9), withAlpha(accent, 0.18)]}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={[styles.core, { shadowColor: accent }]}
      >
        <View style={styles.coreInner}>
          <Ionicons name={icon} size={46} color={accent} />
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 300,
    height: 300,
    alignItems: 'center',
    justifyContent: 'center',
  },
  aura: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
  },
  ring: {
    position: 'absolute',
    alignItems: 'center',
  },
  satellite: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    shadowOpacity: 1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 0 },
  },
  core: {
    width: 104,
    height: 104,
    borderRadius: 52,
    padding: 2,
    shadowOpacity: 0.55,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 0 },
    elevation: 10,
  },
  coreInner: {
    flex: 1,
    borderRadius: 50,
    backgroundColor: palette.spaceBlue,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
