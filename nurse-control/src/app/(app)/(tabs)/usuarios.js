import { Text, ScrollView, RefreshControl, View, Alert } from 'react-native';
import { db } from '../../../lib/firebase';
import { useCallback, useEffect, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { collection, deleteDoc, getDocs, doc } from 'firebase/firestore';
import moment from 'moment';
import { useTheme, Button } from 'react-native-paper';
import { router } from 'expo-router';
import Cards from '../../../components/Card';

export default function Usuarios() {
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
    const snapshots = await getDocs(collection(db, 'usuarios'));
    const res = snapshots.docs.map((doc) => {
      return {
        id: doc.id,
        ...doc.data(),
        fecha_nacimiento: moment(
          doc.data()['fecha_nacimiento'].seconds * 1000
        ).format('DD-MM-YYYY'),
        nombre_completo: `${doc.data().nombres} ${doc.data().apellidos}`,
      };
    });
    setData(res);
    setLoading(false);
  };

  const onRefresh = () => {
    getData();
  };

  const editUsuario = (document) => {
    router.navigate(`/usuario/${document.id}`);
  };

  const deleteUsuario = async (document) => {
    Alert.alert(
      '¿De verdad deseas eliminar al usuario?',
      'Haz click en "Sí" para eliminar, da click en "Cancelar para cancelar la operación"',
      [
        { text: 'Sí', onPress: () => procedDelete(document) },
        { text: 'Cancelar', onPress: () => null },
      ]
    );
  };

  const procedDelete = async (document) => {
    try {
      const docRef = doc(db, 'usuarios', `${document.id}`);
      await deleteDoc(docRef);
      Alert.alert(
        '¡Usuario eliminado con exito!',
        `Hemos eliminado los registros del usuario`,
        [{ text: 'Ok', onPress: () => setHasChanged(true) }]
      );
    } catch (e) {
      Alert.alert(
        '¡Algo salio mal!',
        `No pudimos eliminar al usuario, intentalo de nuevo más tarde`,
        [{ text: 'Ok', onPress: () => null }]
      );
    }
  };

  const keys = {
    header: { name: 'nombre_completo', label: '' },
    body: [
      { name: 'rol', label: 'Rol: ' },
      { name: 'correo', label: 'Email: ' },
      { name: 'fecha_nacimiento', label: 'Fecha de nacimiento: ' },
      { name: 'telefono', label: 'Telefono: ' },
      { name: 'genero', label: 'Genero: ' },
    ],
  };

  const buttons = [
    {
      buttonText: 'Editar',
      icon: 'account-edit',
      className: '',
      styles: {},
      action: editUsuario,
    },
    {
      buttonText: 'Elimiar',
      icon: 'delete',
      className: 'bg-red-200',
      styles: {},
      action: deleteUsuario,
    },
  ];
  const handleClick = () => {
    router.navigate('/usuario/[id]');
  };

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={isLoading} onRefresh={onRefresh} />
      }
      className="p-2 flex flex-1 mb-5"
    >
      {!isLoading && (
        <>
          <Text className="text-lg p-1.5">Listado de usuarios</Text>
          <View className="my-2 flex-row ml-auto">
            <Button
              icon="head-plus"
              mode="elevated"
              className="self-start max-w-40"
              contentStyle={{
                backgroundColor: theme.colors.secondaryContainer,
              }}
              onPress={handleClick}
            >
              Agregar nuevo usuario
            </Button>
          </View>
          <Cards keys={keys} data={data} buttons={buttons} />
        </>
      )}
    </ScrollView>
  );
}
