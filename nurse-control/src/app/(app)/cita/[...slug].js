import { useEffect, useState } from 'react';
import { View, Alert, ScrollView } from 'react-native';
import {
  Text,
  TextInput,
  Button,
  RadioButton,
  useTheme,
  Provider,
  Menu,
  Portal,
} from 'react-native-paper';
import { DatePickerInput, tr } from 'react-native-paper-dates';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useForm, Controller } from 'react-hook-form';
import { db } from '../../../lib/firebase';
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  query,
  where,
  updateDoc,
} from 'firebase/firestore';
import { yupResolver } from '@hookform/resolvers/yup';
import { router, useLocalSearchParams } from 'expo-router';
import * as yup from 'yup';
import moment from 'moment';

const schema = yup
  .object({
    fecha: yup.date().required('La fecha de la cita es requerida.'),
  })
  .required();
const DetalleCita = () => {
  const theme = useTheme();
  const { slug } = useLocalSearchParams();
  const [doctorsVisible, setDoctorsVisible] = useState(false);
  const [pacienteVisible, setPacienteVisible] = useState(false);
  const [action, id] = slug;
  const isReadOnly = action === 'show';
  const [doctoresList, setDoctoresList] = useState([]);
  const [pacientesList, setPacientesList] = useState([]);

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      doctor: null,
      paciente: null,
      fecha: new Date(),
      notas: '',
    },
  });

  useEffect(() => {
    const init = async () => {
      if (action === 'show') {
        const data = await getData(id);
        setDoctoresList([data.doctor]);
        setPacientesList([data.paciente]);
        reset({
          paciente: data.paciente,
          doctor: data.doctor,
          fecha: new Date(data.fecha),
          notas: data.notas.replaceAll('\\n', '\n'),
        });
      } else if (action === 'create') {
        const doctoresSnapshots = await getDocs(
          query(collection(db, 'usuarios'), where('rol', '==', 'Doctor'))
        );
        const doctores = doctoresSnapshots.docs.map((doc) => ({
          id: doc.id,
          nombres: doc.data().nombres,
          apellidos: doc.data().apellidos,
        }));
        setDoctoresList(doctores);

        const pacientesSnapshots = await getDocs(collection(db, 'pacientes'));
        const pacientes = pacientesSnapshots.docs.map((doc) => ({
          id: doc.id,
          nombres: doc.data().nombres,
          apellidos: doc.data().apellidos,
        }));
        setPacientesList(pacientes);
      }
    };
    init();
  }, []);

  const getData = async (id) => {
    const document = await getDoc(doc(db, 'citas', `${id}`));
    const doctor = (await getDoc(document.data().doctor)).data();
    const paciente = (await getDoc(document.data().paciente)).data();
    return {
      id: document.id,
      fecha: document.data().fecha.seconds * 1000,
      doctor,
      paciente,
      notas: document.data().notas,
    };
  };

  const openDoctorMenu = () => setDoctorsVisible(true);
  const closeDoctorMenu = () => setDoctorsVisible(false);

  const openPacienteMenu = () => setPacienteVisible(true);
  const closePacienteMenu = () => setPacienteVisible(false);

  return (
    <ScrollView className="flex-1 px-4 sm:px-6 lg:px-8 bg-white">
      <SafeAreaView>
        <View className="mb-4">
          <View className="mb-4">
            <Menu
              visible={doctorsVisible}
              onDismiss={closeDoctorMenu}
              anchor={
                <Button
                  mode="outlined"
                  onPress={() => !isReadOnly && openDoctorMenu()}
                >
                  Doctor:{' '}
                  {control._formValues.doctor
                    ? `${control._formValues.doctor?.nombres} ${control._formValues.doctor?.apellidos}`
                    : ''}
                </Button>
              }
            >
              {doctoresList.map((doctor) => (
                <Menu.Item
                  key={`${doctor.id}`}
                  onPress={() => {
                    setValue('doctor', doctor);
                    closeDoctorMenu();
                  }}
                  title={`${doctor.nombres} ${doctor.apellidos}`}
                />
              ))}
            </Menu>
          </View>

          <View className="mb-4">
            <Menu
              visible={pacienteVisible}
              onDismiss={closePacienteMenu}
              anchor={
                <Button
                  mode="outlined"
                  onPress={() => !isReadOnly && openPacienteMenu()}
                >
                  Paciente:{' '}
                  {control._formValues.paciente
                    ? `${control._formValues.paciente?.nombres} ${control._formValues.paciente?.apellidos}`
                    : ''}
                </Button>
              }
            >
              {pacientesList.map((paciente) => (
                <Menu.Item
                  key={`${paciente.id}`}
                  onPress={() => {
                    setValue('paciente', paciente);
                    closePacienteMenu();
                  }}
                  title={`${paciente.nombres} ${paciente.apellidos}`}
                />
              ))}
            </Menu>
          </View>

          <View className="mb-4">
            {isReadOnly ? (
              <View pointerEvents="none">
                <Text>Fecha:</Text>
                <TextInput mode="outlined">
                  {moment(control._formValues.fecha).format(
                    'DD-MM-YYYY, h:mm a'
                  )}
                </TextInput>
              </View>
            ) : (
              <>
                <Controller
                  control={control}
                  name="fecha"
                  render={({ field: { onChange, value } }) => (
                    <DatePickerInput
                      label="Fecha"
                      value={value}
                      onChange={onChange}
                      locale="es"
                      mode="outlined"
                      error={errors.fecha ? true : false}
                    />
                  )}
                />
                {errors.fecha && (
                  <Text className="text-red-500">{errors.fecha.message}</Text>
                )}
              </>
            )}
          </View>

          <View className="mb-4">
            <Text>Notas:</Text>
            {isReadOnly && (
              <View pointerEvents="none">
                <TextInput mode="outlined" multiline={true}>
                  {control._formValues.notas}
                </TextInput>
              </View>
            )}
            {!isReadOnly && (
              <View>
                <Controller
                  control={control}
                  name="notas"
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      label="Notas"
                      onChangeText={onChange}
                      value={value}
                      mode="outlined"
                      multiline={true}
                      error={errors.notas ? true : false}
                    />
                  )}
                />
                {errors.notas && (
                  <Text className="text-red-500">{errors.notas.message}</Text>
                )}
              </View>
            )}
          </View>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};

export default DetalleCita;
