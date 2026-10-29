
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ProductForm from "../components/ProductForm";

const URL_PRODUCTOS = "http://localhost:3000/api/productos";

function CreateProductPage({ onProductoCreado }) {
  const navigate = useNavigate();

  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");

  async function crearProducto(producto) {
    setEnviando(true);
    setError("");

    try {
      const respuesta = await fetch(URL_PRODUCTOS, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(producto),
      });

      if (!respuesta.ok) {
        throw new Error("No se pudo crear el producto.");
      }
      
      const productoCreado = await respuesta.json();
      
      if (onProductoCreado) {
        onProductoCreado(productoCreado);
      }
      
      navigate("/productos");
    } catch (error) {
      setError(error.message);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <section className="seccion">
      <div className="seccion-cabecera">
        <h1 className="seccion-titulo">
          Agregar nuevo producto
        </h1>

        <p className="seccion-subtitulo">
          Administración del catálogo de Hermanos Jota
        </p>
      </div>

      {error && (
        <div
          className="mensaje-error-catalogo"
          role="alert"
        >
          <p>{error}</p>
        </div>
      )}

      <ProductForm
        onSubmit={crearProducto}
        enviando={enviando}
      />

      <Link to="/productos">
        Volver al catálogo
      </Link>
    </section>
  );
}

export default CreateProductPage;

