import type { ComponentProps } from 'react';
import { Ionicons } from '@expo/vector-icons';

import { palette } from '../../../shared/design/tokens';

export interface OnboardingSlide {
  id: string;
  kicker: string;
  title: string;
  body: string;
  accent: string;
  icon: ComponentProps<typeof Ionicons>['name'];
}

export const ONBOARDING_SLIDES: readonly OnboardingSlide[] = [
  {
    id: 'command',
    kicker: 'MISSION 01 / COMMAND',
    title: 'Take command of\nArtemis Base.',
    body: 'You are the Mission Commander. Six astronauts, one habitat, and a 24-minute sol to keep everything alive.',
    accent: palette.cyan,
    icon: 'planet',
  },
  {
    id: 'systems',
    kicker: 'MISSION 02 / SYSTEMS',
    title: 'Balance five\ncritical systems.',
    body: 'Oxygen, power, radiation shielding, food and morale are connected. Push one too hard and the others feel it.',
    accent: palette.green,
    icon: 'pulse',
  },
  {
    id: 'unknown',
    kicker: 'MISSION 03 / THE UNKNOWN',
    title: 'Expect the\nunexpected.',
    body: 'Leaks, solar flares and crew conflicts will test your judgement. Every drill is logged. Every choice matters.',
    accent: palette.amber,
    icon: 'warning',
  },
] as const;
