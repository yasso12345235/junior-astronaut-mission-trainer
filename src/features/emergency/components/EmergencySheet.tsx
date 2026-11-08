import { Ionicons } from '@expo/vector-icons';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
  type BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';
import LottieView from 'lottie-react-native';
import { MotiView } from 'moti';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { NeonButton } from '../../../shared/components/NeonButton';
import { StatusPill } from '../../../shared/components/StatusPill';
import { haptics } from '../../../shared/design/haptics';
import { motiSpring, motiTiming } from '../../../shared/design/motion';
import { fonts, palette, radius, spacing, typography } from '../../../shared/design/tokens';
import { withAlpha } from '../../../shared/design/theme';
import { SYSTEM_DEFINITIONS } from '../../mission/constants';
import { useMissionStore } from '../../mission/store/missionStore';
import type { EmergencyChoice, SystemKey } from '../../mission/types';
import { TelemetryGauge } from '../../telemetry/components/TelemetryGauge';

const TONE_META = {
  safe: { color: palette.green, label: 'SAFE' },
  balanced: { color: palette.cyan, label: 'BALANCED' },
  risky: { color: palette.red, label: 'RISKY' },
} as const;

export function EmergencySheet() {
  const sheetRef = useRef<BottomSheetModal>(null);
  const active = useMissionStore((state) => state.activeEmergency);
  const resolution = useMissionStore((state) => state.lastResolution);
  const resolveEmergency = useMissionStore((state) => state.resolveEmergency);
  const dismissResolution = useMissionStore((state) => state.dismissResolution);
  const [remaining, setRemaining] = useState(0);
  const [trackedEmergencyId, setTrackedEmergencyId] = useState<string | null>(null);

  const snapPoints = useMemo(() => ['84%'], []);

  // Reset the timer during render (the documented "adjust state on prop change"
  // pattern) so the effect below only handles side effects.
  if (active && active.id !== trackedEmergencyId) {
    setTrackedEmergencyId(active.id);
    setRemaining(active.windowSeconds);
  }

  useEffect(() => {
    if (!active) return;
    sheetRef.current?.present();
    haptics.emergency();
  }, [active]);

  useEffect(() => {
    if (!active && !resolution) sheetRef.current?.dismiss();
  }, [active, resolution]);

  useEffect(() => {
    if (!active || resolution) return;

    const startedAt = Date.now();

    const interval = setInterval(() => {
      const elapsed = (Date.now() - startedAt) / 1000;
      const left = Math.max(0, active.windowSeconds - elapsed);
      setRemaining(left);

      if (left <= 0) {
        clearInterval(interval);
        haptics.error();
        resolveEmergency(active.choices[active.choices.length - 1].id, true);
      }
    }, 200);

    return () => clearInterval(interval);
  }, [active, resolution, resolveEmergency]);

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        opacity={0.78}
        pressBehavior="none"
      />
    ),
    [],
  );

  return (
    <BottomSheetModal
      ref={sheetRef}
      snapPoints={snapPoints}
      index={0}
      enablePanDownToClose={false}
      backdropComponent={renderBackdrop}
      backgroundStyle={styles.sheetBackground}
      handleIndicatorStyle={styles.handle}
      onDismiss={dismissResolution}
    >
      <BottomSheetScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {resolution ? (
          <ResolutionView />
        ) : active ? (
          <>
            <View style={styles.alertMeta}>
              <StatusPill
                label={active.severity === 'critical' ? 'Priority alpha' : 'Priority bravo'}
                color={active.severity === 'critical' ? palette.red : palette.amber}
                compact
              />
              <Text style={styles.code}>{active.code}</Text>
            </View>

            <Text style={styles.title}>{active.title}</Text>
            <Text style={styles.description}>{active.description}</Text>

            <View style={styles.timerRow}>
              <TelemetryGauge
                value={remaining}
                max={active.windowSeconds}
                color={remaining < 6 ? palette.red : palette.amber}
                size={68}
                strokeWidth={5}
                unit="SEC"
              />
              <View style={styles.timerCopy}>
                <Text style={styles.timerLabel}>DECISION WINDOW</Text>
                <Text style={styles.timerValue}>{Math.ceil(remaining)} seconds left</Text>
                <Text style={styles.timerHint}>
                  Expiry auto-selects the riskiest option and logs it.
                </Text>
              </View>
            </View>

            <Text style={styles.sectionLabel}>CHOOSE A RESPONSE</Text>

            <View style={styles.choices}>
              {active.choices.map((choice, index) => (
                <ChoiceCard
                  key={choice.id}
                  choice={choice}
                  index={index}
                  onPress={() => resolveEmergency(choice.id)}
                />
              ))}
            </View>
          </>
        ) : null}
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
}

function ChoiceCard({
  choice,
  index,
  onPress,
}: {
  choice: EmergencyChoice;
  index: number;
  onPress: () => void;
}) {
  const tone = TONE_META[choice.tone];
  const effects = Object.entries(choice.effects) as [SystemKey, number][];

  return (
    <MotiView
      from={{ opacity: 0, translateY: 12 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={motiTiming(320, 80 + index * 60)}
    >
      <Pressable
        accessibilityRole="button"
        onPress={() => {
          haptics.press();
          onPress();
        }}
        style={({ pressed }) => [
          styles.choice,
          { borderColor: withAlpha(tone.color, 0.28) },
          pressed && { backgroundColor: withAlpha(tone.color, 0.1) },
        ]}
      >
        <View style={styles.choiceHeader}>
          <View style={[styles.toneTag, { backgroundColor: withAlpha(tone.color, 0.14) }]}>
            <View style={[styles.toneDot, { backgroundColor: tone.color }]} />
            <Text style={[styles.toneLabel, { color: tone.color }]}>{tone.label}</Text>
          </View>
          <Ionicons name="arrow-forward" size={14} color={palette.textMuted} />
        </View>

        <Text style={styles.choiceLabel}>{choice.label}</Text>
        <Text style={styles.choiceDetail}>{choice.detail}</Text>

        <View style={styles.effects}>
          {effects.map(([key, delta]) => (
            <View
              key={key}
              style={[
                styles.effect,
                {
                  backgroundColor: withAlpha(
                    delta >= 0 ? palette.green : palette.red,
                    0.1,
                  ),
                },
              ]}
            >
              <Text
                style={[
                  styles.effectText,
                  { color: delta >= 0 ? palette.green : palette.red },
                ]}
              >
                {SYSTEM_DEFINITIONS[key].shortLabel} {delta >= 0 ? '+' : ''}
                {delta}
              </Text>
            </View>
          ))}
        </View>
      </Pressable>
    </MotiView>
  );
}

function ResolutionView() {
  const resolution = useMissionStore((state) => state.lastResolution);
  const dismissResolution = useMissionStore((state) => state.dismissResolution);
  if (!resolution) return null;

  const { success, event, choice, score, timedOut } = resolution;
  const accent = success ? palette.green : palette.red;

  return (
    <View style={styles.result}>
      <MotiView
        from={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={motiSpring(14, 180)}
        style={styles.resultLottie}
      >
        <LottieView
          source={
            success
              ? require('../../../../assets/lottie/success.json')
              : require('../../../../assets/lottie/alert.json')
          }
          autoPlay
          loop={false}
          style={styles.lottie}
        />
      </MotiView>

      <Text style={[styles.resultKicker, { color: accent }]}>
        {timedOut ? 'WINDOW EXPIRED' : success ? 'DRILL RESOLVED' : 'DRILL FAILED'}
      </Text>
      <Text style={styles.resultTitle}>{choice.label}</Text>
      <Text style={styles.resultSummary}>{choice.summary}</Text>

      <View style={styles.resultStats}>
        <View style={styles.resultStat}>
          <Text style={styles.resultStatValue}>{score}</Text>
          <Text style={styles.resultStatLabel}>BASE INDEX</Text>
        </View>
        <View style={styles.resultDivider} />
        <View style={styles.resultStat}>
          <Text style={[styles.resultStatValue, { color: accent }]}>
            {success ? 'PASS' : 'FAIL'}
          </Text>
          <Text style={styles.resultStatLabel}>OUTCOME</Text>
        </View>
        <View style={styles.resultDivider} />
        <View style={styles.resultStat}>
          <Text style={styles.resultStatValue}>{event.code}</Text>
          <Text style={styles.resultStatLabel}>SCENARIO</Text>
        </View>
      </View>

      <View style={styles.resultChoices}>
        {event.choices.map((item) => {
          const selected = item.id === choice.id;
          return (
            <View
              key={item.id}
              style={[
                styles.resultChoiceRow,
                selected && { borderColor: withAlpha(accent, 0.4) },
              ]}
            >
              <Ionicons
                name={selected ? 'radio-button-on' : 'radio-button-off'}
                size={13}
                color={selected ? accent : palette.textMuted}
              />
              <Text
                style={[
                  styles.resultChoiceText,
                  selected && { color: palette.textPrimary },
                ]}
                numberOfLines={2}
              >
                {item.label}
              </Text>
            </View>
          );
        })}
      </View>

      <NeonButton
        label="LOG & CONTINUE"
        icon="checkmark"
        onPress={() => {
          haptics.select();
          dismissResolution();
        }}
        style={styles.resultCta}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  sheetBackground: {
    backgroundColor: '#0A0F18',
    borderTopLeftRadius: radius.xxl,
    borderTopRightRadius: radius.xxl,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: palette.line,
  },
  handle: {
    backgroundColor: palette.line,
    width: 42,
  },
  content: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  alertMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: spacing.xs,
  },
  code: {
    fontFamily: fonts.monoBold,
    fontSize: 10,
    letterSpacing: 1.6,
    color: palette.textMuted,
  },
  title: {
    ...typography.headline,
    fontSize: 27,
    lineHeight: 31,
    color: palette.white,
    marginTop: spacing.md,
  },
  description: {
    ...typography.body,
    color: palette.textSecondary,
    marginTop: spacing.sm,
  },
  timerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    marginTop: spacing.xl,
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: palette.line,
    backgroundColor: 'rgba(255,255,255,0.02)',
  },
  timerCopy: {
    flex: 1,
    gap: 3,
  },
  timerLabel: {
    ...typography.micro,
    fontSize: 8,
    color: palette.amber,
  },
  timerValue: {
    ...typography.title,
    fontSize: 17,
    color: palette.textPrimary,
  },
  timerHint: {
    ...typography.mono,
    fontSize: 9,
    lineHeight: 13,
    color: palette.textMuted,
  },
  sectionLabel: {
    ...typography.label,
    color: palette.textMuted,
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  choices: {
    gap: spacing.sm,
  },
  choice: {
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(255,255,255,0.025)',
    padding: spacing.md,
    gap: 4,
  },
  choiceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  toneTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.pill,
  },
  toneDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  toneLabel: {
    fontFamily: fonts.monoBold,
    fontSize: 8,
    letterSpacing: 1.1,
  },
  choiceLabel: {
    ...typography.title,
    fontSize: 16,
    lineHeight: 20,
    color: palette.textPrimary,
  },
  choiceDetail: {
    ...typography.body,
    fontSize: 12,
    lineHeight: 17,
    color: palette.textSecondary,
  },
  effects: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
  effect: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: 6,
  },
  effectText: {
    fontFamily: fonts.monoMedium,
    fontSize: 8,
    letterSpacing: 0.6,
  },
  result: {
    alignItems: 'center',
    paddingTop: spacing.lg,
  },
  resultLottie: {
    width: 150,
    height: 150,
    marginBottom: -16,
  },
  lottie: {
    width: '100%',
    height: '100%',
  },
  resultKicker: {
    ...typography.label,
    letterSpacing: 2.2,
  },
  resultTitle: {
    ...typography.headline,
    color: palette.white,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  resultSummary: {
    ...typography.body,
    color: palette.textSecondary,
    textAlign: 'center',
    marginTop: spacing.sm,
    maxWidth: 330,
  },
  resultStats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xl,
    width: '100%',
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: palette.line,
    backgroundColor: 'rgba(255,255,255,0.02)',
  },
  resultStat: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  resultStatValue: {
    fontFamily: fonts.display,
    fontSize: 19,
    letterSpacing: -0.4,
    color: palette.textPrimary,
  },
  resultStatLabel: {
    ...typography.micro,
    fontSize: 8,
    color: palette.textMuted,
  },
  resultDivider: {
    width: StyleSheet.hairlineWidth,
    height: 26,
    backgroundColor: palette.lineSoft,
  },
  resultChoices: {
    width: '100%',
    gap: spacing.xs,
    marginTop: spacing.lg,
  },
  resultChoiceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.sm,
    borderRadius: radius.sm,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'transparent',
    backgroundColor: 'rgba(255,255,255,0.02)',
  },
  resultChoiceText: {
    ...typography.body,
    fontSize: 12,
    lineHeight: 16,
    color: palette.textMuted,
    flex: 1,
  },
  resultCta: {
    width: '100%',
    marginTop: spacing.xl,
  },
});
