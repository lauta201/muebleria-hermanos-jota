
import "dotenv/config";
import express from "express";
import cors from "cors";

import conectarDB from "./config/db.js";
import logger from "./middlewares/logger.js";
import productosRouter from "./routes/productos.routes.js";
import notFound from "./middlewares/notFound.js";
import errorHandler from "./middlewares/errorHandler.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares globales
app.use(logger);
app.use(cors());
app.use(express.json());

// Rutas
app.use("/api/productos", productosRouter);

app.get("/", (_req, res) => {
  res.json({
    mensaje: "API Mueblería Jota funcionando",
  });
});

// Manejo de rutas inexistentes
app.use(notFound);

// Manejo global de errores
app.use(errorHandler);

// Conectar a MongoDB antes de iniciar Express
async function iniciarServidor() {
  try {
    await conectarDB();

    app.listen(PORT, () => {
      console.log(
        `Servidor corriendo en http://localhost:${PORT}`
      );
    });
  } catch (error) {
    console.error(
      "No se pudo iniciar el servidor:",
      error.message
    );

    process.exitCode = 1;
  }
}

iniciarServidor();
