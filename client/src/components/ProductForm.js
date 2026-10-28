
import { useState } from "react";

const valoresIniciales = {
  nombre: "",
  descripcion: "",
  precio: "",
  stock: "",
  imagenUrl: "",
};

function ProductForm({
  productoInicial = valoresIniciales,
  onSubmit,
  enviando = false,
}) {
  const [formData, setFormData] = useState({
    ...valoresIniciales,
    ...productoInicial,
  });

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const precio = Number(formData.precio);
    const stock = Number(formData.stock);

    if (
      !formData.nombre.trim() ||
      formData.precio === "" ||
      formData.stock === "" ||
      !Number.isFinite(precio) ||
      !Number.isInteger(stock) ||
      precio < 0 ||
      stock < 0
    ) {
      alert("Revisá los datos del producto.");
      return;
    }

    const producto = {
      nombre: formData.nombre.trim(),
      descripcion: formData.descripcion.trim(),
      precio,
      stock,
      imagenUrl: formData.imagenUrl.trim(),
    };

    if (onSubmit) {
      await onSubmit(producto);
    }
  }

  return (
    <form
      className="formulario-producto"
      onSubmit={handleSubmit}
    >
      <div>
        <label htmlFor="nombre">Nombre del producto *</label>
        <input
          id="nombre"
          name="nombre"
          type="text"
          value={formData.nombre}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label htmlFor="descripcion">Descripción</label>
        <textarea
          id="descripcion"
          name="descripcion"
          value={formData.descripcion}
          onChange={handleChange}
          rows="4"
        />
      </div>

      <div>
        <label htmlFor="precio">Precio *</label>
        <input
          id="precio"
          name="precio"
          type="number"
          min="0"
          step="0.01"
          value={formData.precio}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label htmlFor="stock">Stock *</label>
        <input
          id="stock"
          name="stock"
          type="number"
          min="0"
          step="1"
          value={formData.stock}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label htmlFor="imagenUrl">URL de imagen</label>
        <input
          id="imagenUrl"
          name="imagenUrl"
          type="text"
          value={formData.imagenUrl}
          onChange={handleChange}
          placeholder="https://ejemplo.com/imagen.jpg"
        />
      </div>

      <button
        type="submit"
        className="btn btn-primario"
        disabled={enviando || !onSubmit}
      >
        {enviando ? "Guardando..." : "Guardar producto"}
      </button>
    </form>
  );
}

export default ProductForm;
