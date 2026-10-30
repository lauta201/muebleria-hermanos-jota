
import "dotenv/config";
import mongoose from "mongoose";

import conectarDB from "./config/db.js";
import Product from "./models/Product.js";
import { productos } from "./data/productos.js";

async function cargarProductos() {
  try {
    await conectarDB();

    const cantidadActual = await Product.countDocuments();

    if (cantidadActual > 0) {
      console.log(
        "La colección ya contiene productos. No se insertaron duplicados."
      );
      return;
    }

    const productosParaMongoDB = productos.map((producto) => ({
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      descripcionCompleta: producto.descripcionCompleta,
      precio: producto.precio,
      stock: 10,
      imagenUrl: producto.imagen,
      imagen: producto.imagen,
      categoria: producto.categoria,
      material: producto.material,
      dimensiones: producto.dimensiones,
      destacado: producto.destacado,
    }));

    const productosGuardados = await Product.insertMany(
      productosParaMongoDB
    );

    console.log(
      `Se cargaron ${productosGuardados.length} productos en MongoDB.`
    );
  } catch (error) {
    console.error(
      "Error al cargar los productos:",
      error.message
    );

    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

cargarProductos();
