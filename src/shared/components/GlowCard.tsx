import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';

import { haptics } from '../design/haptics';
import { motiTiming } from '../design/motion';
import { palette, radius, spacing } from '../design/tokens';
import { withAlpha } from '../design/theme';

interface GlowCardProps {
  children: ReactNode;
  accent?: string;
  delay?: number;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  padded?: boolean;
  accessibilityLabel?: string;
}

/**
 * Entry-animated glass card with a tinted gradient rim and a soft sheen.
 * Memo-friendly: children own their own subscriptions so the card shell stays static.
 */
export function GlowCard({
  children,
  accent = palette.cyan,
  delay = 0,
  onPress,
  style,
  padded = true,
  accessibilityLabel,
}: GlowCardProps) {
  return (
    <MotiView
      from={{ opacity: 0, translateY: 16 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={motiTiming(440, delay)}
      style={[styles.wrapper, style]}
    >
      <LinearGradient
        colors={[withAlpha(accent, 0.4), withAlpha(accent, 0.07), 'rgba(255,255,255,0.02)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <LinearGradient
        colors={['rgba(255,255,255,0.08)', 'rgba(255,255,255,0)']}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.7, y: 0.6 }}
        style={styles.sheen}
      />
      <Pressable
        accessibilityRole={onPress ? 'button' : undefined}
        accessibilityLabel={accessibilityLabel}
        disabled={!onPress}
        onPress={() => {
          if (!onPress) return;
          haptics.tap();
          onPress();
        }}
        style={[styles.body, padded && styles.padded]}
      >
        {children}
      </Pressable>
    </MotiView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: radius.lg,
    overflow: 'hidden',
    backgroundColor: withAlpha(palette.surfaceElevated, 0.86),
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: palette.lineSoft,
  },
  body: {
    flex: 1,
    borderRadius: radius.lg,
  },
  padded: {
    padding: spacing.lg,
  },
  sheen: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '55%',
    opacity: 0.6,
  },
});
