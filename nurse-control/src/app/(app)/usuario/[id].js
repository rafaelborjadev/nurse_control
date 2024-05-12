import { useState } from 'react';
import { Text, View, Alert, ScrollView } from 'react-native';
import {
  TextInput,
  Button,
  RadioButton,
  Provider,
  Menu,
  Portal,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { DatePickerInput } from 'react-native-paper-dates';
import { db } from '../../../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { router } from 'expo-router';
import moment from 'moment';

const schema = yup
  .object({
    nombres: yup.string().required('Los nombres son requeridos.'),
    apellidos: yup.string().required('Los apellidos son requeridos.'),
    correo: yup
      .string()
      .email('Debe ser un email válido.')
      .required('El correo es requerido.'),
    fecha_nacimiento: yup
      .date()
      .max(new Date(), 'La fecha de nacimiento no puede ser en el futuro.')
      .required('La fecha de nacimiento es requerida.'),
    genero: yup.string().required('El género es requerido.'),
    password: yup.string().required('La contraseña es requerida.'),
    telefono: yup.string().required('El teléfono es requerido.'),
    rol: yup.string().required('El rol es requerido.'),
  })
  .required();

const AddUsuario = () => {
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      nombres: '',
      apellidos: '',
      correo: '',
      fecha_nacimiento: new Date(),
      genero: 'Masculino',
      password: '',
      rol: 'Doctor', // Default to Doctor
      telefono: '',
    },
  });

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await addDoc(collection(db, 'usuarios'), {
        ...data,
        fecha_nacimiento: moment(data.fecha_nacimiento).toDate(),
      });
      if (res.id) {
        Alert.alert(
          'Usuario agregado con éxito',
          'El usuario ha sido registrado con éxito.',
          [{ text: 'OK', onPress: () => router.navigate('/usuarios') }]
        );
      }
    } catch (error) {
      console.error('Error al agregar el usuario:', error);
      Alert.alert('Error', 'No se pudo registrar el usuario.');
    }
    setLoading(false);
  };

  return (
    <Provider>
      <Portal>
        <ScrollView className="flex-1 px-4 sm:px-6 lg:px-8 bg-white">
          <SafeAreaView>
            <View className="mb-4">
              <Controller
                control={control}
                name="nombres"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    label="Nombres"
                    onChangeText={onChange}
                    value={value}
                    mode="outlined"
                    error={errors.nombres ? true : false}
                  />
                )}
              />
              {errors.nombres && (
                <Text className="text-red-500">{errors.nombres.message}</Text>
              )}
            </View>
            <View className="mb-4">
              <Controller
                control={control}
                name="apellidos"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    label="Apellidos"
                    onChangeText={onChange}
                    value={value}
                    mode="outlined"
                    error={errors.apellidos ? true : false}
                  />
                )}
              />
              {errors.apellidos && (
                <Text className="text-red-500">{errors.apellidos.message}</Text>
              )}
            </View>
            <View className="mb-4">
              <Controller
                control={control}
                name="correo"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    label="Correo"
                    onChangeText={onChange}
                    value={value}
                    mode="outlined"
                    error={errors.correo ? true : false}
                  />
                )}
              />
              {errors.correo && (
                <Text className="text-red-500">{errors.correo.message}</Text>
              )}
            </View>
            <View className="mb-4">
              <Controller
                control={control}
                name="fecha_nacimiento"
                render={({ field: { onChange, value } }) => (
                  <DatePickerInput
                    label="Fecha de Nacimiento"
                    value={value}
                    onChange={onChange}
                    locale="es"
                    mode="outlined"
                    error={errors.fecha_nacimiento ? true : false}
                  />
                )}
              />
              {errors.fecha_nacimiento && (
                <Text className="text-red-500">
                  {errors.fecha_nacimiento.message}
                </Text>
              )}
            </View>
            <View className="mb-4">
              <Text style={{ marginBottom: 8 }}>Género:</Text>
              <Controller
                control={control}
                name="genero"
                render={({ field: { onChange, value } }) => (
                  <View
                    style={{
                      flexDirection: 'row',
                      flexWrap: 'wrap',
                      alignItems: 'center',
                    }}
                  >
                    <RadioButton.Group onValueChange={onChange} value={value}>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          marginRight: 10,
                        }}
                      >
                        <RadioButton value="Masculino" />
                        <Text>Masculino</Text>
                      </View>
                      <View
                        style={{ flexDirection: 'row', alignItems: 'center' }}
                      >
                        <RadioButton value="Femenino" />
                        <Text>Femenino</Text>
                      </View>
                    </RadioButton.Group>
                  </View>
                )}
              />
              {errors.genero && (
                <Text className="text-red-500">{errors.genero.message}</Text>
              )}
            </View>
            <View className="mb-4">
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    label="Contraseña"
                    onChangeText={onChange}
                    value={value}
                    mode="outlined"
                    error={errors.password ? true : false}
                    secureTextEntry
                  />
                )}
              />
              {errors.password && (
                <Text className="text-red-500">{errors.password.message}</Text>
              )}
            </View>
            <View className="mb-4">
              <Menu
                visible={visible}
                onDismiss={closeMenu}
                anchor={
                  <Button mode="outlined" onPress={openMenu}>
                    Rol: {control._formValues.rol}
                  </Button>
                }
              >
                <Menu.Item
                  onPress={() => {
                    setValue('rol', 'Doctor');
                    closeMenu();
                  }}
                  title="Doctor"
                />
                <Menu.Item
                  onPress={() => {
                    setValue('rol', 'Administrador');
                    closeMenu();
                  }}
                  title="Administrador"
                />
              </Menu>
            </View>
            <View className="mb-4">
              <Controller
                control={control}
                name="telefono"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    label="Teléfono"
                    onChangeText={onChange}
                    value={value}
                    mode="outlined"
                    error={errors.telefono ? true : false}
                  />
                )}
              />
              {errors.telefono && (
                <Text className="text-red-500">{errors.telefono.message}</Text>
              )}
            </View>

            <Button
              mode="contained"
              onPress={handleSubmit(onSubmit)}
              disabled={loading}
              loading={loading}
            >
              Agregar usuario
            </Button>
          </SafeAreaView>
        </ScrollView>
      </Portal>
    </Provider>
  );
};

export default AddUsuario;
