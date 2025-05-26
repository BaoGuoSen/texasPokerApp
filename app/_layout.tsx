import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import { useColorScheme } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import * as ScreenOrientation from 'expo-screen-orientation';
import {
  ReanimatedLogLevel,
  configureReanimatedLogger
} from 'react-native-reanimated';

import '@/global.css';
import { UserProvider } from '@/contexts/UserContext';
import { ErrorProvider } from '@/contexts/ErrorContext';
import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';

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
  const theme = useColorScheme();

  if (!loaded) {
    return null;
  }

  return (
    <GluestackUIProvider mode={theme!}>
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
            <Stack.Screen
              name="login"
              options={{
                headerShown: false
              }}
            />
          </Stack>
        </ErrorProvider>
      </UserProvider>
    </GluestackUIProvider>
  );
}
