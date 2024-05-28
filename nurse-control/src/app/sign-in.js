import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { TextInput, Button, Portal, Modal } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { router, useLocalSearchParams } from 'expo-router';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth } from '../lib/firebase';

import logoDark from '../../assets/images/logo-title-black.png';

const schema = yup
  .object({
    email: yup
      .string()
      .email('El correo debe ser un email válido.')
      .required('El correo es requerido.'),
    password: yup.string().required('La contraseña es requerida.'),
  })
  .required();

const SignIn = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const [togglePass, setTogglePass] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [visible, setVisible] = useState(false);
  const { error: paramError } = useLocalSearchParams();

  const hideModal = () => setVisible(false);

  const onSubmit = async ({ email, password }) => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setLoading(false);
      router.replace('/');
    } catch (error) {
      setLoading(false);
      const errorCode = error.code;
      if (errorCode === 'auth/invalid-credential') {
        setError('Credenciales incorrectas, intente de nuevo.');
      } else {
        setError(
          'Ha ocurrido un error al iniciar sesión, por favor intente más tarde.'
        );
      }
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      // Check if your device supports Google Play
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });
      // Get the users ID token
      const user = await GoogleSignin.signIn();
      const { idToken } = user;

      // Create a Google credential with the token
      const credential = GoogleAuthProvider.credential(idToken);

      await signInWithCredential(auth, credential);
      setLoading(false);
      router.replace('/');
    } catch (error) {
      setLoading(false);
      if (error.code) {
        switch (error.code) {
          case statusCodes.SIGN_IN_CANCELLED:
            // user cancelled the login flow
            setError('El inicio de sesión ha sido cancelado.');
            break;
          case statusCodes.IN_PROGRESS:
            // operation (eg. sign in) already in progress
            setError('Ya hay un inicio de sesión en progreso.');
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            // play services not available or outdated
            setError('Los servicios de google play no están disponibles.');
            break;
          default:
            // some other error happened
            setError(
              'Ha ocurrido un error al iniciar sesión con google, intente de nuevo más tarde.'
            );
            console.error('error al iniciar sesión con google');
            console.error(error.message);
        }
      } else {
        setError(
          'Ha ocurrido un error al iniciar sesión con google, intente de nuevo más tarde.'
        );
        console.error('error al iniciar sesión con google');
        console.error(error.message);
      }
    }
  };

  useEffect(() => {
    let mounted = true;

    if (paramError && mounted) {
      setVisible(true);
    }

    return () => {
      mounted = false;
    };
  }, [paramError]);

  return (
    <View className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 justify-center bg-white">
      <SafeAreaView>
        <Image
          source={logoDark}
          className="w-11/12 h-20 mx-auto"
          contentFit="contain"
        />
        <View className="mt-8 mb-4">
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                autoComplete="email"
                keyboardType="email-address"
                placeholder="micorreo@example.com"
                label="Correo"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                mode="outlined"
                error={errors.email ? true : false}
              />
            )}
            name="email"
          />
          {errors.email && (
            <Text className="text-red-500 text-xs ml-3">
              {errors.email.message}
            </Text>
          )}
        </View>

        <View className="mb-8 mt-4">
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                autoComplete="current-password"
                placeholder="Contraseña"
                label="Contraseña"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                mode="outlined"
                secureTextEntry={togglePass}
                right={
                  <TextInput.Icon
                    icon={togglePass ? 'eye' : 'eye-off'}
                    onPress={() => setTogglePass((prev) => !prev)}
                  />
                }
                error={errors.password ? true : false}
              />
            )}
            name="password"
          />
          {errors.password && (
            <Text className="text-red-500 text-xs ml-3">
              {errors.password.message}
            </Text>
          )}
        </View>

        <Button
          mode="contained"
          icon="account"
          onPress={handleSubmit(onSubmit)}
          disabled={loading}
        >
          Iniciar Sesión
        </Button>
        {error && (
          <Text className="text-red-500 text-sm text-center mt-4">{error}</Text>
        )}
        <View className="mt-6">
          <View className="relative">
            <View className="absolute inset-0 flex flex-row items-center">
              <View className="w-full border-t border-gray-400 mt-2" />
            </View>
            <View className="relative flex flex-row justify-center text-sm font-medium leading-6">
              <Text className="bg-white px-6 text-gray-900">
                O continúa con
              </Text>
            </View>
          </View>

          <View className="mt-6">
            <Button
              icon="google"
              onPress={handleGoogleSignIn}
              disabled={loading}
            >
              Google
            </Button>
          </View>
        </View>
        <Portal>
          <Modal
            visible={visible}
            onDismiss={hideModal}
            contentContainerStyle={{
              backgroundColor: 'white',
              padding: 20,
              maxWidth: '90%',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          >
            <Text className="text-red-500 font-bold text-center text-xl">
              Error.
            </Text>
            <Text>{paramError}</Text>
          </Modal>
        </Portal>
      </SafeAreaView>
    </View>
  );
};

export default SignIn;
