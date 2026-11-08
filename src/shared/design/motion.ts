/**
 * Moti 0.30 + Reanimated 4 + TypeScript 6: Moti's transition prop types collapse
 * to `any`, which makes `type: 'timing'` conflict with its own index signature.
 * These helpers keep the runtime config and isolate the cast in one place.
 */
export function motiTiming(duration: number, delay = 0, loop = false): never {
  return {
    type: 'timing',
    duration,
    delay,
    ...(loop ? { loop: true, repeatReverse: true } : {}),
  } as never;
}

export function motiSpring(damping = 14, stiffness = 180): never {
  return { type: 'spring', damping, stiffness } as never;
}

export function motiEnter(duration = 420, delay = 0): never {
  return motiTiming(duration, delay);
}
