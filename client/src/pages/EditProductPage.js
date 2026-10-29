import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import ProductForm from "../components/ProductForm";
import { useAdminKey } from "../components/AdminKeyProvider";

const URL_PRODUCTOS =
  process.env.REACT_APP_API_URL ||
  "http://localhost:3000/api/productos";

function EditProductPage({ onProductoActualizado }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const solicitarClave = useAdminKey();

  const [producto, setProducto] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const controlador = new AbortController();

    async function cargarProducto() {
      try {
        const respuesta = await fetch(
          `${URL_PRODUCTOS}/${id}`,
          { signal: controlador.signal }
        );

        if (!respuesta.ok) {
          throw new Error("No se pudo obtener el producto");
        }

        const datos = await respuesta.json();
        setProducto(datos);
      } catch (error) {
        if (error.name !== "AbortError") {
          setError("No pudimos cargar el producto.");
        }
      } finally {
        if (!controlador.signal.aborted) {
          setCargando(false);
        }
      }
    }

    cargarProducto();

    return () => controlador.abort();
  }, [id]);

  async function actualizarProducto(datosProducto) {
    setError("");

    // Solicitar la clave antes de enviar la modificación.
    const clave = await solicitarClave();

    // Si se cancela, el producto no se modifica.
    if (clave === null) {
      return;
    }

    setEnviando(true);

    try {
      const respuesta = await fetch(
        `${URL_PRODUCTOS}/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "x-admin-key": clave,
          },
          body: JSON.stringify(datosProducto),
        }
      );

      if (!respuesta.ok) {
        if (
          respuesta.status === 401 ||
          respuesta.status === 403
        ) {
          throw new Error(
            "La clave de administración es incorrecta."
          );
        }

        throw new Error("No se pudo actualizar el producto.");
      }

      const productoActualizado = await respuesta.json();

      if (onProductoActualizado) {
        onProductoActualizado(productoActualizado);
      }

      navigate("/productos");
    } catch (error) {
      setError(
        error.message ||
          "No pudimos actualizar el producto. Intentá nuevamente."
      );
    } finally {
      setEnviando(false);
    }
  }

  return (
    <section className="seccion">
      <h1 className="seccion-titulo">
        Editar producto
      </h1>

      {cargando && <p>Cargando producto...</p>}

      {error && (
        <p
          role="alert"
          className="mensaje-error-catalogo"
        >
          {error}
        </p>
      )}

      {!cargando && producto && (
        <ProductForm
          productoInicial={producto}
          onSubmit={actualizarProducto}
          enviando={enviando}
          textoBoton="Actualizar producto"
        />
      )}

      <Link to="/productos">
        ← Volver al catálogo
      </Link>
    </section>
  );
}

export default EditProductPage;