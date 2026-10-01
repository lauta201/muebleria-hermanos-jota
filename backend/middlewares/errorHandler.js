/**
 * Middleware global de manejo de errores.
 * Firma de 4 parámetros requerida por Express para reconocerlo como error handler.
 * Se registra al final, después del middleware notFound.
 *
 * @param {Error} err  - Error capturado
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next - Necesario aunque no se use (firma obligatoria)
 */

const errorHandler = (err, req, res, next) => {
  // Registrar el error completo en consola para diagnóstico
  console.error(`[ERROR] ${req.method} ${req.url} →`, err);

  const status = err.status || err.statusCode || 500;
  const mensaje = err.message || "Error interno del servidor";

  res.status(status).json({ error: mensaje });
};

export default errorHandler;
