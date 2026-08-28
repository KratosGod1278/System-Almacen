import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { obtenerProductos } from '../db/database';
import { exportarAExcel } from '../utils/exportExcel';

export default function Exportar() {
  const [exportando, setExportando] = useState(false);

  async function manejarExportar() {
    try {
      setExportando(true);
      const productos = await obtenerProductos();
      if (productos.length === 0) {
        Alert.alert('Sin datos', 'Todavía no hay productos registrados para exportar.');
        return;
      }
      await exportarAExcel(productos);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'No se pudo generar el archivo de Excel.');
    } finally {
      setExportando(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text variant="titleLarge" style={styles.titulo}>
        Exportar inventario
      </Text>
      <Text variant="bodyMedium" style={styles.descripcion}>
        Genera un archivo Excel (.xlsx) con todos los productos registrados y lo comparte a tu
        correo, Drive o directamente a tu laptop.
      </Text>
      <Button
        mode="contained"
        onPress={manejarExportar}
        loading={exportando}
        disabled={exportando}
        style={styles.boton}
      >
        Generar y compartir Excel
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#fff' },
  titulo: { marginBottom: 8 },
  descripcion: { marginBottom: 24, color: '#555' },
  boton: { marginTop: 8 },
});
