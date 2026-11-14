
import { useNavigate } from "react-router-dom";
import ProductList from "../components/ProductList";
import { useAuth } from "../context/AuthContext";

function CatalogPage({
  productos,
  estadoCarga,
  mensajeError,
  onEliminar,
}) {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  // Comprobar si el usuario tiene permisos administrativos.
  const esAdministrador =
    currentUser?.roles?.includes("admin") ?? false;

  // Navegar al detalle del producto.
  function verDetalle(producto) {
    const id = producto._id || producto.id;
    navigate(`/productos/${id}`);
  }

  // Navegar a la edición del producto.
  function editarProducto(producto) {
    if (!esAdministrador) {
      return;
    }

    const id = producto._id || producto.id;
    navigate(`/admin/editar-producto/${id}`);
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

      {estadoCarga === "exito" &&
        (productos.length > 0 ? (
          <ProductList
            productos={productos}
            onVerDetalle={verDetalle}
            onEditar={
              esAdministrador ? editarProducto : undefined
            }
            onEliminar={
              esAdministrador ? onEliminar : undefined
            }
          />
        ) : (
          <p className="sin-resultados">
            No hay productos disponibles.
          </p>
        ))}
    </section>
  );
}

export default CatalogPage;
