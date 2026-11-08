import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { haptics } from '../design/haptics';
import { fonts, palette, spacing, typography } from '../design/tokens';

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: ComponentProps<typeof Ionicons>['name'];
}

export function SectionHeader({
  eyebrow,
  title,
  actionLabel,
  onAction,
  icon,
}: SectionHeaderProps) {
  return (
    <View style={styles.row}>
      <View style={styles.titleGroup}>
        {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
        <View style={styles.titleRow}>
          {icon ? <Ionicons name={icon} size={16} color={palette.textSecondary} /> : null}
          <Text style={styles.title}>{title}</Text>
        </View>
      </View>
      {actionLabel && onAction ? (
        <Pressable
          accessibilityRole="button"
          hitSlop={10}
          onPress={() => {
            haptics.select();
            onAction();
          }}
          style={({ pressed }) => [styles.action, pressed && styles.actionPressed]}
        >
          <Text style={styles.actionLabel}>{actionLabel}</Text>
          <Ionicons name="chevron-forward" size={13} color={palette.cyan} />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
    gap: spacing.md,
  },
  titleGroup: {
    flex: 1,
    gap: spacing.xs,
  },
  eyebrow: {
    ...typography.micro,
    color: palette.textMuted,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  title: {
    ...typography.title,
    color: palette.textPrimary,
  },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xxs,
    paddingVertical: spacing.xs,
  },
  actionPressed: {
    opacity: 0.6,
  },
  actionLabel: {
    fontFamily: fonts.monoMedium,
    fontSize: 10,
    letterSpacing: 1.1,
    color: palette.cyan,
    textTransform: 'uppercase',
  },
});
