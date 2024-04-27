import { View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { signOut } from 'firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { auth } from '../../../lib/firebase';
import useUser from '../../../hooks/useUser';

export default function Configuracion() {
  const [user, initializing] = useUser();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      // Revocar acceso si ha iniciado sesión con Google
      if (user?.displayName) {
        GoogleSignin.revokeAccess();
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 justify-center">
      {initializing && <Text>Cargando información de su cuenta...</Text>}
      {!initializing && user && (
        <View>
          <View className="flex flex-row mb-4">
            <Text className="font-bold text-base">Nombre: </Text>
            <Text className="text-base">{user.displayName || user.email}</Text>
          </View>
          <View className="flex flex-row mb-4">
            <Text className="font-bold text-base">Correo: </Text>
            <Text className="text-base">{user.email}</Text>
          </View>
          <Button mode="contained" onPress={handleSignOut}>
            Cerrar Sesión
          </Button>
        </View>
      )}
    </View>
  );
}
