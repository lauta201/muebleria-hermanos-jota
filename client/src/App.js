
import { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProductList from "./components/ProductList";

import HomePage from "./pages/HomePage";
import CatalogPage from "./pages/CatalogPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import ContactPage from "./pages/ContactPage";
import CreateProductPage from "./pages/CreateProductPage";

import "./App.css";

const URL_PRODUCTOS = "http://localhost:3000/api/productos";

function App() {
  const navigate = useNavigate();

  const [productos, setProductos] = useState([]);
  const [estadoCarga, setEstadoCarga] = useState("carga");
  const [mensajeError, setMensajeError] = useState("");
  const [carrito, setCarrito] = useState([]);

  const cantidadCarrito = carrito.length;

  function agregarAlCarrito(producto) {
    setCarrito((actual) => [...actual, producto]);
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
          throw new Error("Error al obtener productos");
        }

        const datos = await respuesta.json();

        setProductos(Array.isArray(datos) ? datos : []);
        setEstadoCarga("exito");
      } catch (error) {
        if (error.name === "AbortError") return;

        setMensajeError(
          "No pudimos cargar el catálogo. Verificá que el servidor esté disponible."
        );
        setEstadoCarga("error");
      }
    }

    cargarProductos();

    return () => controlador.abort();
  }, []);

  const productosDestacados = productos.filter(
    (producto) => producto.destacado === true
  );

  function verDetalle(producto) {
    navigate(`/productos/${producto._id || producto.id}`);
  }

  return (
    <div className="App">
      <Navbar cantidadCarrito={cantidadCarrito} />

      <main>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <HomePage />

                <section
                  className="seccion"
                  id="productos"
                  aria-labelledby="tituloDestacados"
                >
                  <div className="seccion-cabecera">
                    <h2
                      className="seccion-titulo"
                      id="tituloDestacados"
                    >
                      Productos Destacados
                    </h2>

                    <p className="seccion-subtitulo">
                      Piezas seleccionadas de nuestra colección
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
                    productosDestacados.length > 0 ? (
                      <ProductList
                        productos={productosDestacados}
                        onVerDetalle={verDetalle}
                      />
                    ) : (
                      <p className="sin-resultados">
                        No hay productos destacados.
                      </p>
                    )
                  )}
                </section>

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
                        Trabajamos solo con maderas de calidad,
                        sostenibles y con tratamiento artesanal.
                      </p>
                    </article>

                    <article className="propuesta-item">
                      <p className="propuesta-icono">🛠️</p>
                      <h3>Fabricación Propia</h3>
                      <p>
                        Cada pieza sale de nuestro taller,
                        con control de calidad en cada etapa.
                      </p>
                    </article>

                    <article className="propuesta-item">
                      <p className="propuesta-icono">🏠</p>
                      <h3>30 Años de Experiencia</h3>
                      <p>
                        Una trayectoria de confianza, familia
                        y amor por la carpintería argentina.
                      </p>
                    </article>
                  </div>
                </section>
              </>
            }
          />

          <Route
            path="/productos"
            element={
              <CatalogPage
                productos={productos}
                estadoCarga={estadoCarga}
                mensajeError={mensajeError}
              />
            }
          />

          <Route
            path="/productos/:id"
            element={
              <ProductDetailPage
                productos={productos}
                estadoCarga={estadoCarga}
                mensajeError={mensajeError}
                onAgregarAlCarrito={agregarAlCarrito}
              />
            }
          />

          <Route
            path="/contacto"
            element={<ContactPage />}
          />

          <Route
            path="/admin/crear-producto"
            element={<CreateProductPage />}
          />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
