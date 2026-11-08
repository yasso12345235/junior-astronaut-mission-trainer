import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { DashboardScreen } from '../../features/dashboard/screens/DashboardScreen';
import { OnboardingScreen } from '../../features/onboarding/screens/OnboardingScreen';
import { SplashScreen } from '../../features/splash/screens/SplashScreen';
import { SystemDetailScreen } from '../../features/systems/screens/SystemDetailScreen';
import { palette } from '../../shared/design/tokens';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: palette.voidBlack },
        animation: 'fade',
        animationDuration: 260,
      }}
    >
      <Stack.Screen name="Splash" component={SplashScreen} options={{ animation: 'none' }} />
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="Main" component={DashboardScreen} options={{ animation: 'fade' }} />
      <Stack.Screen
        name="SystemDetail"
        component={SystemDetailScreen}
        options={{ animation: 'slide_from_right', gestureEnabled: true }}
      />
    </Stack.Navigator>
  );
}
