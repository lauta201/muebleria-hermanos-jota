import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import "./App.css";

function App() {
  const cantidadCarrito = 0;

  return (
    <div className="App">
      <Navbar cantidadCarrito={cantidadCarrito} />

      <main>
        <section className="hero" id="inicio" aria-labelledby="tituloHero">
          <div className="hero-contenido">
            <h1 id="tituloHero">Muebles con alma, hechos para durar</h1>
            <p>
              Más de 30 años de tradición artesanal. Cada pieza fabricada con
              madera seleccionada y el cuidado de quienes aman lo que hacen.
            </p>
            <div className="hero-acciones">
              <a href="#productos" className="btn btn-primario">
                Ver catálogo completo
              </a>
              <a href="#contacto" className="btn btn-secundario">
                Contactarnos
              </a>
            </div>
          </div>
        </section>

        <section
          className="seccion"
          id="productos"
          aria-labelledby="tituloDestacados"
        >
          <div className="seccion-cabecera">
            <h2 className="seccion-titulo" id="tituloDestacados">
              Productos Destacados
            </h2>
            <p className="seccion-subtitulo">
              Piezas seleccionadas de nuestra colección
            </p>
          </div>

          <div
            id="grillaDestacados"
            className="grilla-productos"
            aria-live="polite"
          />

          <a href="#productos" className="seccion-ver-todo">
            Ver todos los productos →
          </a>
        </section>

        <section
          className="seccion seccion-propuesta"
          aria-labelledby="tituloPropuesta"
        >
          <h2 className="seccion-titulo seccion-propuesta-titulo" id="tituloPropuesta">
            ¿Por qué elegirnos?
          </h2>
          <div className="propuesta-lista">
            <article className="propuesta-item">
              <p className="propuesta-icono">🪵</p>
              <h3>Madera Seleccionada</h3>
              <p>
                Trabajamos solo con maderas de calidad, sostenibles y con
                tratamiento artesanal.
              </p>
            </article>

            <article className="propuesta-item">
              <p className="propuesta-icono">🛠️</p>
              <h3>Fabricación Propia</h3>
              <p>
                Cada pieza sale de nuestro taller, con control de calidad en cada
                etapa del proceso.
              </p>
            </article>

            <article className="propuesta-item">
              <p className="propuesta-icono">🏠</p>
              <h3>30 Años de Experiencia</h3>
              <p>
                Una trayectoria de confianza, familia y amor por la carpintería
                argentina.
              </p>
            </article>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default App;
