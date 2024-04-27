import { useState } from 'react';
import { Text, View } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { router } from 'expo-router';
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
      </SafeAreaView>
    </View>
  );
};

export default SignIn;
