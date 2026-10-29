
import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true,
    },

    descripcion: {
      type: String,
      trim: true,
      default: "",
    },

    precio: {
      type: Number,
      required: true,
      min: 0,
    },

    stock: {
      type: Number,
      default: 0,
      min: [0, "El stock no puede ser negativo"],
      validate: {
        validator: Number.isInteger,
        message: "El stock debe ser un número entero",
      },
    },

    imagenUrl: {
      type: String,
      default: "",
    },

    
categoria: {
    type: String,
    default: "",
  },
  
  descripcionCompleta: {
    type: String,
    default: "",
  },
  
  material: {
    type: String,
    default: "",
  },
  
  dimensiones: {
    type: String,
    default: "",
  },
  
  destacado: {
    type: Boolean,
    default: false,
  },
  
  imagen: {
    type: String,
    default: "",
  },
  
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model(
  "Product",
  productSchema,
  "productos"
);

export default Product;
