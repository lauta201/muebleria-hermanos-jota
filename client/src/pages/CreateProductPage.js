
import { Link } from "react-router-dom";

function CreateProductPage() {
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

      <div className="formulario-producto">
        <p>
          Próximamente podrás registrar nuevos muebles
          en nuestro catálogo.
        </p>

        <Link
          to="/productos"
          className="btn btn-primario"
        >
          Volver al catálogo
        </Link>
      </div>
    </section>
  );
}

export default CreateProductPage;
