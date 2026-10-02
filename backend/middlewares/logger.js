/**
 * Middleware de logging de peticiones HTTP.
 * Registra en consola el método y la URL de cada request entrante.
 * Se debe registrar como primer middleware para capturar todas las peticiones.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} _res - No se usa; el guión bajo lo indica explícitamente
 * @param {import('express').NextFunction} next
 */
const logger = (req, _res, next) => {
  // Imprime el método HTTP (GET, POST, etc.) y la ruta solicitada
  console.log(`${req.method} ${req.url}`);
  next();
};

export default logger;
