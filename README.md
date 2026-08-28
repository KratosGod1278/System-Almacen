# System-Almacen

App móvil (Android) para registrar inventario de alimentos desde el celular y exportarlo a Excel (.xlsx), evitando anotar en papel antes de pasar los datos al sistema de la empresa.

## Stack

- React Native + Expo (SDK 57) + TypeScript
- expo-sqlite — almacenamiento local
- xlsx (SheetJS) — generación del archivo Excel
- expo-file-system + expo-sharing — guardar y compartir el archivo generado
- React Navigation (bottom tabs) — navegación entre pantallas
- react-native-paper — componentes de UI

## Estructura

```
src/
├── screens/
│   ├── RegistrarProducto.tsx   # formulario de entrada
│   ├── Historial.tsx           # lista de inventario, buscar y eliminar
│   └── Exportar.tsx            # generar y compartir el Excel
├── db/
│   └── database.ts             # setup expo-sqlite + queries
├── utils/
│   └── exportExcel.ts          # lógica de exportación con xlsx
└── types/
    └── Producto.ts             # interface del producto + categorías/unidades sugeridas
```

## Campos del producto

nombre, categoría, código, cantidad, unidad, precio, fecha de entrada, fecha de vencimiento, proveedor, notas.

(Se pueden ajustar en `src/types/Producto.ts` y `src/utils/exportExcel.ts` cuando se defina el formato exacto del sistema de la empresa.)

## Correr el proyecto

```bash
npm install
npx expo start
```

Escanea el QR con la app **Expo Go** (Android) para correrlo en el celular con hot reload.

## Pendientes

- Ajustar columnas del Excel al formato exacto del sistema de la empresa (falta comparar con capturas del sistema real)
- Evaluar sincronización directa con Google Sheets (requiere configurar OAuth)
