import { Router } from "express";
import { productos } from "../data/productos.js";

/**
 * Router de productos.
 * Gestiona los endpoints relacionados con el catálogo de muebles.
 * Base path: /api/productos (definido en index.js)
 */
const router = Router();

/**
 * GET /api/productos
 * Devuelve el listado completo de productos.
 * Responde 200 con un array JSON de todos los productos.
 */
router.get("/", (_req, res) => {
  res.json(productos);
});

/**
 * GET /api/productos/:id
 * Busca un producto por su id numérico.
 * Responde 200 con el producto encontrado o 404 si no existe.
 *
 * @param {string} req.params.id - Id del producto (se convierte a Number)
 */
router.get("/:id", (req, res) => {
  // Convertir el parámetro de ruta a número para comparar con los ids del array
  const producto = productos.find((p) => p.id === Number(req.params.id));

  if (!producto) {
    return res.status(404).json({ error: "Producto no encontrado" });
  }

  res.json(producto);
});

export default router;
