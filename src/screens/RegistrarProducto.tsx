import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Text, Menu, Divider } from 'react-native-paper';
import { insertarProducto } from '../db/database';
import { CATEGORIAS_SUGERIDAS, UNIDADES_SUGERIDAS, Producto } from '../types/Producto';

function hoyISO(): string {
  return new Date().toISOString().split('T')[0];
}

export default function RegistrarProducto({ navigation }: any) {
  const [nombre, setNombre] = useState('');
  const [codigo, setCodigo] = useState('');
  const [categoria, setCategoria] = useState(CATEGORIAS_SUGERIDAS[0]);
  const [cantidad, setCantidad] = useState('');
  const [unidad, setUnidad] = useState(UNIDADES_SUGERIDAS[0]);
  const [precio, setPrecio] = useState('');
  const [fechaVencimiento, setFechaVencimiento] = useState('');
  const [proveedor, setProveedor] = useState('');
  const [notas, setNotas] = useState('');

  const [menuCategoriaVisible, setMenuCategoriaVisible] = useState(false);
  const [menuUnidadVisible, setMenuUnidadVisible] = useState(false);
  const [guardando, setGuardando] = useState(false);

  function limpiarFormulario() {
    setNombre('');
    setCodigo('');
    setCategoria(CATEGORIAS_SUGERIDAS[0]);
    setCantidad('');
    setUnidad(UNIDADES_SUGERIDAS[0]);
    setPrecio('');
    setFechaVencimiento('');
    setProveedor('');
    setNotas('');
  }

  async function guardar() {
    if (!nombre.trim()) {
      Alert.alert('Falta información', 'El nombre del producto es obligatorio.');
      return;
    }
    const cantidadNum = parseFloat(cantidad.replace(',', '.'));
    if (isNaN(cantidadNum) || cantidadNum <= 0) {
      Alert.alert('Cantidad inválida', 'Ingresa una cantidad numérica mayor a 0.');
      return;
    }
    const precioNum = precio.trim() ? parseFloat(precio.replace(',', '.')) : 0;
    if (isNaN(precioNum)) {
      Alert.alert('Precio inválido', 'Ingresa un precio numérico válido.');
      return;
    }

    const producto: Producto = {
      nombre: nombre.trim(),
      categoria,
      codigo: codigo.trim(),
      cantidad: cantidadNum,
      unidad,
      precio: precioNum,
      fechaEntrada: hoyISO(),
      fechaVencimiento: fechaVencimiento.trim(),
      proveedor: proveedor.trim(),
      notas: notas.trim(),
    };

    try {
      setGuardando(true);
      await insertarProducto(producto);
      limpiarFormulario();
      Alert.alert('Guardado', `"${producto.nombre}" se registró correctamente.`);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'No se pudo guardar el producto. Intenta de nuevo.');
    } finally {
      setGuardando(false);
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text variant="titleLarge" style={styles.titulo}>
        Registrar producto
      </Text>

      <TextInput
        label="Nombre del producto *"
        value={nombre}
        onChangeText={setNombre}
        style={styles.input}
        mode="outlined"
      />

      <TextInput
        label="Código (opcional)"
        value={codigo}
        onChangeText={setCodigo}
        style={styles.input}
        mode="outlined"
      />

      <Menu
        visible={menuCategoriaVisible}
        onDismiss={() => setMenuCategoriaVisible(false)}
        anchor={
          <Button
            mode="outlined"
            onPress={() => setMenuCategoriaVisible(true)}
            style={styles.selectButton}
            contentStyle={styles.selectButtonContent}
          >
            Categoría: {categoria}
          </Button>
        }
      >
        {CATEGORIAS_SUGERIDAS.map((c) => (
          <Menu.Item
            key={c}
            onPress={() => {
              setCategoria(c);
              setMenuCategoriaVisible(false);
            }}
            title={c}
          />
        ))}
      </Menu>

      <View style={styles.fila}>
        <TextInput
          label="Cantidad *"
          value={cantidad}
          onChangeText={setCantidad}
          keyboardType="decimal-pad"
          style={[styles.input, styles.mitad]}
          mode="outlined"
        />

        <Menu
          visible={menuUnidadVisible}
          onDismiss={() => setMenuUnidadVisible(false)}
          anchor={
            <Button
              mode="outlined"
              onPress={() => setMenuUnidadVisible(true)}
              style={[styles.selectButton, styles.mitad]}
              contentStyle={styles.selectButtonContent}
            >
              {unidad}
            </Button>
          }
        >
          {UNIDADES_SUGERIDAS.map((u) => (
            <Menu.Item
              key={u}
              onPress={() => {
                setUnidad(u);
                setMenuUnidadVisible(false);
              }}
              title={u}
            />
          ))}
        </Menu>
      </View>

      <TextInput
        label="Precio"
        value={precio}
        onChangeText={setPrecio}
        keyboardType="decimal-pad"
        style={styles.input}
        mode="outlined"
        left={<TextInput.Affix text="RD$" />}
      />

      <TextInput
        label="Fecha de vencimiento (YYYY-MM-DD, opcional)"
        value={fechaVencimiento}
        onChangeText={setFechaVencimiento}
        style={styles.input}
        mode="outlined"
        placeholder="2026-09-05"
      />

      <TextInput
        label="Proveedor (opcional)"
        value={proveedor}
        onChangeText={setProveedor}
        style={styles.input}
        mode="outlined"
      />

      <TextInput
        label="Notas (opcional)"
        value={notas}
        onChangeText={setNotas}
        style={styles.input}
        mode="outlined"
        multiline
        numberOfLines={3}
      />

      <Divider style={styles.divider} />

      <Button mode="contained" onPress={guardar} loading={guardando} disabled={guardando}>
        Guardar producto
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { padding: 16, paddingBottom: 40 },
  titulo: { marginBottom: 16 },
  input: { marginBottom: 12 },
  fila: { flexDirection: 'row', gap: 12 },
  mitad: { flex: 1 },
  selectButton: { marginBottom: 12, justifyContent: 'center' },
  selectButtonContent: { height: 50 },
  divider: { marginVertical: 16 },
});
