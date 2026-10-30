
import { useNavigate, useParams } from "react-router-dom";
import ProductDetail from "../components/ProductDetail";

function ProductDetailPage({
  productos,
  estadoCarga,
  mensajeError,
  onAgregarAlCarrito
}) {
  const { id } = useParams();
  const navigate = useNavigate();

  const producto = productos.find(
    (item) => String(item._id || item.id) === id
  );

  if (estadoCarga === "carga") {
    return (
      <div className="cargando" role="status">
        <div className="spinner" aria-hidden="true" />
        <p>Cargando producto...</p>
      </div>
    );
  }

  if (estadoCarga === "error") {
    return (
      <div className="mensaje-error-catalogo" role="alert">
        <p>{mensajeError}</p>
      </div>
    );
  }

  if (!producto) {
    return (
      <section className="seccion">
        <h1>Producto no encontrado</h1>
        <p>El producto que buscás no está disponible.</p>

        <button
          type="button"
          className="btn btn-primario"
          onClick={() => navigate("/productos")}
        >
          Volver al catálogo
        </button>
      </section>
    );
  }

  return (
    <ProductDetail
      producto={producto}
      onVolver={() => navigate("/productos")}
      onAgregarAlCarrito={onAgregarAlCarrito}
    />
  );
}

export default ProductDetailPage;
