
import "dotenv/config";
import bcrypt from "bcrypt";
import mongoose from "mongoose";

import User from "../models/User.js";
import conectarDB from "../config/db.js";

async function crearAdministrador() {
  try {
    const username = process.env.ADMIN_USERNAME?.trim();
    const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    const password = process.env.ADMIN_PASSWORD;

    if (
      !username ||
      !email ||
      !password ||
      password.length < 12
    ) {
      throw new Error(
        "Configurá ADMIN_USERNAME, ADMIN_EMAIL y ADMIN_PASSWORD (mínimo 12 caracteres)."
      );
    }

    await conectarDB();

    const existente = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existente) {
      throw new Error(
        "Ya existe una cuenta con ese nombre de usuario o correo."
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const administrador = await User.create({
      username,
      email,
      password: passwordHash,
      roles: ["admin"],
    });

    console.log(
      `Administrador creado correctamente: ${administrador.email}`
    );
  } catch (error) {
    console.error("No se pudo crear el administrador:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

crearAdministrador();
