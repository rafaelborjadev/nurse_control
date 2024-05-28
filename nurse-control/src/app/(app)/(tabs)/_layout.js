import React from 'react';
import { Tabs } from 'expo-router';
import { IconButton, useTheme } from 'react-native-paper';
import useUser from '../../../hooks/useUser';
import rules, { MODULE_ENUM, ROUTES } from '../../../navigation/rbacRules';

const ICON_SIZE = 30;
const verifyAuth = (rol, route) => {
  return rules[rol] && rules[rol][MODULE_ENUM.routes].includes(route)
    ? route
    : null;
};

export default function TabLayout() {
  const theme = useTheme();
  const [user] = useUser();

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
          href: verifyAuth(user?.rol, ROUTES.usuarios),
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
          href: verifyAuth(user?.rol, ROUTES.pacientes),
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
          href: verifyAuth(user?.rol, ROUTES.configuracion),
        }}
      />
    </Tabs>
  );
}
