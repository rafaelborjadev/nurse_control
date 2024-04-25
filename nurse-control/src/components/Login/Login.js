import { Text, View } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useState } from 'react';

import logoDark from '../../../assets/logo-title-black.png';

const schema = yup
  .object({
    correo: yup
      .string()
      .email('El correo debe ser un email válido.')
      .required('El correo es requerido.'),
    pass: yup.string().required('La contraseña es requerida.'),
  })
  .required();

const Login = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const [togglePass, setTogglePass] = useState(true);

  const onSubmit = (data) => console.log(data);

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
                error={errors.correo ? true : false}
              />
            )}
            name="correo"
          />
          {errors.correo && (
            <Text className="text-red-500 text-xs ml-3">
              {errors.correo.message}
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
                error={errors.pass ? true : false}
              />
            )}
            name="pass"
          />
          {errors.pass && (
            <Text className="text-red-500 text-xs ml-3">
              {errors.pass.message}
            </Text>
          )}
        </View>

        <Button
          mode="contained"
          icon="account"
          onPress={handleSubmit(onSubmit)}
        >
          Iniciar Sesión
        </Button>
      </SafeAreaView>
    </View>
  );
};

export default Login;
