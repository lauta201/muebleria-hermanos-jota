
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";

function Navbar({ cantidadCarrito }) {
  const [menuAbierto, setMenuAbierto] = useState(false);

  const toggleMenu = () => {
    setMenuAbierto((abierto) => !abierto);
  };

  const cerrarMenu = () => {
    setMenuAbierto(false);
  };

  return (
    <header>
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

          <li>
            <NavLink
              to="/admin/crear-producto"
              onClick={cerrarMenu}
            >
              Administración
            </NavLink>
          </li>
        </ul>
      </nav>

      <button
        className="carrito-btn"
        type="button"
        aria-label="Ver carrito"
      >
        🛒
        <span className="carrito-contador">
          {cantidadCarrito}
        </span>
      </button>

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
        onClick={toggleMenu}
      >
        {menuAbierto ? "✕" : "☰"}
      </button>
    </header>
  );
}

export default Navbar;

