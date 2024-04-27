import { View } from 'react-native';
import { Button } from 'react-native-paper';
import { signOut } from 'firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { auth } from '../../../lib/firebase';

export default function Configuracion() {
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      GoogleSignin.revokeAccess();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View className="flex flex-1 justify-center items-center">
      <Button mode="contained" onPress={handleSignOut}>
        Cerrar Sesión
      </Button>
    </View>
  );
}
