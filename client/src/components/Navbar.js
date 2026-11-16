
import { useEffect, useRef, useState } from "react";
import {
  Link,
  NavLink,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

function Navbar({ cantidadCarrito }) {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [menuCuentaAbierto, setMenuCuentaAbierto] = useState(false);

  const cuentaRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const { currentUser, logout, cargandoSesion } = useAuth();

  const esAdministrador =
    currentUser?.roles?.includes("admin") ?? false;

  // Cerrar el menú principal.
  function cerrarMenu() {
    setMenuAbierto(false);
  }

  // Cerrar ambos menús al navegar.
  useEffect(() => {
    setMenuAbierto(false);
    setMenuCuentaAbierto(false);
  }, [location.pathname]);

  // Cerrar el menú de cuenta al hacer clic afuera o presionar Escape.
  useEffect(() => {
    if (!menuCuentaAbierto) return;

    function manejarClickExterior(evento) {
      if (
        cuentaRef.current &&
        !cuentaRef.current.contains(evento.target)
      ) {
        setMenuCuentaAbierto(false);
      }
    }

    function manejarTeclado(evento) {
      if (evento.key === "Escape") {
        setMenuCuentaAbierto(false);
      }
    }

    document.addEventListener(
      "pointerdown",
      manejarClickExterior
    );
    document.addEventListener("keydown", manejarTeclado);

    return () => {
      document.removeEventListener(
        "pointerdown",
        manejarClickExterior
      );
      document.removeEventListener(
        "keydown",
        manejarTeclado
      );
    };
  }, [menuCuentaAbierto]);

  // Cerrar la sesión y regresar al inicio.
  function cerrarSesion() {
    logout();
    setMenuCuentaAbierto(false);
    cerrarMenu();
    navigate("/");
  }

  return (
    <header>
      {/* Identidad de marca */}
      <Link
        to="/"
        className="logo"
        aria-label="Inicio — Mueblería Hermanos Jota"
        onClick={cerrarMenu}
      >
        <img
          src="/logo.svg"
          alt="Logo Hermanos Jota"
        />
      </Link>

      {/* Navegación principal */}
      <nav
        id="navPrincipal"
        className={
          menuAbierto
            ? "nav-principal abierto"
            : "nav-principal"
        }
        aria-label="Navegación principal"
      >
        <ul>
          <li>
            <NavLink
              to="/"
              end
              onClick={cerrarMenu}
            >
              Inicio
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/productos"
              onClick={cerrarMenu}
            >
              Productos
            </NavLink>
          </li>

          <li>
            <NavLink
              to="/contacto"
              onClick={cerrarMenu}
            >
              Contacto
            </NavLink>
          </li>
        </ul>
      </nav>

      {/* Acceso a la cuenta */}
      <div className="cuenta-contenedor" ref={cuentaRef}>
        <button
          type="button"
          className="cuenta-boton"
          aria-label="Menú de usuario"
          aria-haspopup="true"
          aria-expanded={menuCuentaAbierto}
          aria-controls="menuCuenta"
          onClick={() => {
            setMenuCuentaAbierto(
              (abierto) => !abierto
            );
            cerrarMenu();
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="23"
            height="23"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="8" r="4" />
            <path d="M4.5 21a7.5 7.5 0 0 1 15 0" />
          </svg>
        </button>

        {menuCuentaAbierto && (
          <div
            id="menuCuenta"
            className="cuenta-desplegable"
          >
            <div className="cuenta-encabezado">
              <span className="cuenta-etiqueta">
                HERMANOS JOTA
              </span>

              <strong>
                {cargandoSesion
                  ? "Verificando sesión..."
                  : currentUser
                    ? `Hola, ${currentUser.username}`
                    : "Mi cuenta"}
              </strong>

              <p>
                {currentUser
                  ? "Gestioná tu cuenta"
                  : "Accedé a tu cuenta o registrate"}
              </p>
            </div>

            {!cargandoSesion && (
              <div className="cuenta-opciones">
                {currentUser ? (
                  <>
                    {/* Perfil del usuario autenticado */}
                    <Link
                      to="/perfil"
                      className="cuenta-enlace"
                      onClick={() =>
                        setMenuCuentaAbierto(false)
                      }
                    >
                      Mi perfil
                    </Link>

                    {/* Acceso exclusivo de administradores */}
                    {esAdministrador && (
                      <Link
                        to="/admin/crear-producto"
                        className="cuenta-enlace"
                        onClick={() =>
                          setMenuCuentaAbierto(false)
                        }
                      >
                        Panel de administración
                      </Link>
                    )}

                    {/* Cerrar sesión */}
                    <button
                      type="button"
                      className="cuenta-enlace cuenta-salir"
                      onClick={cerrarSesion}
                    >
                      Cerrar sesión
                    </button>
                  </>
                ) : (
                  <>
                    {/* Iniciar sesión */}
                    <Link
                      to="/login"
                      className="cuenta-enlace cuenta-enlace-principal"
                      onClick={() =>
                        setMenuCuentaAbierto(false)
                      }
                    >
                      Iniciar sesión
                    </Link>

                    {/* Crear cuenta */}
                    <Link
                      to="/registro"
                      className="cuenta-enlace"
                      onClick={() =>
                        setMenuCuentaAbierto(false)
                      }
                    >
                      Crear cuenta
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Acceso al carrito de compras */}
      <Link
        to="/carrito"
        className="carrito-btn"
        aria-label={`Ver carrito, ${cantidadCarrito} productos`}
        onClick={() => {
          cerrarMenu();
          setMenuCuentaAbierto(false);
        }}
      >
        🛒
        <span className="carrito-contador">
          {cantidadCarrito}
        </span>
      </Link>

      {/* Menú móvil */}
      <button
        className="nav-toggle"
        type="button"
        aria-controls="navPrincipal"
        aria-expanded={menuAbierto}
        aria-label={
          menuAbierto
            ? "Cerrar menú de navegación"
            : "Abrir menú de navegación"
        }
        onClick={() => {
          setMenuAbierto(
            (abierto) => !abierto
          );
          setMenuCuentaAbierto(false);
        }}
      >
        {menuAbierto ? "✕" : "☰"}
      </button>
    </header>
  );
}

export default Navbar;
