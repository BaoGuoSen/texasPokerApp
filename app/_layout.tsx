import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import * as ScreenOrientation from 'expo-screen-orientation';
import { useEffect } from 'react';
import {
  configureReanimatedLogger,
  ReanimatedLogLevel
} from 'react-native-reanimated';

import { UserProvider } from '@/contexts/UserContext';
import { ErrorProvider } from '@/contexts/ErrorContext';

// This is the default configuration
configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  // Reanimated runs in strict mode by default
  strict: false
});

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf')
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    ScreenOrientation.lockAsync(
      ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT
    );
  }, []);

  if (!loaded) {
    return null;
  }

  return (
    <UserProvider>
      <ErrorProvider>
        <Stack
          screenOptions={{
            // 禁用所有屏幕的返回手势
            gestureEnabled: false
          }}
        >
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen
            name="game"
            options={{
              headerShown: false,
              headerBackButtonDisplayMode: 'minimal',
              headerBackVisible: true,
              headerBackTitle: ''
            }}
          />
        </Stack>
      </ErrorProvider>
    </UserProvider>
  );
}
