import * as XLSX from 'xlsx';
import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Producto } from '../types/Producto';

// Encabezados en español, en el orden que probablemente use
// el sistema de la empresa (ajustar cuando tengamos las fotos).
const ENCABEZADOS: (keyof Producto)[] = [
  'codigo',
  'nombre',
  'categoria',
  'cantidad',
  'unidad',
  'precio',
  'fechaEntrada',
  'fechaVencimiento',
  'proveedor',
  'notas',
];

const NOMBRES_COLUMNAS: Record<keyof Producto, string> = {
  id: 'ID',
  codigo: 'Código',
  nombre: 'Nombre',
  categoria: 'Categoría',
  cantidad: 'Cantidad',
  unidad: 'Unidad',
  precio: 'Precio',
  fechaEntrada: 'Fecha de Entrada',
  fechaVencimiento: 'Fecha de Vencimiento',
  proveedor: 'Proveedor',
  notas: 'Notas',
};

export async function exportarAExcel(productos: Producto[]): Promise<void> {
  const filas = productos.map((p) => {
    const fila: Record<string, string | number> = {};
    ENCABEZADOS.forEach((campo) => {
      fila[NOMBRES_COLUMNAS[campo]] = p[campo] ?? '';
    });
    return fila;
  });

  const hoja = XLSX.utils.json_to_sheet(filas);
  const libro = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(libro, hoja, 'Inventario');

  const wbout = XLSX.write(libro, { type: 'base64', bookType: 'xlsx' });

  const fecha = new Date().toISOString().split('T')[0];
  const archivo = new File(Paths.document, `inventario_${fecha}.xlsx`);

  if (archivo.exists) {
    archivo.delete();
  }
  archivo.create();
  archivo.write(wbout, { encoding: 'base64' });

  const disponible = await Sharing.isAvailableAsync();
  if (disponible) {
    await Sharing.shareAsync(archivo.uri, {
      mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      dialogTitle: 'Exportar inventario',
      UTI: 'com.microsoft.excel.xlsx',
    });
  }
}
