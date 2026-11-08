import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import { Pressable, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { RootStackParamList } from '../../../app/navigation/types';
import { GlowCard } from '../../../shared/components/GlowCard';
import { NeonButton } from '../../../shared/components/NeonButton';
import { SectionHeader } from '../../../shared/components/SectionHeader';
import { SkiaBackground } from '../../../shared/components/SkiaBackground';
import { StatusPill } from '../../../shared/components/StatusPill';
import { haptics } from '../../../shared/design/haptics';
import { motiTiming } from '../../../shared/design/motion';
import {
  fonts,
  layout,
  palette,
  radius,
  spacing,
  typography,
} from '../../../shared/design/tokens';
import { withAlpha } from '../../../shared/design/theme';
import { BOOSTS, SYSTEM_DEFINITIONS } from '../../mission/constants';
import { useMetric, useSystemHistory } from '../../mission/hooks/useMissionClock';
import { useMissionStore } from '../../mission/store/missionStore';
import type { SystemKey } from '../../mission/types';
import { Sparkline } from '../../telemetry/components/Sparkline';
import { TelemetryGauge } from '../../telemetry/components/TelemetryGauge';

type Props = NativeStackScreenProps<RootStackParamList, 'SystemDetail'>;

const NOTES: Record<SystemKey, readonly string[]> = {
  lifeSupport: [
    'Scrubber efficiency falls after three consecutive power dips.',
    'Water recycling recovers 92% of cabin humidity each cycle.',
    'Keep reserve O₂ above 30% before any EVA window.',
  ],
  power: [
    'Solar wings produce 18% less during dust events.',
    'Battery banks lose 0.06% capacity per simulated minute.',
    'Hydroponics and shielding draw from the same reserve.',
  ],
  radiation: [
    'Regolith density above 70% blocks most particle events.',
    'Fractures spread during rapid pressure changes.',
    'Crew dose accumulates during unsheltered EVAs.',
  ],
  hydroponics: [
    'Grow lights draw 5% of the base power budget.',
    'Yield drops sharply below 40% system health.',
    'Blight spreads one tray per simulated hour if ignored.',
  ],
  crew: [
    'Sleep debt compounds faster than physical fatigue.',
    'Food variety is the strongest morale lever in sim.',
    'Two consecutive critical drills trigger cohesion risk.',
  ],
};

export function SystemDetailScreen({ navigation, route }: Props) {
  const { system } = route.params;
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const definition = SYSTEM_DEFINITIONS[system];
  const value = useMetric(system);
  const history = useSystemHistory(system);
  const power = useMetric('power');
  const applyBoost = useMissionStore((state) => state.applyBoost);
  const boost = BOOSTS[system];

  const status =
    value < 30 ? 'CRITICAL' : value < 55 ? 'WATCH' : 'STABLE';
  const statusColor =
    value < 30 ? palette.red : value < 55 ? palette.amber : definition.color;
  const chartWidth = Math.max(180, width - layout.screenPadding * 2 - spacing.lg * 2);
  const canBoost = system === 'power' || power >= boost.powerCost;

  return (
    <View style={styles.root}>
      <SkiaBackground
        accent={definition.color}
        variant={value < 30 ? 'emergency' : 'default'}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: insets.top + spacing.sm,
          paddingHorizontal: layout.screenPadding,
          paddingBottom: insets.bottom + spacing.xxxl,
        }}
      >
        <View style={styles.header}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Go back to dashboard"
            hitSlop={12}
            onPress={() => {
              haptics.tap();
              navigation.goBack();
            }}
            style={styles.back}
          >
            <Ionicons name="chevron-back" size={20} color={palette.textPrimary} />
          </Pressable>

          <View style={styles.headerCopy}>
            <Text style={styles.eyebrow}>SYSTEM READOUT · {definition.shortLabel}</Text>
            <Text style={styles.title}>{definition.label}</Text>
          </View>

          <StatusPill label={status} color={statusColor} compact />
        </View>

        <MotiView
          from={{ opacity: 0, translateY: 18 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={motiTiming(420)}
        >
          <GlowCard accent={definition.color} padded={false} style={styles.hero}>
            <LinearGradient
              colors={[withAlpha(definition.color, 0.16), 'transparent']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.heroInner}>
              <TelemetryGauge
                value={value}
                color={statusColor}
                size={142}
                strokeWidth={10}
                unit={definition.unit}
              />
              <View style={styles.heroCopy}>
                <View style={styles.iconRow}>
                  <View
                    style={[
                      styles.iconBadge,
                      {
                        backgroundColor: withAlpha(definition.color, 0.16),
                        borderColor: withAlpha(definition.color, 0.35),
                      },
                    ]}
                  >
                    <Ionicons
                      name={definition.icon as keyof typeof Ionicons.glyphMap}
                      size={16}
                      color={definition.color}
                    />
                  </View>
                  <Text style={[styles.statusLabel, { color: statusColor }]}>
                    {status}
                  </Text>
                </View>
                <Text style={styles.blurb}>{definition.blurb}</Text>
                <Text style={styles.threshold}>
                  CRITICAL BELOW {definition.criticalAt}% · LIVE SIMULATION
                </Text>
              </View>
            </View>
          </GlowCard>
        </MotiView>

        <View style={styles.section}>
          <SectionHeader eyebrow="TREND" title="Last 48 minutes" icon="analytics" />
          <GlowCard accent={definition.color} delay={80}>
            <View style={styles.chartHeader}>
              <Text style={styles.chartValue}>{Math.round(value)}%</Text>
              <Text style={styles.chartDelta}>
                {history.length > 1
                  ? `${value - history[history.length - 2] >= 0 ? '+' : ''}${(
                      value - history[history.length - 2]
                    ).toFixed(1)} / min`
                  : 'STABLE'}
              </Text>
            </View>
            <Sparkline data={history} color={definition.color} width={chartWidth} height={112} />
            <View style={styles.chartFooter}>
              <Text style={styles.chartLabel}>-48 MIN</Text>
              <Text style={styles.chartLabel}>NOW</Text>
            </View>
          </GlowCard>
        </View>

        <View style={styles.section}>
          <SectionHeader eyebrow="FIELD ACTION" title="Stabilize system" icon="construct" />
          <GlowCard accent={definition.color} delay={120}>
            <View style={styles.actionHeader}>
              <View style={styles.actionCopy}>
                <Text style={styles.actionTitle}>{boost.label}</Text>
                <Text style={styles.actionDetail}>{boost.detail}</Text>
              </View>
              <View style={styles.actionDelta}>
                <Text style={[styles.actionDeltaValue, { color: definition.color }]}>
                  +{boost.delta}
                </Text>
                <Text style={styles.actionDeltaLabel}>{definition.unit}</Text>
              </View>
            </View>

            <View style={styles.costRow}>
              <Ionicons name="flash" size={12} color={palette.amber} />
              <Text style={styles.costText}>
                {boost.powerCost === 0
                  ? 'NO POWER COST · GRID CHARGE'
                  : `COSTS ${boost.powerCost}% POWER · ${Math.round(power)}% AVAILABLE`}
              </Text>
            </View>

            <NeonButton
              label={canBoost ? 'EXECUTE ACTION' : 'INSUFFICIENT POWER'}
              icon={canBoost ? 'play' : 'lock-closed'}
              disabled={!canBoost}
              onPress={() => {
                const applied = applyBoost(system);
                if (applied) haptics.confirm();
                else haptics.error();
              }}
              style={styles.actionButton}
            />
            {!canBoost ? (
              <Text style={styles.warning}>
                Route power back to the grid before running this procedure.
              </Text>
            ) : null}
          </GlowCard>
        </View>

        <View style={styles.section}>
          <SectionHeader eyebrow="FIELD NOTES" title="Commander's checklist" icon="book" />
          <GlowCard accent={palette.cyan} delay={160}>
            <View style={styles.notes}>
              {NOTES[system].map((note, index) => (
                <View key={note} style={styles.noteRow}>
                  <Text style={styles.noteIndex}>0{index + 1}</Text>
                  <Text style={styles.noteText}>{note}</Text>
                </View>
              ))}
            </View>
          </GlowCard>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: palette.voidBlack,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  back: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: palette.line,
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  headerCopy: {
    flex: 1,
    gap: 2,
  },
  eyebrow: {
    ...typography.micro,
    color: palette.textMuted,
  },
  title: {
    ...typography.headline,
    fontSize: 22,
    lineHeight: 26,
    color: palette.white,
  },
  hero: {
    borderRadius: radius.xl,
  },
  heroInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    padding: spacing.lg,
  },
  heroCopy: {
    flex: 1,
    gap: spacing.sm,
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  iconBadge: {
    width: 30,
    height: 30,
    borderRadius: 9,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusLabel: {
    fontFamily: fonts.monoBold,
    fontSize: 9,
    letterSpacing: 1.4,
  },
  blurb: {
    ...typography.body,
    fontSize: 12,
    lineHeight: 18,
    color: palette.textSecondary,
  },
  threshold: {
    fontFamily: fonts.monoMedium,
    fontSize: 8,
    lineHeight: 12,
    letterSpacing: 0.8,
    color: palette.textMuted,
  },
  section: {
    marginTop: spacing.xxl,
    gap: spacing.sm,
  },
  chartHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  chartValue: {
    fontFamily: fonts.display,
    fontSize: 26,
    letterSpacing: -0.8,
    color: palette.textPrimary,
  },
  chartDelta: {
    fontFamily: fonts.mono,
    fontSize: 9,
    letterSpacing: 0.7,
    color: palette.textMuted,
  },
  chartFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
  },
  chartLabel: {
    ...typography.micro,
    fontSize: 8,
    color: palette.textMuted,
  },
  actionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },
  actionCopy: {
    flex: 1,
    gap: spacing.xs,
  },
  actionTitle: {
    ...typography.title,
    fontSize: 17,
    color: palette.textPrimary,
  },
  actionDetail: {
    ...typography.body,
    fontSize: 12,
    lineHeight: 18,
    color: palette.textSecondary,
  },
  actionDelta: {
    alignItems: 'flex-end',
  },
  actionDeltaValue: {
    fontFamily: fonts.display,
    fontSize: 26,
    letterSpacing: -0.8,
  },
  actionDeltaLabel: {
    ...typography.micro,
    fontSize: 8,
    color: palette.textMuted,
  },
  costRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.md,
  },
  costText: {
    fontFamily: fonts.monoMedium,
    fontSize: 8,
    letterSpacing: 0.8,
    color: palette.textMuted,
  },
  actionButton: {
    marginTop: spacing.lg,
  },
  warning: {
    ...typography.mono,
    fontSize: 9,
    lineHeight: 13,
    color: palette.amber,
    marginTop: spacing.sm,
  },
  notes: {
    gap: spacing.md,
  },
  noteRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  noteIndex: {
    fontFamily: fonts.monoBold,
    fontSize: 9,
    color: palette.cyan,
    letterSpacing: 1,
    paddingTop: 3,
  },
  noteText: {
    ...typography.body,
    flex: 1,
    fontSize: 12,
    lineHeight: 18,
    color: palette.textSecondary,
  },
});
