import { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { fonts, palette, spacing, typography } from '../../../shared/design/tokens';
import { withAlpha } from '../../../shared/design/theme';
import type { LogSeverity, MissionLogEntry } from '../../mission/types';

const SEVERITY_META: Record<LogSeverity, { color: string; label: string }> = {
  info: { color: palette.textMuted, label: 'INFO' },
  success: { color: palette.green, label: 'OK' },
  warning: { color: palette.amber, label: 'WARN' },
  critical: { color: palette.red, label: 'CRIT' },
};

export const MissionLogRow = memo(function MissionLogRow({ entry }: { entry: MissionLogEntry }) {
  const meta = SEVERITY_META[entry.severity];

  return (
    <View style={styles.row}>
      <View style={styles.rail}>
        <View style={[styles.dot, { backgroundColor: meta.color, shadowColor: meta.color }]} />
        <View style={[styles.dotHalo, { borderColor: withAlpha(meta.color, 0.3) }]} />
      </View>

      <View style={styles.content}>
        <View style={styles.metaRow}>
          <Text style={styles.timestamp}>
            SOL {String(entry.sol).padStart(3, '0')} · {entry.clock}
          </Text>
          <Text style={[styles.tag, { color: meta.color }]}>{meta.label}</Text>
        </View>
        <Text style={[styles.message, entry.severity === 'critical' && styles.criticalMessage]}>
          {entry.message}
        </Text>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingVertical: spacing.md,
  },
  rail: {
    width: 10,
    alignItems: 'center',
    paddingTop: 5,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    shadowOpacity: 1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 0 },
    zIndex: 2,
  },
  dotHalo: {
    position: 'absolute',
    top: 1,
    width: 13,
    height: 13,
    borderRadius: 7,
    borderWidth: StyleSheet.hairlineWidth,
  },
  content: {
    flex: 1,
    gap: 3,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  timestamp: {
    fontFamily: fonts.mono,
    fontSize: 9,
    letterSpacing: 1,
    color: palette.textMuted,
  },
  tag: {
    fontFamily: fonts.monoBold,
    fontSize: 8,
    letterSpacing: 1.2,
  },
  message: {
    ...typography.body,
    fontSize: 13,
    lineHeight: 19,
    color: palette.textSecondary,
  },
  criticalMessage: {
    color: palette.textPrimary,
  },
});
