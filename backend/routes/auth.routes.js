
import { Router } from "express";
import { registrarUsuario } from "../controllers/authController.js";

const router = Router();

// POST /api/usuarios/registro
// Permite registrar nuevos usuarios.
router.post("/registro", registrarUsuario);

export default router;
