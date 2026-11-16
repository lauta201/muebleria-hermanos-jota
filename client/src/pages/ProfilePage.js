
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import "./ProfilePage.css";

const API_URL =
  process.env.REACT_APP_API_URL?.replace(/\/api\/productos\/?$/, "") ||
  "http://localhost:3000";

// Formatear importes en pesos argentinos.
function formatearPrecio(precio) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(precio);
}

// Mostrar la fecha del pedido.
function formatearFecha(fecha) {
  if (!fecha) return "Fecha no disponible";

  const fechaPedido = new Date(fecha);

  if (Number.isNaN(fechaPedido.getTime())) {
    return "Fecha no disponible";
  }

  return new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(fechaPedido);
}

function ProfilePage() {
  const navigate = useNavigate();

  const { currentUser, cargandoSesion } = useAuth();

  const [pedidos, setPedidos] = useState([]);
  const [cargandoPedidos, setCargandoPedidos] = useState(true);
  const [errorPedidos, setErrorPedidos] = useState("");

  // Proteger el perfil cuando no hay una sesión iniciada.
  useEffect(() => {
    if (!cargandoSesion && !currentUser) {
      navigate("/login", {
        replace: true,
        state: {
          from: "/perfil",
        },
      });
    }
  }, [currentUser, cargandoSesion, navigate]);

  // Consultar los pedidos del usuario autenticado.
  useEffect(() => {
    if (cargandoSesion || !currentUser) {
      return;
    }

    const controlador = new AbortController();

    async function cargarPedidos() {
      setCargandoPedidos(true);
      setErrorPedidos("");

      try {
        const token = localStorage.getItem("authToken");

        const respuesta = await fetch(
          `${API_URL}/api/pedidos/mis-pedidos`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            signal: controlador.signal,
          }
        );

        const datos = await respuesta.json();

        if (!respuesta.ok) {
          throw new Error(
            datos.mensaje ||
              "No pudimos obtener tus pedidos."
          );
        }

        setPedidos(
          Array.isArray(datos.pedidos) ? datos.pedidos : []
        );
      } catch (error) {
        if (error.name === "AbortError") {
          return;
        }

        setErrorPedidos(
          error.message ||
            "No pudimos cargar el historial de pedidos."
        );
      } finally {
        if (!controlador.signal.aborted) {
          setCargandoPedidos(false);
        }
      }
    }

    cargarPedidos();

    return () => controlador.abort();
  }, [currentUser, cargandoSesion]);

  // Esperar mientras se verifica la sesión.
  if (cargandoSesion || !currentUser) {
    return (
      <section className="seccion perfil-pagina">
        <div className="cargando" role="status">
          <div className="spinner" aria-hidden="true" />
          <p>Verificando tu cuenta...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="seccion perfil-pagina">
      <div className="seccion-cabecera">
        <h1 className="seccion-titulo">Mi perfil</h1>

        <p className="seccion-subtitulo">
          Consultá los datos de tu cuenta y tus compras
          en Hermanos Jota.
        </p>
      </div>

      <div className="perfil-contenido">
        {/* Información de la cuenta */}
        <section
          className="perfil-tarjeta"
          aria-labelledby="perfil-datos-titulo"
        >
          <div className="perfil-tarjeta-encabezado">
            <h2 id="perfil-datos-titulo">
              Mi información
            </h2>
          </div>

          <dl className="perfil-datos">
            <div className="perfil-dato">
              <dt>Nombre de usuario</dt>
              <dd>{currentUser.username}</dd>
            </div>

            <div className="perfil-dato">
              <dt>Correo electrónico</dt>
              <dd>{currentUser.email}</dd>
            </div>

            <div className="perfil-dato">
              <dt>Tipo de cuenta</dt>
              <dd>
                {currentUser.roles?.includes("admin")
                  ? "Administrador"
                  : "Cliente"}
              </dd>
            </div>
          </dl>
        </section>

        {/* Historial de pedidos */}
        <section
          className="perfil-tarjeta"
          aria-labelledby="perfil-pedidos-titulo"
        >
          <div className="perfil-tarjeta-encabezado">
            <h2 id="perfil-pedidos-titulo">
              Mis pedidos
            </h2>

            {!cargandoPedidos && !errorPedidos && (
              <span className="perfil-pedidos-contador">
                {pedidos.length}
              </span>
            )}
          </div>

          {cargandoPedidos && (
            <p role="status" className="perfil-mensaje">
              Cargando tus pedidos...
            </p>
          )}

          {errorPedidos && (
            <p role="alert" className="perfil-error">
              {errorPedidos}
            </p>
          )}

          {!cargandoPedidos &&
            !errorPedidos &&
            pedidos.length === 0 && (
              <div className="perfil-sin-pedidos">
                <h3>Todavía no realizaste pedidos</h3>

                <p>
                  Cuando realices tu primera compra,
                  vas a poder consultarla desde acá.
                </p>

                <Link
                  to="/productos"
                  className="btn btn-primario"
                >
                  Explorar productos
                </Link>
              </div>
            )}

          {!cargandoPedidos &&
            !errorPedidos &&
            pedidos.length > 0 && (
              <div className="perfil-pedidos-lista">
                {pedidos.map((pedido) => (
                  <article
                    className="perfil-pedido"
                    key={pedido._id}
                  >
                    <div className="perfil-pedido-encabezado">
                      <div>
                        <span className="perfil-pedido-etiqueta">
                          PEDIDO
                        </span>

                        <p className="perfil-pedido-id">
                          {pedido._id}
                        </p>

                        <p className="perfil-pedido-fecha">
                          {formatearFecha(pedido.createdAt)}
                        </p>
                      </div>

                      <span className="perfil-pedido-estado">
                        {pedido.estado}
                      </span>
                    </div>

                    <ul className="perfil-pedido-productos">
                      {pedido.productos.map((item, indice) => (
                        <li
                          key={`${item.producto}-${indice}`}
                        >
                          <span>
                            {item.nombre} × {item.cantidad}
                          </span>

                          <span>
                            {formatearPrecio(item.subtotal)}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <div className="perfil-pedido-total">
                      <strong>Total del pedido</strong>

                      <strong>
                        {formatearPrecio(pedido.total)}
                      </strong>
                    </div>
                  </article>
                ))}
              </div>
            )}
        </section>
      </div>
    </section>
  );
}

export default ProfilePage;
