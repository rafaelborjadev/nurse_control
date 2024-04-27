import { Text, View } from 'react-native';
import { Image } from 'expo-image';

import logoDark from '../../../../assets/images/logo-title-black.png';

export default function Home() {
  return (
    <View className="flex flex-1 justify-center items-center">
      <Text className="text-2xl">Bienvenido a</Text>
      <Image
        source={logoDark}
        className="w-11/12 h-20 mx-auto"
        contentFit="contain"
      />
    </View>
  );
}
