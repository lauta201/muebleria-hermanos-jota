import express from "express";
import cors from "cors";
import productosRouter from "./routes/productos.routes.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/api/productos", productosRouter);

app.get("/", (_req, res) => {
  res.json({ mensaje: "API Mueblería Jota funcionando" });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
