import { Canvas, Fill, Shader, Skia } from '@shopify/react-native-skia';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import { useEffect, useMemo } from 'react';
import { Platform, StyleSheet, useWindowDimensions, View } from 'react-native';
import { Easing, useDerivedValue, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';

import { motiTiming } from '../design/motion';
import { palette } from '../design/tokens';
import { withAlpha } from '../design/theme';

interface SkiaBackgroundProps {
  /** Emergency mode warms the nebula and lays a red alert wash over the scene. */
  variant?: 'default' | 'emergency';
  accent?: string;
  intensity?: number;
}

const SKSL = `
uniform float2 uResolution;
uniform float uTime;
uniform float3 uColorA;
uniform float3 uColorB;
uniform float uIntensity;

half4 main(float2 fragCoord) {
  float2 uv = fragCoord / max(uResolution, float2(1.0));
  float aspect = uResolution.x / max(uResolution.y, 1.0);
  float2 p = uv - 0.5;
  p.x *= aspect;

  float d = length(p);
  float vignette = 1.0 - smoothstep(0.05, 0.95, d);

  float wave = sin(p.x * 5.5 + uTime * 0.45) * cos(p.y * 6.5 - uTime * 0.35);
  wave += 0.55 * sin((p.x + p.y) * 10.0 + uTime * 0.8);
  float mixMask = smoothstep(-0.9, 0.9, wave) * 0.55;

  float3 col = mix(uColorB, uColorA * 0.55, mixMask);
  col += uColorA * pow(vignette, 2.4) * 0.12;

  float2 grid = uv * 260.0;
  float2 cell = floor(grid);
  float2 local = fract(grid) - 0.5;
  float rnd = fract(sin(dot(cell, float2(12.9898, 78.233))) * 43758.5453);
  float star = (1.0 - smoothstep(0.0, 0.065, length(local))) * step(0.982, rnd);
  float twinkle = 0.5 + 0.5 * sin(uTime * 1.8 + rnd * 30.0);
  col += star * twinkle * 0.9;

  float scan = 1.0 - smoothstep(0.0, 0.02, abs(uv.y - fract(uTime * 0.03)));
  col += uColorA * scan * 0.03;

  col *= 0.82 + 0.18 * vignette;
  return half4(col * uIntensity, 1.0);
}
`;

const COLORS = {
  cyan: [0, 0.941, 1] as const,
  red: [1, 0.2, 0.4] as const,
};

export function SkiaBackground({
  variant = 'default',
  accent = palette.cyan,
  intensity = 1,
}: SkiaBackgroundProps) {
  const { width, height } = useWindowDimensions();
  const clock = useSharedValue(0);
  const isWeb = Platform.OS === 'web';
  const shader = useMemo(() => {
    if (isWeb) return null;
    try {
      return Skia?.RuntimeEffect?.Make ? Skia.RuntimeEffect.Make(SKSL) : null;
    } catch {
      return null;
    }
  }, [isWeb]);

  useEffect(() => {
    clock.value = withRepeat(
      withTiming(1, { duration: 48000, easing: Easing.linear }),
      -1,
      false,
    );
  }, [clock]);

  const isEmergency = variant === 'emergency';
  const tint = isEmergency ? COLORS.red : COLORS.cyan;

  // Skia reads animated props as shared values on the UI thread, so the whole
  // uniform bag is derived from the clock to keep the nebula ticking natively.
  const uniforms = useDerivedValue(() => ({
    uResolution: [width, height],
    uTime: clock.value,
    uColorA: [tint[0], tint[1], tint[2]],
    uColorB: [0.043, 0.055, 0.078],
    uIntensity: intensity,
  }));

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {shader ? (
        <Canvas style={StyleSheet.absoluteFill}>
          <Fill>
            <Shader source={shader} uniforms={uniforms as unknown as never} />
          </Fill>
        </Canvas>
      ) : (
        <LinearGradient
          colors={[palette.spaceBlue, palette.voidBlack]}
          style={StyleSheet.absoluteFill}
        />
      )}

      <View
        style={[
          styles.haze,
          {
            backgroundColor: withAlpha(accent, isEmergency ? 0.1 : 0.07),
            width: width * 1.2,
            height: width * 1.2,
            borderRadius: width,
          },
        ]}
      />

      <LinearGradient
        colors={['rgba(5,7,9,0.05)', 'rgba(5,7,9,0.62)', 'rgba(5,7,9,0.94)']}
        locations={[0, 0.55, 1]}
        style={StyleSheet.absoluteFill}
      />

      <MotiView
        animate={{ opacity: isEmergency ? 1 : 0 }}
        transition={motiTiming(420)}
        style={StyleSheet.absoluteFill}
      >
        <LinearGradient
          colors={['rgba(255,51,102,0.16)', 'rgba(255,51,102,0.02)', 'rgba(255,184,0,0.06)']}
          style={StyleSheet.absoluteFill}
        />
      </MotiView>
    </View>
  );
}

const styles = StyleSheet.create({
  haze: {
    position: 'absolute',
    top: -220,
    left: '-20%',
    opacity: 0.9,
  },
});
