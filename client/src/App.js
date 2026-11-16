
import { useEffect, useState } from "react";
import {
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import ScrollToTop from "./components/ScrollToTop";
import AdminAccessGuard from "./components/AdminAccessGuard";
import Footer from "./components/Footer";
import ProductList from "./components/ProductList";

import { useAuth } from "./context/AuthContext";
import { useCart } from "./context/CartContext";

import HomePage from "./pages/HomePage";
import CatalogPage from "./pages/CatalogPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import ContactPage from "./pages/ContactPage";
import CreateProductPage from "./pages/CreateProductPage";
import EditProductPage from "./pages/EditProductPage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import CartPage from "./pages/CartPage";
import ProfilePage from "./pages/ProfilePage";

import "./App.css";

const URL_PRODUCTOS =
  process.env.REACT_APP_API_URL ||
  "http://localhost:3000/api/productos";

function AppContenido() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  // Estado global del carrito mediante Context API.
  const {
    agregarAlCarrito,
    cantidadCarrito,
  } = useCart();

  // Estado del catálogo.
  const [productos, setProductos] = useState([]);
  const [estadoCarga, setEstadoCarga] = useState("carga");
  const [mensajeError, setMensajeError] = useState("");

  // Verificar el rol del usuario autenticado.
  const esAdministrador =
    currentUser?.roles?.includes("admin") ?? false;

  // Agregar un producto al catálogo.
  function agregarProductoAlCatalogo(productoCreado) {
    setProductos((productosActuales) => [
      ...productosActuales,
      productoCreado,
    ]);
  }

  // Actualizar un producto en el catálogo.
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

  // Eliminar un producto utilizando el JWT del administrador.
  async function eliminarProducto(producto) {
    if (!esAdministrador) {
      window.alert(
        "Tu cuenta no tiene permisos para eliminar productos."
      );
      return;
    }

    const token = localStorage.getItem("authToken");

    if (!token) {
      window.alert(
        "Debés iniciar sesión como administrador para eliminar productos."
      );
      return;
    }

    const confirmado = window.confirm(
      `¿Estás segura de que querés eliminar "${producto.nombre}"? Esta acción no se puede deshacer.`
    );

    if (!confirmado) {
      return;
    }

    const id = producto._id || producto.id;

    try {
      const respuesta = await fetch(
        `${URL_PRODUCTOS}/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!respuesta.ok) {
        if (respuesta.status === 401) {
          throw new Error(
            "Tu sesión expiró o no es válida. Volvé a iniciar sesión."
          );
        }

        if (respuesta.status === 403) {
          throw new Error(
            "Tu cuenta no tiene permisos para eliminar productos."
          );
        }

        const datosError = await respuesta
          .json()
          .catch(() => null);

        throw new Error(
          datosError?.mensaje ||
            datosError?.error ||
            "No se pudo eliminar el producto."
        );
      }

      // Actualizar el catálogo después de eliminar en MongoDB.
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

  // Cargar los productos desde MongoDB.
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

  // Seleccionar los productos destacados.
  const productosDestacados = productos.filter(
    (producto) => producto.destacado === true
  );

  // Navegar al detalle de un producto.
  function verDetalle(producto) {
    navigate(`/productos/${producto._id || producto.id}`);
  }

  return (
    <div className="App">
      {/* Volver arriba al cambiar de página */}
      <ScrollToTop />

      <Navbar cantidadCarrito={cantidadCarrito} />

      <main>
        <Routes>
          {/* Página principal */}
          <Route
            path="/"
            element={
              <>
                <HomePage />

                {/* Productos destacados */}
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
                    <div
                      className="cargando"
                      role="status"
                    >
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

                {/* Propuesta de valor */}
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
                      <p className="propuesta-icono">
                        🪵
                      </p>

                      <h3>Madera Seleccionada</h3>

                      <p>
                        Trabajamos solo con maderas de calidad,
                        sostenibles y con tratamiento artesanal.
                      </p>
                    </article>

                    <article className="propuesta-item">
                      <p className="propuesta-icono">
                        🛠️
                      </p>

                      <h3>Fabricación Propia</h3>

                      <p>
                        Cada pieza sale de nuestro taller,
                        con control de calidad en cada etapa.
                      </p>
                    </article>

                    <article className="propuesta-item">
                      <p className="propuesta-icono">
                        🏠
                      </p>

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

          {/* Catálogo de productos */}
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

          {/* Detalle de producto */}
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

          {/* Contacto */}
          <Route
            path="/contacto"
            element={<ContactPage />}
          />

          {/* Carrito de compras */}
          <Route
            path="/carrito"
            element={<CartPage />}
          />

          {/* Perfil del usuario */}
          <Route
            path="/perfil"
            element={<ProfilePage />}
          />

          {/* Historial de pedidos del usuario */}
          <Route
            path="/mis-pedidos"
            element={<ProfilePage />}
          />

          {/* Registro de usuarios */}
          <Route
            path="/registro"
            element={<RegisterPage />}
          />

          {/* Inicio de sesión */}
          <Route
            path="/login"
            element={<LoginPage />}
          />

          {/* Administración: crear productos */}
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

          {/* Administración: editar productos */}
          <Route
            path="/admin/editar-producto/:id"
            element={
              <AdminAccessGuard>
                <EditProductPage
                  onProductoActualizado={
                    actualizarProductoEnCatalogo
                  }
                />
              </AdminAccessGuard>
            }
          />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

function App() {
  return <AppContenido />;
}

export default App;
