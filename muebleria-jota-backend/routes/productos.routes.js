import { Router } from "express";
import { productos } from "../data/productos.js";

const router = Router();

router.get("/", (_req, res) => {
  res.json(productos);
});

router.get("/:id", (req, res) => {
  const producto = productos.find((p) => p.id === Number(req.params.id));
  if (!producto) {
    return res.status(404).json({ error: "Producto no encontrado" });
  }
  res.json(producto);
});

export default router;
