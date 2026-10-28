
import { useNavigate } from "react-router-dom";
import ProductList from "../components/ProductList";

function CatalogPage({
  productos,
  estadoCarga,
  mensajeError
}) {
  const navigate = useNavigate();

  function verDetalle(producto) {
    const id = producto._id || producto.id;
    navigate(`/productos/${id}`);
  }

  return (
    <section
      className="seccion"
      id="productos"
      aria-labelledby="tituloCatalogo"
    >
      <div className="seccion-cabecera">
        <h1
          className="seccion-titulo"
          id="tituloCatalogo"
        >
          Nuestros Productos
        </h1>

        <p className="seccion-subtitulo">
          Descubrí nuestra colección de muebles
          diseñados para acompañarte durante años.
        </p>
      </div>

      {estadoCarga === "carga" && (
        <div className="cargando" role="status">
          <div
            className="spinner"
            aria-hidden="true"
          />
          <p>Cargando productos...</p>
        </div>
      )}

      {estadoCarga === "error" && (
        <div
          className="mensaje-error-catalogo"
          role="alert"
        >
          <p>{mensajeError}</p>
        </div>
      )}

      {estadoCarga === "exito" && (
        productos.length > 0 ? (
          <ProductList
            productos={productos}
            onVerDetalle={verDetalle}
          />
        ) : (
          <p className="sin-resultados">
            No hay productos disponibles.
          </p>
        )
      )}
    </section>
  );
}

export default CatalogPage;
