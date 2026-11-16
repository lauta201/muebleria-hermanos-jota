
import { Router } from "express";
import { verificarToken } from "../middlewares/authMiddleware.js";
import { crearPedido } from "../controllers/orderController.js";

const router = Router();

// Registrar un pedido de un usuario autenticado.
router.post("/", verificarToken, crearPedido);

export default router;
