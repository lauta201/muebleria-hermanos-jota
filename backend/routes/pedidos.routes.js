
import { Router } from "express";

import { verificarToken } from "../middlewares/authMiddleware.js";

import {
  crearPedido,
  obtenerMisPedidos,
} from "../controllers/orderController.js";

const router = Router();

// Consultar el historial del usuario autenticado.
router.get("/mis-pedidos", verificarToken, obtenerMisPedidos);

// Registrar un pedido de un usuario autenticado.
router.post("/", verificarToken, crearPedido);

export default router;
