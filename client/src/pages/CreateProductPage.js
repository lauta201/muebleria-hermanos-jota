import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import ProductForm from "../components/ProductForm";
import { useAdminKey } from "../components/AdminKeyProvider";

const URL_PRODUCTOS =
  process.env.REACT_APP_API_URL ||
  "http://localhost:3000/api/productos";

function CreateProductPage({ onProductoCreado }) {
  const navigate = useNavigate();
  const solicitarClave = useAdminKey();

  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");

  async function crearProducto(producto) {
    setError("");

    // Solicitar autorización antes de crear el producto.
    const clave = await solicitarClave();

    // Si la usuaria cancela, no enviamos ninguna solicitud.
    if (clave === null) {
      return;
    }

    setEnviando(true);

    try {
      const respuesta = await fetch(URL_PRODUCTOS, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": clave,
        },
        body: JSON.stringify(producto),
      });

      if (!respuesta.ok) {
        if (respuesta.status === 401 || respuesta.status === 403) {
          throw new Error(
            "La clave de administración es incorrecta."
          );
        }

        throw new Error("No se pudo crear el producto.");
      }

      const productoCreado = await respuesta.json();

      if (onProductoCreado) {
        onProductoCreado(productoCreado);
      }

      navigate("/productos");
    } catch (error) {
      setError(
        error.message || "No pudimos crear el producto."
      );
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