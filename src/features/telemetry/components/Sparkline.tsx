import { Canvas, Circle, Path, Skia } from '@shopify/react-native-skia';
import { memo, useMemo } from 'react';

import { withAlpha } from '../../../shared/design/theme';

interface SparklineProps {
  data: readonly number[];
  color: string;
  width: number;
  height?: number;
}

/** Lightweight static trend line rendered on the Skia canvas. */
export const Sparkline = memo(function Sparkline({
  data,
  color,
  width,
  height = 104,
}: SparklineProps) {
  const geometry = useMemo(() => {
    const points = data.length > 1 ? data : [data[0] ?? 0, data[0] ?? 0];
    const min = Math.min(...points, 0);
    const max = Math.max(...points, 100);
    const range = Math.max(1, max - min);
    const pad = 6;
    const innerHeight = height - pad * 2;

    const coords = points.map((value, index) => ({
      x: (index / (points.length - 1)) * width,
      y: pad + innerHeight - ((value - min) / range) * innerHeight,
    }));

    const line = Skia.PathBuilder.Make();
    coords.forEach((point, index) => {
      if (index === 0) line.moveTo(point.x, point.y);
      else line.lineTo(point.x, point.y);
    });

    const area = Skia.PathBuilder.Make();
    area.moveTo(coords[0]?.x ?? 0, height);
    coords.forEach((point) => area.lineTo(point.x, point.y));
    area.lineTo(coords[coords.length - 1]?.x ?? 0, height);
    area.close();

    return {
      line: line.detach(),
      area: area.detach(),
      last: coords[coords.length - 1],
    };
  }, [data, height, width]);

  return (
    <Canvas style={{ width, height }}>
      <Path path={geometry.area} style="fill" color={withAlpha(color, 0.12)} />
      <Path path={geometry.line} style="stroke" strokeWidth={2.2} strokeCap="round" strokeJoin="round" color={color} />
      {geometry.last ? (
        <>
          <Circle cx={geometry.last.x} cy={geometry.last.y} r={7} color={withAlpha(color, 0.22)} />
          <Circle cx={geometry.last.x} cy={geometry.last.y} r={3.2} color={color} />
        </>
      ) : null}
    </Canvas>
  );
});
