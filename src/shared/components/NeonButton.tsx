import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import type { ComponentProps } from 'react';
import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { haptics } from '../design/haptics';
import { elevation, fonts, gradients, palette, radius, spacing, typography } from '../design/tokens';
import { withAlpha } from '../design/theme';

type IoniconName = ComponentProps<typeof Ionicons>['name'];
type ButtonVariant = 'primary' | 'amber' | 'danger' | 'ghost';

interface NeonButtonProps {
  label: string;
  onPress: () => void;
  icon?: IoniconName;
  variant?: ButtonVariant;
  disabled?: boolean;
  compact?: boolean;
  style?: StyleProp<ViewStyle>;
}

const VARIANTS: Record<
  ButtonVariant,
  {
    colors: readonly [string, string];
    text: string;
    border: string;
    glow: string;
  }
> = {
  primary: {
    colors: gradients.cta,
    text: palette.textInverse,
    border: withAlpha(palette.cyan, 0.8),
    glow: palette.cyan,
  },
  amber: {
    colors: gradients.warn,
    text: palette.textInverse,
    border: withAlpha(palette.amber, 0.8),
    glow: palette.amber,
  },
  danger: {
    colors: gradients.danger,
    text: palette.white,
    border: withAlpha(palette.red, 0.8),
    glow: palette.red,
  },
  ghost: {
    colors: ['rgba(255,255,255,0.08)', 'rgba(255,255,255,0.02)'],
    text: palette.textPrimary,
    border: palette.line,
    glow: 'transparent',
  },
};

export function NeonButton({
  label,
  onPress,
  icon,
  variant = 'primary',
  disabled = false,
  compact = false,
  style,
}: NeonButtonProps) {
  const scale = useSharedValue(1);
  const config = VARIANTS[variant];

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      style={[
        animatedStyle,
        styles.wrapper,
        !disabled && variant !== 'ghost' && elevation.glow(config.glow),
        style,
      ]}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ disabled }}
        disabled={disabled}
        onPressIn={() => {
          scale.value = withTiming(0.97, { duration: 90 });
        }}
        onPressOut={() => {
          scale.value = withSpring(1, { damping: 16, stiffness: 280 });
        }}
        onPress={() => {
          haptics.press();
          onPress();
        }}
        style={[styles.pressable, disabled && styles.disabled]}
      >
        <LinearGradient
          colors={config.colors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <View style={[styles.content, compact && styles.contentCompact]}>
          {icon ? <Ionicons name={icon} size={compact ? 15 : 18} color={config.text} /> : null}
          <Text
            style={[
              compact ? typography.label : typography.monoBold,
              { color: config.text },
              compact && styles.compactLabel,
            ]}
          >
            {label}
          </Text>
        </View>
        <LinearGradient
          colors={['rgba(255,255,255,0.24)', 'rgba(255,255,255,0)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0.9, y: 0.9 }}
          style={styles.highlight}
        />
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: radius.md,
  },
  pressable: {
    overflow: 'hidden',
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.22)',
    minHeight: 52,
    justifyContent: 'center',
  },
  content: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  contentCompact: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    minHeight: 38,
  },
  compactLabel: {
    fontFamily: fonts.monoBold,
    fontSize: 10,
    letterSpacing: 1.2,
  },
  highlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '45%',
    opacity: 0.35,
  },
  disabled: {
    opacity: 0.4,
  },
});
