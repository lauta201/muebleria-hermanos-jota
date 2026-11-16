
import bcrypt from "bcrypt";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

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


export async function iniciarSesion(req, res) {
  try {
    const { email, password } = req.body ?? {};

    if (
      typeof email !== "string" ||
      !email.trim() ||
      typeof password !== "string" ||
      !password
    ) {
      return res.status(400).json({
        mensaje: "Ingresá tu correo y contraseña.",
      });
    }

    // Buscar al usuario incluyendo el hash de la contraseña
    const usuario = await User.findOne({
      email: email.trim().toLowerCase(),
    }).select("+password");

    if (!usuario) {
      return res.status(401).json({
        mensaje: "Credenciales inválidas.",
      });
    }

    // Comparar la contraseña con el hash almacenado
    const contrasenaValida = await bcrypt.compare(
      password,
      usuario.password
    );

    if (!contrasenaValida) {
      return res.status(401).json({
        mensaje: "Credenciales inválidas.",
      });
    }

    // La clave secreta debe estar configurada en el servidor
    if (!process.env.JWT_SECRET) {
      console.error("Falta configurar JWT_SECRET");

      return res.status(503).json({
        mensaje: "El inicio de sesión no está disponible.",
      });
    }

    // Generar un token firmado con vigencia de una hora
    const token = jwt.sign(
      {
        id: usuario._id.toString(),
        username: usuario.username,
        roles: usuario.roles,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
        algorithm: "HS256",
      }
    );

    return res.status(200).json({
      mensaje: "Inicio de sesión exitoso.",
      token,
      usuario: {
        id: usuario._id,
        username: usuario.username,
        email: usuario.email,
        roles: usuario.roles,
      },
    });
  } catch (error) {
    console.error("Error al iniciar sesión:", error);

    return res.status(500).json({
      mensaje: "Error interno al iniciar sesión.",
    });
  }
}
