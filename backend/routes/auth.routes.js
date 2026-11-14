
import { Router } from "express";
import {
  registrarUsuario,
  iniciarSesion,
} from "../controllers/authController.js";

const router = Router();

// POST /api/usuarios/registro
// Permite registrar nuevos usuarios.
router.post("/registro", registrarUsuario);

// POST /api/usuarios/login
// Verifica las credenciales y genera un JWT.
router.post("/login", iniciarSesion);

export default router;
