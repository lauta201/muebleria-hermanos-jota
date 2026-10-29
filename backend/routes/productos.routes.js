import { Router } from "express";
import mongoose from "mongoose";
import Product from "../models/Product.js";

const router = Router();

/**
 * GET /api/productos
 * Devuelve todos los productos almacenados en MongoDB.
 */
router.get("/", async (_req, res) => {
  try {
    const productos = await Product.find();

    res.status(200).json(productos);
  } catch (error) {
    console.error("Error al obtener productos:", error);
    res.status(500).json({
      error: "Error interno al obtener los productos",
    });
  }
});

/**
 * GET /api/productos/:id
 * Devuelve un producto según su identificador de MongoDB.
 */
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        error: "Identificador de producto inválido",
      });
    }

    const producto = await Product.findById(id);

    if (!producto) {
      return res.status(404).json({
        error: "Producto no encontrado",
      });
    }

    res.status(200).json(producto);
  } catch (error) {
    console.error("Error al obtener el producto:", error);
    res.status(500).json({
      error: "Error interno al obtener el producto",
    });
  }
});

/**
 * POST /api/productos
 * Crea un producto nuevo en MongoDB.
 */
router.post("/", async (req, res) => {
  try {
    const { nombre, descripcion, precio, stock, imagenUrl } = req.body;

    // Validar los campos obligatorios
    if (
      typeof nombre !== "string" ||
      !nombre.trim() ||
      precio === undefined ||
      precio === null ||
      precio === ""
    ) {
      return res.status(400).json({
        error: "El nombre y el precio son obligatorios",
      });
    }

    // Crear el producto
    const nuevoProducto = await Product.create({
      nombre: nombre.trim(),
      descripcion,
      precio,
      stock,
      imagenUrl,
    });

    res.status(201).json(nuevoProducto);
  } catch (error) {
    if (error.name === "ValidationError" || error.name === "CastError") {
      return res.status(400).json({
        error: "Los datos del producto no son válidos",
      });
    }

    console.error("Error al crear producto:", error);

    res.status(500).json({
      error: "Error interno al crear el producto",
    });
  }
});

/**
 * PUT /api/productos/:id
 * Actualiza un producto existente en MongoDB.
 */
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        error: "Identificador de producto inválido",
      });
    }

    const camposPermitidos = [
      "nombre",
      "descripcion",
      "precio",
      "stock",
      "imagenUrl",
      "categoria",
      "destacado",
    ];

    const actualizaciones = {};

    for (const campo of camposPermitidos) {
      if (Object.prototype.hasOwnProperty.call(req.body, campo)) {
        actualizaciones[campo] = req.body[campo];
      }
    }

    if (Object.keys(actualizaciones).length === 0) {
      return res.status(400).json({
        error: "No se proporcionaron campos para actualizar",
      });
    }

    const productoActualizado = await Product.findByIdAndUpdate(
      id,
      { $set: actualizaciones },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!productoActualizado) {
      return res.status(404).json({
        error: "Producto no encontrado",
      });
    }

    res.status(200).json(productoActualizado);
  } catch (error) {
    if (error.name === "ValidationError" || error.name === "CastError") {
      return res.status(400).json({
        error: "Los datos enviados no son válidos",
      });
    }

    console.error("Error al actualizar producto:", error);

    res.status(500).json({
      error: "Error interno al actualizar el producto",
    });
  }
});

/**
 * DELETE /api/productos/:id
 * Elimina un producto de MongoDB.
 */
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        error: "Identificador de producto inválido",
      });
    }

    const productoEliminado = await Product.findByIdAndDelete(id);

    if (!productoEliminado) {
      return res.status(404).json({
        error: "Producto no encontrado",
      });
    }

    res.status(200).json({
      mensaje: "Producto eliminado correctamente",
      producto: productoEliminado,
    });
  } catch (error) {
    console.error("Error al eliminar producto:", error);

    res.status(500).json({
      error: "Error interno al eliminar el producto",
    });
  }
});

export default router;