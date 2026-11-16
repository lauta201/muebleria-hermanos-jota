
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Verifica que la solicitud pertenezca a un usuario autenticado.
export async function verificarToken(req, res, next) {
  try {
    const autorizacion = req.get("Authorization");

    if (!autorizacion || !autorizacion.startsWith("Bearer ")) {
      return res.status(401).json({
        mensaje: "Debés iniciar sesión para continuar.",
      });
    }

    const token = autorizacion.slice(7).trim();

    if (!token) {
      return res.status(401).json({
        mensaje: "No se proporcionó un token.",
      });
    }

    if (!process.env.JWT_SECRET) {
      console.error("Falta configurar JWT_SECRET");

      return res.status(503).json({
        mensaje: "La autenticación no está disponible.",
      });
    }

    // Verificar la firma y el vencimiento del JWT.
    const datos = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ["HS256"],
    });

    // Comprobar que el usuario todavía existe en MongoDB.
    const usuario = await User.findById(datos.id);

    if (!usuario) {
      return res.status(401).json({
        mensaje: "El usuario ya no existe.",
      });
    }

    // Dejar disponibles sus datos para las rutas protegidas.
    req.usuario = {
      id: usuario._id.toString(),
      username: usuario.username,
      email: usuario.email,
      roles: usuario.roles,
    };

    next();
  } catch (error) {
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError" ||
      error.name === "NotBeforeError" ||
      error.name === "CastError"
    ) {
      return res.status(401).json({
        mensaje: "La sesión es inválida o expiró.",
      });
    }

    console.error("Error al verificar autenticación:", error);

    return res.status(500).json({
      mensaje: "Error interno de autenticación.",
    });
  }
}


/**
 * Permite continuar únicamente a los usuarios
 * autenticados que tengan el rol administrador.
 *
 * Debe ejecutarse después de verificarToken.
 */
export function verificarAdmin(req, res, next) {
  if (!req.usuario) {
    return res.status(401).json({
      mensaje: "Debés iniciar sesión para continuar.",
    });
  }

  if (!req.usuario.roles?.includes("admin")) {
    return res.status(403).json({
      mensaje: "No tenés permisos de administrador.",
    });
  }

  next();
}
