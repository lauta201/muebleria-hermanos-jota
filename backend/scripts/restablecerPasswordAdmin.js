
import "dotenv/config";
import bcrypt from "bcrypt";
import mongoose from "mongoose";

import User from "../models/User.js";
import conectarDB from "../config/db.js";

async function restablecerPasswordAdmin() {
  try {
    const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    const nuevaPassword = process.env.ADMIN_PASSWORD;

    // Validar las variables de entorno
    if (!email || !nuevaPassword || nuevaPassword.length < 12) {
      throw new Error(
        "Configurá ADMIN_EMAIL y ADMIN_PASSWORD (mínimo 12 caracteres)."
      );
    }

    // Conectar a MongoDB
    await conectarDB();

    // Buscar únicamente al administrador indicado
    const administrador = await User.findOne({ email });

    if (!administrador) {
      throw new Error(
        "No se encontró la cuenta administrativa."
      );
    }

    // Comprobar que realmente tenga el rol admin
    if (!administrador.roles.includes("admin")) {
      throw new Error(
        "La cuenta indicada no tiene permisos de administrador."
      );
    }

    // Generar un nuevo hash de contraseña
    const passwordHash = await bcrypt.hash(nuevaPassword, 12);

    // Actualizar únicamente la contraseña
    administrador.password = passwordHash;

    await administrador.save();

    console.log(
      "Contraseña del administrador actualizada correctamente."
    );
  } catch (error) {
    console.error(
      "Error al restablecer la contraseña:",
      error.message
    );

    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

restablecerPasswordAdmin();
