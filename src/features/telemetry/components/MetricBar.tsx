import { memo, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { withAlpha } from '../../../shared/design/theme';

interface MetricBarProps {
  value: number;
  color: string;
  height?: number;
}

/** Native-thread progress bar. Width is measured once, then animated in px. */
export const MetricBar = memo(function MetricBar({ value, color, height = 5 }: MetricBarProps) {
  const [trackWidth, setTrackWidth] = useState(0);
  const width = useSharedValue(0);

  useEffect(() => {
    if (trackWidth === 0) return;
    width.value = withTiming((Math.min(100, Math.max(0, value)) / 100) * trackWidth, {
      duration: 700,
      easing: Easing.out(Easing.cubic),
    });
  }, [trackWidth, value, width]);

  const animatedStyle = useAnimatedStyle(() => ({ width: width.value }));

  return (
    <View
      style={[styles.track, { height, borderRadius: height / 2 }]}
      onLayout={(event) => setTrackWidth(event.nativeEvent.layout.width)}
    >
      <Animated.View
        style={[
          styles.fill,
          animatedStyle,
          { backgroundColor: color, shadowColor: color, borderRadius: height / 2 },
        ]}
      />
      <View style={[styles.tick, { left: '55%' }]} />
      <View style={[styles.tick, { left: '30%' }]} />
      <View style={[styles.base, { backgroundColor: withAlpha(color, 0.16) }]} />
    </View>
  );
});

const styles = StyleSheet.create({
  track: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.06)',
    overflow: 'hidden',
    justifyContent: 'center',
  },
  fill: {
    height: '100%',
    shadowOpacity: 0.9,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 0 },
    elevation: 2,
  },
  base: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: -1,
  },
  tick: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(5,7,9,0.65)',
  },
});
