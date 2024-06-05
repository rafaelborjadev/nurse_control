import React from 'react';
import { Tabs } from 'expo-router';
import { IconButton, useTheme } from 'react-native-paper';

const ICON_SIZE = 30;

export default function TabLayout() {
  const theme = useTheme();

  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: theme.colors.primary }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          // This tab will no longer show up in the tab bar.
          href: null,
        }}
      />
      <Tabs.Screen
        name="usuarios"
        options={{
          title: 'Usuarios',
          tabBarIcon: ({ focused, color }) => (
            <IconButton
              icon={focused ? 'account-group' : 'account-group-outline'}
              size={ICON_SIZE}
              iconColor={color}
            />
          ),
          tabBarLabelStyle: { fontSize: 15 },
        }}
      />
      <Tabs.Screen
        name="pacientes"
        options={{
          title: 'Pacientes',
          tabBarIcon: ({ focused, color }) => (
            <IconButton
              icon={focused ? 'account-injury' : 'account-injury-outline'}
              size={ICON_SIZE}
              iconColor={color}
            />
          ),
          tabBarLabelStyle: { fontSize: 15 },
        }}
      />
      <Tabs.Screen
        name="citas"
        options={{
          title: 'Citas',
          tabBarIcon: ({ focused, color }) => (
            <IconButton
              icon={ focused ? 'clipboard-file' : 'clipboard-file-outline' }
              size={ICON_SIZE}
              iconColor={color}
            />
          ),
          tabBarLabelStyle: { fontSize: 15 }
        }}
      />
      <Tabs.Screen
        name="configuracion"
        options={{
          title: 'Cuenta',
          tabBarIcon: ({ focused, color }) => (
            <IconButton
              icon={focused ? 'account-settings' : 'account-settings-outline'}
              size={ICON_SIZE}
              iconColor={color}
            />
          ),
          tabBarLabelStyle: { fontSize: 15 },
        }}
      />
    </Tabs>
  );
}
