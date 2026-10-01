/**
 * Middleware para manejar rutas inexistentes (404).
 * Se registra al final, después de todas las rutas definidas.
 */
const notFound = (_req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
};

export default notFound;
