import { FlashList } from '@shopify/flash-list';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useCallback, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { RootStackParamList } from '../../../app/navigation/types';
import { SkiaBackground } from '../../../shared/components/SkiaBackground';
import { layout, palette, spacing, typography } from '../../../shared/design/tokens';
import { EmergencySheet } from '../../emergency/components/EmergencySheet';
import { useMissionEngine } from '../../mission/hooks/useMissionEngine';
import { useMissionStore } from '../../mission/store/missionStore';
import type { MissionLogEntry, SystemKey } from '../../mission/types';
import { MissionLogRow } from '../../mission-log/components/MissionLogRow';
import { DashboardHeader, type LogFilter } from '../components/DashboardHeader';
import { MissionFailedOverlay } from '../components/MissionFailedOverlay';

type Props = NativeStackScreenProps<RootStackParamList, 'Main'>;

const Separator = () => <View style={styles.separator} />;

export function DashboardScreen({ navigation }: Props) {
  useMissionEngine();
  const insets = useSafeAreaInsets();
  const [filter, setFilter] = useState<LogFilter>('all');

  const logs = useMissionStore((state) => state.logs);
  const status = useMissionStore((state) => state.status);
  const activeEmergency = useMissionStore((state) => state.activeEmergency);

  const filteredLogs = useMemo(
    () =>
      filter === 'all'
        ? logs
        : logs.filter(
            (entry) => entry.severity === 'warning' || entry.severity === 'critical',
          ),
    [filter, logs],
  );

  const alertCount = useMemo(
    () =>
      logs.reduce(
        (count, entry) =>
          entry.severity === 'warning' || entry.severity === 'critical' ? count + 1 : count,
        0,
      ),
    [logs],
  );

  const openSystem = useCallback(
    (system: SystemKey) => {
      navigation.navigate('SystemDetail', { system });
    },
    [navigation],
  );

  const runDrill = useCallback(() => {
    useMissionStore.getState().triggerEmergency();
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: MissionLogEntry }) => <MissionLogRow entry={item} />,
    [],
  );

  const variant =
    activeEmergency || status === 'critical' || status === 'failed' ? 'emergency' : 'default';

  return (
    <View style={styles.root}>
      <SkiaBackground variant={variant} accent={variant === 'emergency' ? palette.red : palette.cyan} />

      <FlashList
        data={filteredLogs}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: insets.top + spacing.xs,
          paddingHorizontal: layout.screenPadding,
          paddingBottom: insets.bottom + spacing.huge,
        }}
        ListHeaderComponent={
          <DashboardHeader
            filter={filter}
            onChangeFilter={setFilter}
            onOpenSystem={openSystem}
            onRunDrill={runDrill}
            logCount={logs.length}
            alertCount={alertCount}
          />
        }
        ItemSeparatorComponent={Separator}
        ListFooterComponent={
          <View style={styles.footer}>
            <View style={styles.footerLine} />
            <Text style={styles.footerText}>END OF TRANSMISSION · JAMT BLACK BOX</Text>
          </View>
        }
        ListEmptyComponent={
          <Text style={styles.empty}>No entries match this filter yet.</Text>
        }
      />

      <EmergencySheet />
      <MissionFailedOverlay />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: palette.voidBlack,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: palette.lineSoft,
    marginLeft: 22,
  },
  footer: {
    alignItems: 'center',
    gap: spacing.md,
    paddingTop: spacing.xl,
  },
  footerLine: {
    width: 38,
    height: 1,
    backgroundColor: palette.line,
  },
  footerText: {
    ...typography.micro,
    fontSize: 8,
    color: palette.textMuted,
    letterSpacing: 1.4,
  },
  empty: {
    ...typography.mono,
    color: palette.textMuted,
    paddingVertical: spacing.xl,
  },
});
