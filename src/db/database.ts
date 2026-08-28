import * as SQLite from 'expo-sqlite';
import { Producto } from '../types/Producto';

const DB_NAME = 'almacen.db';

let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

function getDb(): Promise<SQLite.SQLiteDatabase> {
  if (!dbPromise) {
    dbPromise = SQLite.openDatabaseAsync(DB_NAME);
  }
  return dbPromise;
}

export async function initDatabase(): Promise<void> {
  const db = await getDb();
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS productos (
      id INTEGER PRIMARY KEY NOT NULL,
      nombre TEXT NOT NULL,
      categoria TEXT NOT NULL,
      codigo TEXT,
      cantidad REAL NOT NULL,
      unidad TEXT NOT NULL,
      precio REAL NOT NULL DEFAULT 0,
      fechaEntrada TEXT NOT NULL,
      fechaVencimiento TEXT,
      proveedor TEXT,
      notas TEXT
    );
  `);
}

export async function insertarProducto(producto: Producto): Promise<void> {
  const db = await getDb();
  await db.runAsync(
    `INSERT INTO productos
      (nombre, categoria, codigo, cantidad, unidad, precio, fechaEntrada, fechaVencimiento, proveedor, notas)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      producto.nombre,
      producto.categoria,
      producto.codigo,
      producto.cantidad,
      producto.unidad,
      producto.precio,
      producto.fechaEntrada,
      producto.fechaVencimiento,
      producto.proveedor,
      producto.notas,
    ]
  );
}

export async function obtenerProductos(): Promise<Producto[]> {
  const db = await getDb();
  const rows = await db.getAllAsync<Producto>(
    `SELECT * FROM productos ORDER BY fechaEntrada DESC, id DESC`
  );
  return rows;
}

export async function eliminarProducto(id: number): Promise<void> {
  const db = await getDb();
  await db.runAsync(`DELETE FROM productos WHERE id = ?`, [id]);
}

export async function actualizarProducto(producto: Producto): Promise<void> {
  if (!producto.id) return;
  const db = await getDb();
  await db.runAsync(
    `UPDATE productos SET
      nombre = ?, categoria = ?, codigo = ?, cantidad = ?, unidad = ?,
      precio = ?, fechaEntrada = ?, fechaVencimiento = ?, proveedor = ?, notas = ?
     WHERE id = ?`,
    [
      producto.nombre,
      producto.categoria,
      producto.codigo,
      producto.cantidad,
      producto.unidad,
      producto.precio,
      producto.fechaEntrada,
      producto.fechaVencimiento,
      producto.proveedor,
      producto.notas,
      producto.id,
    ]
  );
}
