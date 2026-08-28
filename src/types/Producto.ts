export interface Producto {
  id?: number;
  nombre: string;
  categoria: string;
  codigo: string;
  cantidad: number;
  unidad: string; // kg, lb, unidad, litro, etc.
  precio: number;
  fechaEntrada: string; // ISO string (yyyy-mm-dd)
  fechaVencimiento: string; // ISO string (yyyy-mm-dd), puede ir vacío
  proveedor: string;
  notas: string;
}

// Categorías sugeridas para inventario de alimentos.
// Se pueden ajustar libremente desde el formulario.
export const CATEGORIAS_SUGERIDAS = [
  'Carnes',
  'Vegetales',
  'Granos',
  'Lácteos',
  'Condimentos',
  'Bebidas',
  'Otros',
];

export const UNIDADES_SUGERIDAS = ['kg', 'lb', 'unidad', 'litro', 'galón', 'paquete'];
