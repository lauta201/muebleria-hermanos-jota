import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import ProductForm from "../components/ProductForm";

const URL_PRODUCTOS =
  process.env.REACT_APP_API_URL ||
  "http://localhost:3000/api/productos";

function CreateProductPage({ onProductoCreado }) {
  const navigate = useNavigate();

  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");

  async function crearProducto(producto) {
    setError("");

    const token = sessionStorage.getItem(
      "adminSessionToken"
    );

    if (!token) {
      setError(
        "Tu sesión de administración no está activa. Volvé a ingresar."
      );
      return;
    }

    setEnviando(true);

    try {
      const respuesta = await fetch(URL_PRODUCTOS, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(producto),
      });

      if (!respuesta.ok) {
        if (
          respuesta.status === 401 ||
          respuesta.status === 403
        ) {
          sessionStorage.removeItem("adminSessionToken");
          sessionStorage.removeItem("adminSessionExpiration");

          throw new Error(
            "Tu sesión de administración venció o no es válida. Volvé a ingresar."
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