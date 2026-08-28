import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { PaperProvider, Text } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import RegistrarProducto from './src/screens/RegistrarProducto';
import Historial from './src/screens/Historial';
import Exportar from './src/screens/Exportar';
import { initDatabase } from './src/db/database';

const Tab = createBottomTabNavigator();

export default function App() {
  const [listo, setListo] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    initDatabase()
      .then(() => setListo(true))
      .catch((e) => {
        console.error(e);
        setError('No se pudo iniciar la base de datos local.');
      });
  }, []);

  if (error) {
    return (
      <View style={styles.centro}>
        <Text>{error}</Text>
      </View>
    );
  }

  if (!listo) {
    return (
      <View style={styles.centro}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <PaperProvider>
      <StatusBar style="auto" />
      <NavigationContainer>
        <Tab.Navigator screenOptions={{ headerTitleAlign: 'center' }}>
          <Tab.Screen
            name="Registrar"
            component={RegistrarProducto}
            options={{
              title: 'Registrar',
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="plus-box" color={color} size={size} />
              ),
            }}
          />
          <Tab.Screen
            name="Historial"
            component={Historial}
            options={{
              title: 'Inventario',
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="format-list-bulleted" color={color} size={size} />
              ),
            }}
          />
          <Tab.Screen
            name="Exportar"
            component={Exportar}
            options={{
              title: 'Exportar',
              tabBarIcon: ({ color, size }) => (
                <MaterialCommunityIcons name="file-excel" color={color} size={size} />
              ),
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  centro: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
