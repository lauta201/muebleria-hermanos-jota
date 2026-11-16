
import { useState } from "react";
import {
  Link,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

import "./CartPage.css";

const API_URL =
  process.env.REACT_APP_API_URL?.replace(/\/api\/productos\/?$/, "") ||
  "http://localhost:3000";

const CLAVE_COMPRA_PENDIENTE = "hermanosJotaCompraPendiente";

// Preparar la ruta de las imágenes.
function obtenerRutaImagen(imagen) {
  if (!imagen || typeof imagen !== "string") {
    return "";
  }

  if (
    imagen.startsWith("http://") ||
    imagen.startsWith("https://")
  ) {
    return imagen;
  }

  const rutaRelativa = imagen.replace(/^\/+/, "");

  return `/${rutaRelativa
    .split("/")
    .map((segmento) => encodeURIComponent(segmento))
    .join("/")}`;
}

// Mostrar precios en pesos argentinos.
function formatearPrecio(precio) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(precio);
}

// Recuperar una compra cuyo resultado quedó pendiente.
function recuperarCompraPendiente() {
  try {
    const guardado = localStorage.getItem(
      CLAVE_COMPRA_PENDIENTE
    );

    return guardado ? JSON.parse(guardado) : null;
  } catch {
    return null;
  }
}

function CartPage() {
  const navigate = useNavigate();

  const { currentUser, cargandoSesion } = useAuth();

  const {
    carrito,
    actualizarCantidad,
    quitarDelCarrito,
    vaciarCarrito,
    cantidadCarrito,
    totalCarrito,
  } = useCart();

  const [procesando, setProcesando] = useState(false);
  const [errorCompra, setErrorCompra] = useState("");
  const [pedidoConfirmado, setPedidoConfirmado] = useState(null);

  const [compraPendiente, setCompraPendiente] = useState(
    recuperarCompraPendiente
  );

  // Obtener los productos y cantidades que se enviarán.
  function obtenerProductosPedido() {
    return carrito
      .map((item) => ({
        producto: item.id,
        cantidad: item.cantidad,
      }))
      .sort((a, b) =>
        a.producto.localeCompare(b.producto)
      );
  }

  // Guardar temporalmente el identificador
  // para poder reutilizarlo si falla la conexión.
  function guardarCompraPendiente(compra) {
    localStorage.setItem(
      CLAVE_COMPRA_PENDIENTE,
      JSON.stringify(compra)
    );

    setCompraPendiente(compra);
  }

  function limpiarCompraPendiente() {
    localStorage.removeItem(CLAVE_COMPRA_PENDIENTE);
    setCompraPendiente(null);
  }

  // Evitar cambios en el carrito cuando no sabemos
  // si el backend llegó a registrar una compra.
  const compraSinResolver = Boolean(compraPendiente);

  async function finalizarCompra() {
    if (procesando || cargandoSesion || carrito.length === 0) {
      return;
    }

    setErrorCompra("");

    // Solicitar inicio de sesión si es necesario.
    if (!currentUser) {
      navigate("/login", {
        state: {
          from: "/carrito",
        },
      });
      return;
    }

    const productos = obtenerProductosPedido();
    const usuarioId = currentUser.id || currentUser._id;

    // Comprobar que una compra pendiente corresponda
    // al mismo usuario y al mismo carrito.
    if (compraPendiente) {
      const mismosProductos =
        JSON.stringify(compraPendiente.productos) ===
        JSON.stringify(productos);

      if (
        compraPendiente.usuarioId !== usuarioId ||
        !mismosProductos
      ) {
        setErrorCompra(
          "Hay una compra anterior pendiente de verificar. " +
          "No podemos iniciar otra hasta resolverla."
        );
        return;
      }
    }

    if (!compraPendiente) {
      const confirmado = window.confirm(
        `¿Confirmás el pedido de ${cantidadCarrito} unidades ` +
        `por un total estimado de ${formatearPrecio(totalCarrito)}?`
      );

      if (!confirmado) {
        return;
      }
    }

    const token = localStorage.getItem("authToken");

    if (!token) {
      navigate("/login", {
        state: {
          from: "/carrito",
        },
      });
      return;
    }

    // Crear una clave nueva solamente si todavía
    // no existe un intento de compra pendiente.
    const compra = compraPendiente || {
      solicitudId: crypto.randomUUID(),
      usuarioId,
      productos,
    };

    guardarCompraPendiente(compra);
    setProcesando(true);

    try {
      const respuesta = await fetch(
        `${API_URL}/api/pedidos`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "Idempotency-Key": compra.solicitudId,
          },
          body: JSON.stringify({
            productos: compra.productos,
          }),
        }
      );

      const datos = await respuesta.json().catch(() => null);

      if (respuesta.status === 401) {
        setErrorCompra(
          "Tu sesión expiró. Iniciá sesión para verificar la compra."
        );

        navigate("/login", {
          state: {
            from: "/carrito",
          },
        });
        return;
      }

      if (!respuesta.ok) {
        const mensaje =
          datos?.mensaje ||
          "No pudimos confirmar el pedido.";

        // Estos errores indican que el contenido
        // del pedido debe corregirse.
        const errorDeProductos =
          respuesta.status === 404 ||
          (respuesta.status === 409 &&
            /stock|disponible/i.test(mensaje));

        if (errorDeProductos) {
          limpiarCompraPendiente();
        }

        throw new Error(mensaje);
      }

      // Confirmar que recibimos un pedido real.
      if (!datos?.pedido?._id) {
        throw new Error(
          "No pudimos verificar la confirmación del pedido."
        );
      }

      setPedidoConfirmado(datos.pedido);
      limpiarCompraPendiente();
      vaciarCarrito();
    } catch (error) {
      setErrorCompra(
        error.message ||
        "No pudimos verificar el pedido. " +
        "Reintentá con el mismo identificador."
      );
    } finally {
      setProcesando(false);
    }
  }

  return (
    <section className="seccion carrito-pagina">
      <div className="seccion-cabecera">
        <h1 className="seccion-titulo">Mi carrito</h1>

        <p className="seccion-subtitulo">
          Revisá los productos seleccionados antes de
          finalizar tu compra.
        </p>
      </div>

      {/* Confirmación del pedido */}
      {pedidoConfirmado && (
        <div
          className="carrito-vacio"
          role="status"
        >
          <h2>¡Pedido registrado correctamente!</h2>

          <p>
            Tu pedido quedó registrado con el número:
          </p>

          <p>
            <strong>{pedidoConfirmado._id}</strong>
          </p>

          <p>
            Total confirmado:{" "}
            <strong>
              {formatearPrecio(pedidoConfirmado.total)}
            </strong>
          </p>

          <Link
            to="/productos"
            className="btn btn-primario"
          >
            Volver al catálogo
          </Link>
        </div>
      )}

      {/* Carrito vacío */}
      {!pedidoConfirmado && carrito.length === 0 && (
        <div className="carrito-vacio">
          <h2>Tu carrito está vacío</h2>

          <p>
            Explorá nuestra colección y encontrá
            los muebles ideales para tu hogar.
          </p>

          <Link
            to="/productos"
            className="btn btn-primario"
          >
            Explorar productos
          </Link>
        </div>
      )}

      {/* Productos y resumen */}
      {!pedidoConfirmado && carrito.length > 0 && (
        <div className="carrito-contenido">
          <div className="carrito-productos">
            <div className="carrito-lista-cabecera">
              <h2>
                Productos seleccionados
                <span> ({cantidadCarrito})</span>
              </h2>

              <button
                type="button"
                className="carrito-vaciar"
                disabled={procesando || compraSinResolver}
                onClick={() => {
                  if (
                    window.confirm(
                      "¿Querés quitar todos los productos del carrito?"
                    )
                  ) {
                    vaciarCarrito();
                  }
                }}
              >
                Vaciar carrito
              </button>
            </div>

            {carrito.map((item) => (
              <article
                className="carrito-item"
                key={item.id}
              >
                {/* Fotografía */}
                <Link
                  to={`/productos/${item.id}`}
                  className="carrito-item-imagen"
                  aria-label={`Ver ${item.nombre}`}
                >
                  {item.imagen ? (
                    <img
                      src={obtenerRutaImagen(item.imagen)}
                      alt={item.nombre}
                      loading="lazy"
                    />
                  ) : (
                    <span>Sin imagen</span>
                  )}
                </Link>

                {/* Información */}
                <div className="carrito-item-info">
                  <Link
                    to={`/productos/${item.id}`}
                    className="carrito-item-nombre"
                  >
                    {item.nombre}
                  </Link>

                  <p className="carrito-item-precio">
                    {formatearPrecio(item.precio)} por unidad
                  </p>

                  <button
                    type="button"
                    className="carrito-quitar"
                    disabled={procesando || compraSinResolver}
                    onClick={() =>
                      quitarDelCarrito(item.id)
                    }
                  >
                    Quitar producto
                  </button>
                </div>

                {/* Cantidad y subtotal */}
                <div className="carrito-item-acciones">
                  <div
                    className="carrito-cantidad"
                    aria-label={`Cantidad de ${item.nombre}`}
                  >
                    <button
                      type="button"
                      aria-label={`Disminuir cantidad de ${item.nombre}`}
                      disabled={
                        item.cantidad <= 1 ||
                        procesando ||
                        compraSinResolver
                      }
                      onClick={() =>
                        actualizarCantidad(
                          item.id,
                          item.cantidad - 1
                        )
                      }
                    >
                      −
                    </button>

                    <span>{item.cantidad}</span>

                    <button
                      type="button"
                      aria-label={`Aumentar cantidad de ${item.nombre}`}
                      disabled={procesando || compraSinResolver}
                      onClick={() =>
                        actualizarCantidad(
                          item.id,
                          item.cantidad + 1
                        )
                      }
                    >
                      +
                    </button>
                  </div>

                  <strong className="carrito-item-subtotal">
                    {formatearPrecio(
                      item.precio * item.cantidad
                    )}
                  </strong>
                </div>
              </article>
            ))}
          </div>

          {/* Resumen de compra */}
          <aside className="carrito-resumen">
            <h2>Resumen de compra</h2>

            <div className="carrito-resumen-fila">
              <span>Productos ({cantidadCarrito})</span>
              <span>{formatearPrecio(totalCarrito)}</span>
            </div>

            <div className="carrito-resumen-total">
              <strong>Total estimado</strong>
              <strong>{formatearPrecio(totalCarrito)}</strong>
            </div>

            <p className="carrito-resumen-nota">
              Los precios y el stock se verificarán
              en el servidor al confirmar el pedido.
            </p>

            {errorCompra && (
              <p className="registro-error" role="alert">
                {errorCompra}
              </p>
            )}

            {compraSinResolver && (
              <p className="carrito-resumen-nota" role="status">
                Hay una solicitud de compra pendiente de
                verificar. Podés reintentarla sin generar
                una compra nueva.
              </p>
            )}

            <button
              type="button"
              className="btn btn-primario carrito-finalizar"
              disabled={procesando || cargandoSesion}
              onClick={finalizarCompra}
            >
              {procesando
                ? "Verificando pedido..."
                : compraSinResolver
                  ? "Verificar pedido pendiente"
                  : "Finalizar compra"}
            </button>

            <Link
              to="/productos"
              className="carrito-seguir-comprando"
            >
              Seguir comprando
            </Link>
          </aside>
        </div>
      )}
    </section>
  );
}

export default CartPage;
