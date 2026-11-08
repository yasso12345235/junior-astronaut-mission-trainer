import { BlurMask, Canvas, Path, Skia } from '@shopify/react-native-skia';
import { memo, useEffect, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Easing, useSharedValue, withTiming } from 'react-native-reanimated';

import { fonts, palette } from '../../../shared/design/tokens';

interface TelemetryGaugeProps {
  value: number;
  color: string;
  size?: number;
  strokeWidth?: number;
  unit?: string;
  decimals?: number;
  max?: number;
}

/**
 * Native-thread Skia gauge. The arc trim is driven by a Reanimated shared value,
 * so progress animation never touches the JS thread.
 */
export const TelemetryGauge = memo(function TelemetryGauge({
  value,
  color,
  size = 104,
  strokeWidth = 8,
  unit = '%',
  decimals = 0,
  max = 100,
}: TelemetryGaugeProps) {
  const inset = strokeWidth / 2 + 2;
  const progress = useSharedValue(Math.min(1, Math.max(0, value / max)));

  const arc = useMemo(
    () =>
      Skia.PathBuilder.Make()
        .addArc(
          Skia.XYWHRect(inset, inset, size - inset * 2, size - inset * 2),
          135,
          270,
        )
        .detach(),
    [inset, size],
  );

  useEffect(() => {
    progress.value = withTiming(Math.min(1, Math.max(0, value / max)), {
      duration: 850,
      easing: Easing.out(Easing.cubic),
    });
  }, [max, progress, value]);

  return (
    <View style={[styles.wrapper, { width: size, height: size }]}>
      <Canvas style={StyleSheet.absoluteFill}>
        <Path
          path={arc}
          style="stroke"
          strokeWidth={strokeWidth}
          strokeCap="round"
          color="rgba(255,255,255,0.075)"
        />
        <Path
          path={arc}
          style="stroke"
          strokeWidth={strokeWidth * 2.6}
          strokeCap="round"
          color={color}
          start={0}
          end={progress}
          opacity={0.28}
        >
          <BlurMask blur={10} style="solid" respectCTM={false} />
        </Path>
        <Path
          path={arc}
          style="stroke"
          strokeWidth={strokeWidth}
          strokeCap="round"
          color={color}
          start={0}
          end={progress}
        />
      </Canvas>
      <View style={styles.center} pointerEvents="none">
        <Text style={styles.value} numberOfLines={1} adjustsFontSizeToFit>
          {value.toFixed(decimals)}
        </Text>
        <Text style={[styles.unit, { color }]}>{unit}</Text>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: {
    fontFamily: fonts.display,
    fontSize: 26,
    lineHeight: 28,
    letterSpacing: -1,
    color: palette.white,
  },
  unit: {
    fontFamily: fonts.monoMedium,
    fontSize: 9,
    letterSpacing: 1.2,
    marginTop: 2,
  },
});
