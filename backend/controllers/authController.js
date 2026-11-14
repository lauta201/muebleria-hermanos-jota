
import bcrypt from "bcrypt";
import User from "../models/User.js";

// Registrar un nuevo usuario
export async function registrarUsuario(req, res) {
  try {
    const { username, email, password } = req.body;

    // Validar los datos recibidos
    if (
      typeof username !== "string" ||
      !username.trim() ||
      typeof email !== "string" ||
      !email.trim() ||
      typeof password !== "string" ||
      password.length < 8
    ) {
      return res.status(400).json({
        mensaje: "Ingresá un usuario, un correo y una contraseña de al menos 8 caracteres.",
      });
    }

    const nombreUsuario = username.trim();
    const correo = email.trim().toLowerCase();

    // Comprobar que no exista otro usuario con esos datos
    const usuarioExistente = await User.findOne({
      $or: [
        { username: nombreUsuario },
        { email: correo },
      ],
    });

    if (usuarioExistente) {
      return res.status(409).json({
        mensaje: "El nombre de usuario o correo ya está registrado.",
      });
    }

    // Proteger la contraseña con bcrypt
    const passwordHash = await bcrypt.hash(password, 10);

    // Crear el usuario con permisos de cliente
    const nuevoUsuario = await User.create({
      username: nombreUsuario,
      email: correo,
      password: passwordHash,
      roles: ["cliente"],
    });

    // Responder sin devolver el hash de la contraseña
    return res.status(201).json({
      mensaje: "Usuario registrado correctamente.",
      usuario: {
        id: nuevoUsuario._id,
        username: nuevoUsuario.username,
        email: nuevoUsuario.email,
        roles: nuevoUsuario.roles,
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        mensaje: "El nombre de usuario o correo ya está registrado.",
      });
    }

    console.error("Error al registrar usuario:", error);

    return res.status(500).json({
      mensaje: "Error interno al registrar el usuario.",
    });
  }
}
