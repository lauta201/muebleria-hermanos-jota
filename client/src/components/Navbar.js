import { useState } from "react";

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
      <a
        href="#inicio"
        className="logo"
        aria-label="Inicio — Mueblería Hermanos Jota"
        onClick={cerrarMenu}
      >
        <img src="/logo.svg" alt="Logo Hermanos Jota" />
      </a>

      <nav
        id="navPrincipal"
        className={menuAbierto ? "nav-principal abierto" : "nav-principal"}
        aria-label="Navegación principal"
      >
        <ul>
          <li>
            <a href="#inicio" onClick={cerrarMenu} aria-current="page">
              Inicio
            </a>
          </li>
          <li>
            <a href="#productos" onClick={cerrarMenu}>
              Productos
            </a>
          </li>
          <li>
            <a href="#contacto" onClick={cerrarMenu}>
              Contacto
            </a>
          </li>
        </ul>
      </nav>

      <button className="carrito-btn" type="button" aria-label="Ver carrito">
        🛒 <span className="carrito-contador">{cantidadCarrito}</span>
      </button>

      <button
        className="nav-toggle"
        type="button"
        aria-controls="navPrincipal"
        aria-expanded={menuAbierto}
        aria-label={
          menuAbierto ? "Cerrar menú de navegación" : "Abrir menú de navegación"
        }
        onClick={toggleMenu}
      >
        {menuAbierto ? "✕" : "☰"}
      </button>
    </header>
  );
}

export default Navbar;
