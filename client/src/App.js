import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProductList from "./components/ProductList";
import ProductDetail from "./components/ProductDetail";
import "./App.css";

const URL_PRODUCTOS = "http://localhost:3000/api/productos";

function App() {
  const [productos, setProductos] = useState([]);
  const [estadoCarga, setEstadoCarga] = useState("carga");
  const [mensajeError, setMensajeError] = useState("");
  const [mostrarTodos, setMostrarTodos] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [carrito, setCarrito] = useState([]);

  const cantidadCarrito = carrito.length;

  function agregarAlCarrito(producto) {
    setCarrito((carritoActual) => [...carritoActual, producto]);
  }

  useEffect(() => {
    const controlador = new AbortController();

    async function cargarProductos() {
      setEstadoCarga("carga");
      setMensajeError("");

      try {
        const respuesta = await fetch(URL_PRODUCTOS, {
          signal: controlador.signal,
        });

        if (!respuesta.ok) {
          throw new Error("Respuesta no válida del servidor");
        }

        const datos = await respuesta.json();

        setProductos(Array.isArray(datos) ? datos : []);
        setEstadoCarga("exito");
      } catch (error) {
        if (error.name === "AbortError") {
          return;
        }

        setMensajeError(
          "No pudimos cargar el catálogo en este momento. Verificá que el servidor esté disponible e intentá de nuevo."
        );
        setEstadoCarga("error");
      }
    }

    cargarProductos();

    return () => controlador.abort();
  }, []);

  const productosVisibles = mostrarTodos
    ? productos
    : productos.filter((producto) => producto.destacado === true);

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
              <a
                href="#productos"
                className="btn btn-primario"
                onClick={() => setMostrarTodos(true)}
              >
                Ver catálogo completo
              </a>

              <a href="#contacto" className="btn btn-secundario">
                Contactarnos
              </a>
            </div>
          </div>
        </section>

        {productoSeleccionado ? (
          <ProductDetail
            producto={productoSeleccionado}
            onVolver={() => setProductoSeleccionado(null)}
            onAgregarAlCarrito={agregarAlCarrito}
          />
        ) : (
          <section
            className="seccion"
            id="productos"
            aria-labelledby="tituloDestacados"
          >
            <div className="seccion-cabecera">
              <h2 className="seccion-titulo" id="tituloDestacados">
                {mostrarTodos ? "Todos los productos" : "Productos Destacados"}
              </h2>

              <p className="seccion-subtitulo">
                {mostrarTodos
                  ? "Catálogo completo de nuestra colección"
                  : "Piezas seleccionadas de nuestra colección"}
              </p>
            </div>

            {estadoCarga === "carga" ? (
              <div className="cargando" role="status">
                <div className="spinner" aria-hidden="true" />
                <p>Cargando productos...</p>
              </div>
            ) : null}

            {estadoCarga === "error" ? (
              <div className="mensaje-error-catalogo" role="alert">
                <p>{mensajeError}</p>
              </div>
            ) : null}

            {estadoCarga === "exito" ? (
              productosVisibles.length > 0 ? (
                <ProductList
                  productos={productosVisibles}
                  onVerDetalle={setProductoSeleccionado}
                />
              ) : (
                <p className="sin-resultados">
                  No hay productos para mostrar en este momento.
                </p>
              )
            ) : null}

            {estadoCarga === "exito" ? (
              mostrarTodos ? (
                <button
                  type="button"
                  className="seccion-ver-todo"
                  onClick={() => setMostrarTodos(false)}
                >
                  ← Ver solo destacados
                </button>
              ) : (
                <button
                  type="button"
                  className="seccion-ver-todo"
                  onClick={() => setMostrarTodos(true)}
                >
                  Ver todos los productos →
                </button>
              )
            ) : null}
          </section>
        )}

        <section
          className="seccion seccion-propuesta"
          aria-labelledby="tituloPropuesta"
        >
          <h2
            className="seccion-titulo seccion-propuesta-titulo"
            id="tituloPropuesta"
          >
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