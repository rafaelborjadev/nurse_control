import { useEffect, useState } from 'react';
import { Text, View, Alert } from 'react-native';
import { TextInput, Button, RadioButton, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { DatePickerInput } from 'react-native-paper-dates';
import { db } from '../../../lib/firebase';
import { collection, addDoc, getDoc, doc, updateDoc } from 'firebase/firestore';
import { router, useLocalSearchParams } from 'expo-router';
import moment from 'moment';

const schema = yup
  .object({
    email: yup
      .string()
      .email('El correo debe ser un email válido.')
      .required('El correo es requerido.'),
    names: yup.string().required('Los nombres son requeridos'),
    surnames: yup.string().required('Los apellidos son requeridos'),
    birthday: yup
      .date()
      .required('La fecha de nacimiento es requerida')
      .max(new Date(), 'La fecha de nacimiento no puede ser mayor a hoy'),
    genre: yup.string().required("El genero es requerido"),
  })
  .required();

const AddPaciente = () => {
  const theme = useTheme();
  const { id } = useLocalSearchParams();
  const [docToUpdate, setDocToUpdate] = useState(null); 

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    const load = async () => {
      if(id !== '[id]') {
        const res = await getData(id);
        
        if(!res) return;  
        reset({
          names: res.nombres,
          surnames: res.apellidos,
          email: res.correo,
          genre: res.genero,
          birthday: moment(res['fecha_nacimiento'].seconds * 1000),
        });
      }
    }

    load();
  }, [])

  const getData = async (docId) => {
    const entry = await getDoc(doc(db, "pacientes", `${docId}`));
    const docRef = doc(db, "pacientes", `${docId}`);
    setDocToUpdate(docRef);
    return entry.exists() ? entry.data() : null;
  }

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onSubmit = async ({ names, surnames, email, birthday, genre }) => {
    const paciente = {
      nombres: names,
      apellidos: surnames,
      correo: email,
      fecha_nacimiento: birthday,
      genero: genre
    };

    if(id !== '[id]') paciente.id = id;
    let res = null;
    try {
      setLoading(true);
      if(docToUpdate) {
        res = await updateDocument(paciente);
      } else {
        res = await addDoc(collection(db, 'pacientes'), paciente);
      }
      if (res.id) {
        Alert.alert(
          `Paciente ${res?.type === 'update' ? 'actualizado' : 'agregado'}`,
          `El paciente ha sido ${res?.type === 'update' ? 'actualizado' : 'registrado'} con exito`,
          [{ text: 'OK', onPress: () => clean() }]
        );
      }
      setLoading(false);
    } catch (e) {
      console.log(e);
    }
  };

  const updateDocument = async (doc) => {
    try {
      await updateDoc(docToUpdate, doc);
      return { id: '1234', type: 'update' };
    } catch(e) {
      return { type: 'update' };
    }
  }

  const clean = () => {
    reset({
      names: '',
      surnames: '',
      email: '',
      birthday: '',
    });
    if(id !== '[id]') return router.navigate('/pacientes');
    Alert.alert(
      '¿Quiere regresar a la lista de pacientes?',
      `Da click en ¡Sí! para navegar al listado de pacientes`,
      [
        { text: '¡Sí!', onPress: () => router.navigate('/pacientes') },
        { text: '¡No!', onPress: () => null },
      ]
    );
  };

  return (
    <View className="flex-1 px-4 sm:px-6 lg:px-8 bg-white">
      <SafeAreaView>
        <View className="mt-8 mb-4">
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                placeholder="Ingrese los nombres del paciente"
                label="Nombres"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                mode="outlined"
                error={errors.names ? true : false}
              />
            )}
            name="names"
          />
          {errors.names && (
            <Text className="text-red-500 text-xs ml-3">
              {errors.names.message}
            </Text>
          )}
        </View>

        <View className="mb-4">
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                placeholder="Ingrese los apellidos del paciente"
                label="Apellidos"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                mode="outlined"
                error={errors.surnames ? true : false}
              />
            )}
            name="surnames"
          />
          {errors.surnames && (
            <Text className="text-red-500 text-xs ml-3">
              {errors.surnames.message}
            </Text>
          )}
        </View>

        <View className="mb-8">
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                autoComplete="email"
                keyboardType="email-address"
                placeholder="correo@example.com"
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

        <View className="mb-8">
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <RadioButton.Group onValueChange={onChange} value={value}>
                <Text className="text-lg mb-1">Genero:</Text>
                <View
                  className="flex flex-row gap-10"
                >
                  <View className="flex flex-row self-center items-center">
                    <RadioButton value="Masculino" />
                    <Text>Masculino</Text>
                  </View>
                  <View className="flex flex-row self-center items-center">
                    <RadioButton value="Femenino" />
                    <Text>Femenino</Text>
                  </View>
                  <View className="flex flex-row self-center items-center">
                    <RadioButton value="Otro" />
                    <Text>Otro</Text>
                  </View>
                </View>
              </RadioButton.Group>
            )}
            name="genre"
          />
          {errors.genre && (
            <Text className="text-red-500 text-xs ml-3">
              {errors.genre.message}
            </Text>
          )}
        </View>

        <View className="mb-12 mt-2">
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <DatePickerInput
                locale="es"
                label="Fecha de nacimiento"
                value={value}
                onChange={onChange}
                inputMode="start"
                mode="outlined"
                error={errors.birthday ? true : false}
              />
            )}
            name="birthday"
          />
          {errors.birthday && (
            <Text className="text-red-500 text-xs ml-3 mt-7">
              {errors.birthday.message}
            </Text>
          )}
        </View>

        <Button
          mode="contained"
          icon="account"
          onPress={handleSubmit(onSubmit)}
          disabled={loading}
        >
          Agregar paciente
        </Button>
        {error && (
          <Text className="text-red-500 text-sm text-center mt-4">{error}</Text>
        )}
      </SafeAreaView>
    </View>
  );
};

export default AddPaciente;
