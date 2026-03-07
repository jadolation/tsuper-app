import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

export default function RootLayout() {
  return (
    <>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen
          name="passenger/map"
          options={{ title: 'Passenger Map', headerBackTitle: 'Back' }}
        />
        <Stack.Screen
          name="driver/companion"
          options={{ title: 'Driver Companion', headerBackTitle: 'Back' }}
        />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}
