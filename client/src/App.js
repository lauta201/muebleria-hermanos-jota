import { useEffect, useState } from "react";
import {
  Routes,
  Route,
  useNavigate,
  useLocation,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import AdminAccessGuard from "./components/AdminAccessGuard";
import Footer from "./components/Footer";
import ProductList from "./components/ProductList";
import {
  AdminKeyProvider,
  useAdminKey,
} from "./components/AdminKeyProvider";

import HomePage from "./pages/HomePage";
import CatalogPage from "./pages/CatalogPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import ContactPage from "./pages/ContactPage";
import CreateProductPage from "./pages/CreateProductPage";
import EditProductPage from "./pages/EditProductPage";

import "./App.css";

const URL_PRODUCTOS =
  process.env.REACT_APP_API_URL ||
  "http://localhost:3000/api/productos";

function AppContenido() {
  const navigate = useNavigate();
  const location = useLocation();
  const solicitarClave = useAdminKey();

  const [productos, setProductos] = useState([]);
  const [estadoCarga, setEstadoCarga] = useState("carga");
  const [mensajeError, setMensajeError] = useState("");
  const [carrito, setCarrito] = useState([]);

  // Cerrar la sesión administrativa cuando se abandona Administración.
  useEffect(() => {
    if (location.pathname !== "/admin/crear-producto") {
      sessionStorage.removeItem("adminSessionToken");
      sessionStorage.removeItem("adminSessionExpiration");
      sessionStorage.removeItem("adminAccess");
    }
  }, [location.pathname]);

  const cantidadCarrito = carrito.length;

  function agregarAlCarrito(producto) {
    setCarrito((actual) => [...actual, producto]);
  }

  function agregarProductoAlCatalogo(productoCreado) {
    setProductos((productosActuales) => [
      ...productosActuales,
      productoCreado,
    ]);
  }

  function actualizarProductoEnCatalogo(productoActualizado) {
    setProductos((productosActuales) =>
      productosActuales.map((producto) =>
        (producto._id || producto.id) ===
        (productoActualizado._id || productoActualizado.id)
          ? productoActualizado
          : producto
      )
    );
  }

  async function eliminarProducto(producto) {
    const confirmado = window.confirm(
      `¿Estás segura de que querés eliminar "${producto.nombre}"? Esta acción no se puede deshacer.`
    );

    if (!confirmado) {
      return;
    }

    // Solicitar la contraseña de Administración.
    // El backend la verifica y devuelve un token autorizado.
    const token = await solicitarClave();

    if (token === null) {
      return;
    }

    const id = producto._id || producto.id;

    try {
      const respuesta = await fetch(`${URL_PRODUCTOS}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!respuesta.ok) {
        if (
          respuesta.status === 401 ||
          respuesta.status === 403
        ) {
          throw new Error(
            "La autorización de Administración no es válida o venció."
          );
        }

        throw new Error("No se pudo eliminar el producto.");
      }

      setProductos((productosActuales) =>
        productosActuales.filter(
          (item) => (item._id || item.id) !== id
        )
      );

      window.alert("Producto eliminado correctamente.");
    } catch (error) {
      window.alert(
        error.message ||
          "No pudimos eliminar el producto. Intentá nuevamente."
      );
    }
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
        if (error.name === "AbortError") {
          return;
        }

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

                  {estadoCarga === "exito" &&
                    (productosDestacados.length > 0 ? (
                      <ProductList
                        productos={productosDestacados}
                        onVerDetalle={verDetalle}
                      />
                    ) : (
                      <p className="sin-resultados">
                        No hay productos destacados.
                      </p>
                    ))}
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
                onEliminar={eliminarProducto}
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

          {/* Crear productos: requiere iniciar sesión en Administración */}
          <Route
            path="/admin/crear-producto"
            element={
              <AdminAccessGuard>
                <CreateProductPage
                  onProductoCreado={agregarProductoAlCatalogo}
                />
              </AdminAccessGuard>
            }
          />

          {/* Editar productos: solicita la contraseña al guardar */}
          <Route
            path="/admin/editar-producto/:id"
            element={
              <EditProductPage
                onProductoActualizado={actualizarProductoEnCatalogo}
              />
            }
          />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

function App() {
  return (
    <AdminKeyProvider>
      <AppContenido />
    </AdminKeyProvider>
  );
}

export default App;