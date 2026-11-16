
import mongoose from "mongoose";
import Product from "../models/Product.js";
import Order from "../models/Order.js";

// Comprobar si un pedido existente corresponde
// a los mismos productos y cantidades.
function coincideConPedido(pedido, cantidades) {
  if (pedido.productos.length !== cantidades.size) {
    return false;
  }

  return pedido.productos.every((item) => {
    const id = item.producto.toString();

    return cantidades.get(id) === item.cantidad;
  });
}

// Registrar un pedido de un usuario autenticado.
export async function crearPedido(req, res) {
  const { productos } = req.body || {};
  const solicitudId = req.get("Idempotency-Key")?.trim();

  // Cada intento de compra debe tener una clave única.
  if (
    !solicitudId ||
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      solicitudId
    )
  ) {
    return res.status(400).json({
      mensaje:
        "La solicitud debe incluir un identificador de compra válido.",
    });
  }

  // Comprobar que el pedido contenga productos.
  if (!Array.isArray(productos) || productos.length === 0) {
    return res.status(400).json({
      mensaje: "El pedido debe contener al menos un producto.",
    });
  }

  // Normalizar y validar los productos recibidos.
  const cantidades = new Map();

  for (const item of productos) {
    const id = item?.producto;
    const cantidad = item?.cantidad;

    if (
      typeof id !== "string" ||
      !mongoose.isValidObjectId(id) ||
      !Number.isSafeInteger(cantidad) ||
      cantidad <= 0
    ) {
      return res.status(400).json({
        mensaje:
          "El pedido contiene productos o cantidades inválidas.",
      });
    }

    const idNormalizado = new mongoose.Types.ObjectId(
      id
    ).toString();

    const acumulado =
      (cantidades.get(idNormalizado) || 0) + cantidad;

    if (!Number.isSafeInteger(acumulado)) {
      return res.status(400).json({
        mensaje: "La cantidad solicitada es demasiado grande.",
      });
    }

    cantidades.set(idNormalizado, acumulado);
  }

  const usuarioId = req.usuario.id;

  // Buscar una compra anterior con la misma clave.
  async function buscarPedidoExistente() {
    return Order.findOne({
      usuario: usuarioId,
      solicitudId,
    });
  }

  // Responder ante un reintento o una clave reutilizada.
  function responderPedidoExistente(pedido) {
    if (!coincideConPedido(pedido, cantidades)) {
      return res.status(409).json({
        mensaje:
          "Este identificador ya se utilizó para una compra diferente.",
      });
    }

    return res.status(200).json({
      mensaje: "Este pedido ya estaba registrado.",
      pedido,
      reutilizado: true,
    });
  }

  try {
    const existente = await buscarPedidoExistente();

    if (existente) {
      return responderPedidoExistente(existente);
    }

    const sesion = await mongoose.startSession();

    try {
      let pedidoCreado;
      let pedidoAnterior;

      await sesion.withTransaction(async () => {
        // Volver a comprobar dentro de la transacción.
        pedidoAnterior = await Order.findOne({
          usuario: usuarioId,
          solicitudId,
        }).session(sesion);

        if (pedidoAnterior) {
          return;
        }

        const productosPedido = [];
        let total = 0;

        for (const [id, cantidad] of cantidades) {
          const producto = await Product.findById(
            id
          ).session(sesion);

          if (!producto) {
            const error = new Error(
              "Uno de los productos ya no está disponible."
            );
            error.status = 404;
            throw error;
          }

          if (producto.stock < cantidad) {
            const error = new Error(
              `No hay stock suficiente de "${producto.nombre}".`
            );
            error.status = 409;
            throw error;
          }

          // Descontar stock dentro de la transacción.
          const actualizado = await Product.updateOne(
            {
              _id: producto._id,
              stock: { $gte: cantidad },
            },
            {
              $inc: { stock: -cantidad },
            },
            { session: sesion }
          );

          if (actualizado.modifiedCount !== 1) {
            const error = new Error(
              `No hay stock suficiente de "${producto.nombre}".`
            );
            error.status = 409;
            throw error;
          }

          const precioUnitario = producto.precio;
          const subtotal = precioUnitario * cantidad;

          productosPedido.push({
            producto: producto._id,
            nombre: producto.nombre,
            cantidad,
            precioUnitario,
            subtotal,
          });

          total += subtotal;
        }

        // Registrar pedido y descuento de stock juntos.
        const pedidos = await Order.create(
          [
            {
              usuario: usuarioId,
              solicitudId,
              productos: productosPedido,
              total,
              estado: "pendiente",
            },
          ],
          { session: sesion }
        );

        pedidoCreado = pedidos[0];
      });

      if (pedidoAnterior) {
        return responderPedidoExistente(pedidoAnterior);
      }

      return res.status(201).json({
        mensaje: "Pedido registrado correctamente.",
        pedido: pedidoCreado,
        reutilizado: false,
      });
    } finally {
      await sesion.endSession();
    }
  } catch (error) {
    // Ante un conflicto por clave duplicada o un
    // reintento de transacción, comprobar si el
    // pedido ya quedó guardado.
    if (
      error.code === 11000 ||
      error.code === 112 ||
      error.hasErrorLabel?.("TransientTransactionError") ||
      error.hasErrorLabel?.("UnknownTransactionCommitResult")
    ) {
      try {
        const existente = await buscarPedidoExistente();

        if (existente) {
          return responderPedidoExistente(existente);
        }
      } catch (errorBusqueda) {
        console.error(
          "Error al consultar pedido existente:",
          errorBusqueda
        );
      }

      return res.status(409).json({
        mensaje:
          "No se pudo confirmar el pedido. Reintentá con el mismo identificador.",
      });
    }

    if (error.status) {
      return res.status(error.status).json({
        mensaje: error.message,
      });
    }

    console.error("Error al crear el pedido:", error);

    return res.status(500).json({
      mensaje:
        "No se pudo confirmar el pedido. Consultá su estado antes de intentar una nueva compra.",
    });
  }
}
