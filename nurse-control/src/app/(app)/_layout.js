import { Redirect, Stack } from 'expo-router';
import { Text } from 'react-native-paper';
import useUser from '../../hooks/useUser';
import { View } from 'react-native';

export default function AppLayout() {
  const [user, initializing, error] = useUser();

  // You can keep the splash screen open, or render a loading screen like we do here.
  if (initializing) {
    return (
      <View className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 justify-center">
        <Text className="text-center">Cargando...</Text>
      </View>
    );
  }

  // Only require authentication within the (app) group's layout as users
  // need to be able to access the (auth) group and sign in again.
  if (!user) {
    // On web, static rendering will stop here as the user is not authenticated
    // in the headless Node process that the pages are rendered in.
    return (
      <Redirect
        href={{
          pathname: '/sign-in',
          params: { error },
        }}
      />
    );
  }

  // This layout can be deferred because it's not the root layout.
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="cita/[...slug]"  options={{ headerShown: true,  title: 'Detalle de cita', }} />
      <Stack.Screen name="paciente/[id]"  options={{ headerShown: true,  title: 'Agregar un paciente', }} />
      <Stack.Screen name="usuario/[id]"  options={{ headerShown: true,  title: 'Agregar un usuario', }} />
    </Stack>
  );
}
