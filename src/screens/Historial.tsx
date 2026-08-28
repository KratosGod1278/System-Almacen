import React, { useCallback, useState } from 'react';
import { View, FlatList, StyleSheet, Alert } from 'react-native';
import { Text, Card, IconButton, ActivityIndicator, Searchbar } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import { obtenerProductos, eliminarProducto } from '../db/database';
import { Producto } from '../types/Producto';

export default function Historial() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState('');

  const cargar = useCallback(async () => {
    setCargando(true);
    try {
      const data = await obtenerProductos();
      setProductos(data);
    } catch (error) {
      console.error(error);
    } finally {
      setCargando(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      cargar();
    }, [cargar])
  );

  function confirmarEliminar(producto: Producto) {
    Alert.alert(
      'Eliminar producto',
      `¿Seguro que quieres eliminar "${producto.nombre}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            if (producto.id) {
              await eliminarProducto(producto.id);
              cargar();
            }
          },
        },
      ]
    );
  }

  const productosFiltrados = productos.filter((p) =>
    `${p.nombre} ${p.codigo} ${p.categoria}`.toLowerCase().includes(busqueda.toLowerCase())
  );

  if (cargando) {
    return (
      <View style={styles.centro}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Buscar por nombre, código o categoría"
        value={busqueda}
        onChangeText={setBusqueda}
        style={styles.buscador}
      />

      {productosFiltrados.length === 0 ? (
        <View style={styles.centro}>
          <Text variant="bodyLarge">Todavía no hay productos registrados.</Text>
        </View>
      ) : (
        <FlatList
          data={productosFiltrados}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.lista}
          renderItem={({ item }) => (
            <Card style={styles.card}>
              <Card.Title
                title={item.nombre}
                subtitle={`${item.categoria} · ${item.cantidad} ${item.unidad}${
                  item.codigo ? ` · Cód: ${item.codigo}` : ''
                }`}
                right={(props) => (
                  <IconButton {...props} icon="delete" onPress={() => confirmarEliminar(item)} />
                )}
              />
              <Card.Content>
                <Text variant="bodyMedium">
                  Precio: RD${item.precio.toFixed(2)} · Entrada: {item.fechaEntrada}
                  {item.fechaVencimiento ? ` · Vence: ${item.fechaVencimiento}` : ''}
                </Text>
                {item.proveedor ? (
                  <Text variant="bodySmall">Proveedor: {item.proveedor}</Text>
                ) : null}
                {item.notas ? <Text variant="bodySmall">Notas: {item.notas}</Text> : null}
              </Card.Content>
            </Card>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  buscador: { margin: 12 },
  lista: { paddingHorizontal: 12, paddingBottom: 24 },
  card: { marginBottom: 10 },
  centro: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
});
