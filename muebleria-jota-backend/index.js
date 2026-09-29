// Punto de entrada del servidor - API Mueblería Jota
import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

// ── Middlewares globales ──────────────────────────────────────────────────────

// Habilita CORS para permitir peticiones desde el frontend
app.use(cors());

// Permite parsear cuerpos JSON en las peticiones
app.use(express.json());

// ── Rutas ─────────────────────────────────────────────────────────────────────

/**
 * GET /
 * Ruta de verificación: confirma que la API está en línea.
 */
app.get("/", (_req, res) => {
  res.json({ mensaje: "API Mueblería Jota funcionando" });
});

// ── Inicio del servidor ───────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
