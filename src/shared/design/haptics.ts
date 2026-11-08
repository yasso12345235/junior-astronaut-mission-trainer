import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

/**
 * Premium, failure-safe haptic wrapper.
 * All critical actions, toggles and emergency confirmations must call this,
 * never expo-haptics directly. Web is a no-op.
 */
const enabled = Platform.OS === 'ios' || Platform.OS === 'android';

function run(action: () => Promise<void>): void {
  if (!enabled) return;
  action().catch(() => {
    // Haptics can fail on silent mode, older devices or simulator builds.
  });
}

export const haptics = {
  select: () => run(() => Haptics.selectionAsync()),
  tap: () => run(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)),
  press: () => run(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)),
  heavy: () => run(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)),
  success: () => run(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)),
  warning: () => run(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning)),
  error: () => run(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)),
  emergency: () =>
    run(async () => {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }),
  confirm: () =>
    run(async () => {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }),
} as const;

export type HapticsApi = typeof haptics;
