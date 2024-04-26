import { Text, View } from 'react-native';
import { signOut } from 'firebase/auth';
import useUser from '../../hooks/useUser';
import { auth } from '../../lib/firebase';

export default function Index() {
  const [user, initializing] = useUser();
  console.log(initializing);
  console.log(user);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text onPress={handleSignOut}>Sign Out</Text>
    </View>
  );
}
