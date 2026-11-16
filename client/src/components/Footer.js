
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer>
      <div className="footer-contenido">
        <div className="footer-marca">
          <h2>Mueblería Hermanos Jota</h2>
          <p>
            Más de 30 años fabricando muebles artesanales con madera
            seleccionada. Tradición, calidad y diseño para cada hogar argentino.
          </p>
        </div>

        <nav
          className="footer-links"
          aria-label="Navegación del pie de página"
        >
          <h3>Páginas</h3>

          <ul>
            <li>
              <Link to="/">Inicio</Link>
            </li>

            <li>
              <Link to="/productos">Catálogo</Link>
            </li>

            <li>
              <Link to="/contacto">Contacto</Link>
            </li>
          </ul>
        </nav>

        <address className="footer-contacto" id="contacto">
          <h3>Contacto</h3>

          <p>📍 Av. San Martín 1240, Mendoza</p>

          <p>
            📞{" "}
            <a href="tel:+542610000000">
              (261) 000-0000
            </a>
          </p>

          <p>
            ✉️{" "}
            <a href="mailto:info@hermanosjota.com.ar">
              info@hermanosjota.com.ar
            </a>
          </p>

          <p>🕐 Lun–Sáb 9:00 a 18:00</p>
        </address>
      </div>

      <div className="footer-base">
        <p>
          © 2026 Mueblería Hermanos Jota. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
