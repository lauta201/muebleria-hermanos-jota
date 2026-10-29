import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ProductForm from "../components/ProductForm";

const URL_PRODUCTOS = "http://localhost:3000/api/productos";

function EditProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();

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
    setEnviando(true);
    setError("");

    try {
      const respuesta = await fetch(
        `${URL_PRODUCTOS}/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(datosProducto),
        }
      );

      if (!respuesta.ok) {
        throw new Error("No se pudo actualizar el producto");
      }

      navigate("/productos");
    } catch (error) {
      setError(
        "No pudimos actualizar el producto. Intentá nuevamente."
      );
    } finally {
      setEnviando(false);
    }
  }

  return (
    <main className="seccion">
      <h1 className="seccion-titulo">Editar producto</h1>

      {cargando && <p>Cargando producto...</p>}

      {error && (
        <p role="alert" className="mensaje-error-catalogo">
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

      <Link to="/productos">← Volver al catálogo</Link>
    </main>
  );
}

export default EditProductPage;