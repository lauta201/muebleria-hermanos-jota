# Mueblería Hermanos Jota — Backend API

API REST para el catálogo de productos de **Mueblería Hermanos Jota**, construida con **Node.js + Express** usando ES Modules.

---

## Requisitos

- Node.js >= 18
- npm >= 9

---

## Instalación

```bash
cd muebleria-jota-backend
npm install
```

---

## Correr el servidor

| Modo | Comando | Descripción |
|------|---------|-------------|
| Desarrollo (hot reload) | `npm run dev` | Usa nodemon, reinicia al guardar |
| Producción | `npm start` | Usa node directamente |

El servidor levanta en `http://localhost:3000` por defecto.  
Para cambiar el puerto, creá un archivo `.env` con:

```
PORT=4000
```

---

## Estructura de carpetas

```
muebleria-jota-backend/
├── data/
│   └── productos.js          # Datos en memoria (catálogo de muebles)
├── middlewares/
│   ├── logger.js             # Loguea método y URL de cada request
│   ├── notFound.js           # Manejo de rutas inexistentes (404)
│   └── errorHandler.js       # Manejo global de errores
├── routes/
│   └── productos.routes.js   # Endpoints del catálogo de productos
├── .gitignore
├── index.js                  # Punto de entrada — configura Express y monta rutas
├── package.json
└── README.md
```

---

## Endpoints

### `GET /`

Verifica que la API esté funcionando.

```bash
curl http://localhost:3000/
```

**Respuesta 200:**
```json
{ "mensaje": "API Mueblería Jota funcionando" }
```

---

### `GET /api/productos`

Devuelve el listado completo de productos.

```bash
curl http://localhost:3000/api/productos
```

**Respuesta 200:**
```json
[
  {
    "id": 1,
    "nombre": "Sofá Patagonia",
    "categoria": "Living",
    "precio": 185000,
    "destacado": true,
    ...
  },
  ...
]
```

---

### `GET /api/productos/:id`

Devuelve un producto por su `id` numérico.

```bash
# Producto existente
curl http://localhost:3000/api/productos/1

# Producto inexistente
curl http://localhost:3000/api/productos/9999
```

**Respuesta 200 (encontrado):**
```json
{
  "id": 1,
  "nombre": "Sofá Patagonia",
  "categoria": "Living",
  "precio": 185000,
  ...
}
```

**Respuesta 404 (no encontrado):**
```json
{ "error": "Producto no encontrado" }
```

---

### Ruta inexistente (cualquier path no definido)

```bash
curl http://localhost:3000/ruta-que-no-existe
```

**Respuesta 404:**
```json
{ "error": "Ruta no encontrada" }
```

---

## Stack técnico

| Tecnología | Versión | Uso |
|------------|---------|-----|
| Node.js | >= 18 | Runtime |
| Express | ^5 | Framework HTTP |
| cors | ^2 | Política CORS |
| nodemon | ^3 | Hot reload en desarrollo |
