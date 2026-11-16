
import mongoose from "mongoose";

// Cada producto incluido en un pedido.
const orderItemSchema = new mongoose.Schema(
  {
    producto: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    nombre: {
      type: String,
      required: true,
      trim: true,
    },

    cantidad: {
      type: Number,
      required: true,
      min: 1,
      validate: {
        validator: Number.isInteger,
        message: "La cantidad debe ser un número entero",
      },
    },

    precioUnitario: {
      type: Number,
      required: true,
      min: 0,
    },

    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    _id: false,
  }
);

// Información general del pedido.
const orderSchema = new mongoose.Schema(
  {
    usuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // Identifica un intento de compra.
    solicitudId: {
      type: String,
      trim: true,
      default: undefined,
    },

    productos: {
      type: [orderItemSchema],
      required: true,
      validate: {
        validator: (productos) => productos.length > 0,
        message: "El pedido debe contener al menos un producto",
      },
    },

    total: {
      type: Number,
      required: true,
      min: 0,
    },

    estado: {
      type: String,
      enum: [
        "pendiente",
        "confirmado",
        "enviado",
        "cancelado",
      ],
      default: "pendiente",
    },
  },
  {
    timestamps: true,
  }
);

// Un mismo usuario no puede registrar dos pedidos
// con el mismo identificador de solicitud.
orderSchema.index(
  {
    usuario: 1,
    solicitudId: 1,
  },
  {
    unique: true,
    partialFilterExpression: {
      solicitudId: { $type: "string" },
    },
  }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
