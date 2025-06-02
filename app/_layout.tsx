// app/_layout.tsx (exemplo, ajuste ao seu layout raiz)
import '@/app/global.css'; // Ou o caminho para seu global.css
import { TransactionProvider } from '@/src/context/TransactionContext'; // Importe o Provider
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    // Suas fontes aqui
    // 'SpaceMono': require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

return (
    <TransactionProvider> {/* Provider é OK aqui */}
      <Stack> {/* Este é o seu Layout Route */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
        <Stack.Screen name="report" options={{ title: 'Relatório', presentation: 'modal' }} />
      </Stack>
    </TransactionProvider>
  );
}