import "dotenv/config";
import express from "express";
import cors from "cors";
import { createHash, timingSafeEqual } from "node:crypto";

import conectarDB from "./config/db.js";
import logger from "./middlewares/logger.js";
import productosRouter from "./routes/productos.routes.js";
import notFound from "./middlewares/notFound.js";
import errorHandler from "./middlewares/errorHandler.js";
import { crearSesionAdmin } from "./utils/adminSession.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares globales
app.use(logger);
app.use(cors());
app.use(express.json());

// Verificar contraseña de acceso a Administración
app.post("/api/admin/verificar-acceso", (req, res) => {
  const contrasena = req.body?.contrasena;
  const contrasenaConfigurada =
    process.env.ADMIN_ACCESS_PASSWORD;

  if (!contrasenaConfigurada) {
    return res.status(503).json({
      error: "El acceso de administración no está configurado.",
    });
  }

  if (typeof contrasena !== "string" || !contrasena) {
    return res.status(400).json({
      error: "Ingresá una contraseña.",
    });
  }

  // Comparar las contraseñas mediante hashes
  const hashIngresado = createHash("sha256")
    .update(contrasena)
    .digest();

  const hashConfigurado = createHash("sha256")
    .update(contrasenaConfigurada)
    .digest();

  const coincide = timingSafeEqual(
    hashIngresado,
    hashConfigurado
  );

  if (!coincide) {
    return res.status(401).json({
      error: "Contraseña incorrecta.",
    });
  }

  // Crear una sesión temporal después de verificar la contraseña
  try {
    const sesion = crearSesionAdmin();

    return res.status(200).json({
      autorizado: true,
      token: sesion.token,
      expiraEn: sesion.expiraEn,
    });
  } catch (error) {
    console.error(
      "No se pudo crear la sesión administrativa:",
      error.message
    );

    return res.status(503).json({
      error: "La administración no está disponible.",
    });
  }
});

// Rutas de productos
app.use("/api/productos", productosRouter);

// Verificar el estado de la API
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