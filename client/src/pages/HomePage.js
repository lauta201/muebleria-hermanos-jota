
import { Link } from "react-router-dom";

function HomePage() {
  return (
    <section
      className="hero"
      id="inicio"
      aria-labelledby="tituloHero"
    >
      <div className="hero-contenido">
        <h1 id="tituloHero">
          Muebles con alma, hechos para durar
        </h1>

        <p>
          Más de 30 años de tradición artesanal.
          Cada pieza fabricada con madera seleccionada
          y el cuidado de quienes aman lo que hacen.
        </p>

        <div className="hero-acciones">
          <Link
            to="/productos"
            className="btn btn-primario"
          >
            Ver catálogo completo
          </Link>

          <Link
            to="/contacto"
            className="btn btn-secundario"
          >
            Contactarnos
          </Link>
        </div>
      </div>
    </section>
  );
}

export default HomePage;
