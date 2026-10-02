import express from "express";
import cors from "cors";
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
  res.json({ mensaje: "API Mueblería Jota funcionando" });
});

// Manejo de rutas inexistentes (404) — debe ir después de todas las rutas
app.use(notFound);

// Manejo global de errores — siempre al final
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
