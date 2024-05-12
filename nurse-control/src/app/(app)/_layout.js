import { Redirect, Stack } from 'expo-router';
import { Text } from 'react-native-paper';
import useUser from '../../hooks/useUser';

export default function AppLayout() {
  const [user, initializing] = useUser();

  // You can keep the splash screen open, or render a loading screen like we do here.
  if (initializing) {
    return <Text>Loading...</Text>;
  }

  // Only require authentication within the (app) group's layout as users
  // need to be able to access the (auth) group and sign in again.
  if (!user) {
    // On web, static rendering will stop here as the user is not authenticated
    // in the headless Node process that the pages are rendered in.
    return <Redirect href="/sign-in" />;
  }

  // This layout can be deferred because it's not the root layout.
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="paciente/[id]"  options={{ headerShown: true,  title: 'Agregar un paciente', }} />
      <Stack.Screen name="usuario/[id]"  options={{ headerShown: true,  title: 'Agregar un usuario', }} />
    </Stack>
  );
}
