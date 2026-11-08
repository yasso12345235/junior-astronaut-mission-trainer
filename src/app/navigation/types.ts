import type { SystemKey } from '../../features/mission/types';

export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Main: undefined;
  SystemDetail: { system: SystemKey };
};
