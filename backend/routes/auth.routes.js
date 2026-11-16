
import { Router } from "express";

import {
  registrarUsuario,
  iniciarSesion,
} from "../controllers/authController.js";

import { verificarToken } from "../middlewares/authMiddleware.js";

const router = Router();

// POST /api/usuarios/registro
// Permite registrar nuevos usuarios.
router.post("/registro", registrarUsuario);

// POST /api/usuarios/login
// Verifica las credenciales y genera un JWT.
router.post("/login", iniciarSesion);

// GET /api/usuarios/perfil
// Solo permite acceder a usuarios autenticados.
router.get("/perfil", verificarToken, (req, res) => {
  res.status(200).json({
    mensaje: "Perfil obtenido correctamente.",
    usuario: req.usuario,
  });
});

export default router;
