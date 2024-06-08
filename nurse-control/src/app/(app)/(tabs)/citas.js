import { ScrollView, Text, RefreshControl, View, Alert } from 'react-native';
import { db } from '../../../lib/firebase';
import { useCallback, useEffect, useState } from 'react';
import { router, useFocusEffect } from 'expo-router';
import {
  collection,
  deleteDoc,
  getDocs,
  doc,
  getDoc,
} from 'firebase/firestore';
import moment from 'moment';
import { useTheme, Button } from 'react-native-paper';
import Cards from '../../../components/Card';

export default function Citas() {
  const [data, setData] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const theme = useTheme();
  const [hasChanged, setHasChanged] = useState(false);

  useFocusEffect(
    useCallback(() => {
      getData();
    }, [])
  );

  useEffect(() => {
    getData();
  }, [hasChanged]);

  const getData = async () => {
    setLoading(true);
    const snapshots = await getDocs(collection(db, 'citas'));
    const res = await Promise.all(
      snapshots.docs.map(async (doc) => {
        paciente = (await getDoc(doc.data().paciente)).data();
        doctor = (await getDoc(doc.data().doctor)).data();
        return {
          id: doc.id,
          ...doc.data(),
          fecha: moment(doc.data().fecha.seconds * 1000).format(
            'DD-MM-YYYY, h:mm a'
          ),
          nombreDePaciente: `${paciente.nombres} ${paciente.apellidos}`,
          nombreDeDoctor: `${doctor.nombres} ${doctor.apellidos}`,
        };
      })
    );

    setData(res);

    setLoading(false);
  };

  const onRefresh = () => {
    getData();
  };

  const createCita = () => {
    router.navigate(`/cita/create`);
  };

  const editCita = (document) => {
    // TODO: handle navigation to edit screen
    // router.navigate(`/usuario/${document.id}`);
  };

  const showCita = (document) => {
    router.navigate(`/cita/show/${document.id}`);
  };

  const deleteCita = async (document) => {
    Alert.alert(
      '¿De verdad deseas eliminar la cita?',
      'Haz click en "Sí" para eliminar, da click en "Cancelar para cancelar la operación"',
      [
        { text: 'Sí', onPress: () => procedDelete(document) },
        { text: 'Cancelar', onPress: () => null },
      ]
    );
  };

  const procedDelete = async (document) => {
    try {
      const docRef = doc(db, 'citas', `${document.id}`);
      await deleteDoc(docRef);
      Alert.alert(
        'Cita eliminado con exito!',
        `Hemos eliminado los registros de la cita`,
        [{ text: 'Ok', onPress: () => setHasChanged(true) }]
      );
    } catch (e) {
      Alert.alert(
        '¡Algo salio mal!',
        `No pudimos eliminar la cita, intentalo de nuevo más tarde`,
        [{ text: 'Ok', onPress: () => null }]
      );
    }
  };

  const keys = {
    header: { name: 'id', label: 'Cita: ' },
    body: [
      { name: 'nombreDePaciente', label: 'Paciente: ' },
      { name: 'nombreDeDoctor', label: 'Doctor/a: ' },
      { name: 'fecha', label: 'Fecha: ' },
    ],
  };

  const buttons = [
    {
      buttonText: 'Mostrar',
      icon: 'file-eye',
      className: '',
      styles: {},
      action: showCita,
    },
    {
      buttonText: 'Editar',
      icon: 'account-edit',
      className: '',
      styles: {},
      action: editCita,
    },
    {
      buttonText: 'Elimiar',
      icon: 'delete',
      className: 'bg-red-200',
      styles: {},
      action: deleteCita,
    },
  ];

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={isLoading} onRefresh={onRefresh} />
      }
      className="p-2 flex flex-1 mb-5"
    >
      {!isLoading && (
        <>
          <Text className="text-lg p-1.5">Listado de citas</Text>
          <View className="my-2 flex-row ml-auto">
            <Button
              icon="head-plus"
              mode="elevated"
              className="self-start max-w-40"
              contentStyle={{
                backgroundColor: theme.colors.secondaryContainer,
              }}
              onPress={createCita}
            >
              Agregar nueva cita
            </Button>
          </View>
          <Cards keys={keys} data={data} buttons={buttons} />
        </>
      )}
    </ScrollView>
  );
}
