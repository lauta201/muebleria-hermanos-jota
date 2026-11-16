
import { Link, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function AdminAccessGuard({ children }) {
  const { currentUser, cargandoSesion } = useAuth();
  const location = useLocation();

  // Esperar a que React compruebe si existe una sesión válida.
  if (cargandoSesion) {
    return (
      <section className="seccion">
        <div className="cargando" role="status">
          <div className="spinner" aria-hidden="true" />
          <p>Verificando permisos de acceso...</p>
        </div>
      </section>
    );
  }

  // Si no hay una sesión iniciada, redirigir al login.
  if (!currentUser) {
    return (
      <Navigate
        to="/login"
        state={{ from: location.pathname }}
        replace
      />
    );
  }

  // Si el usuario está autenticado pero no es administrador.
  if (!currentUser.roles?.includes("admin")) {
    return (
      <section className="seccion">
        <div className="formulario-producto">
          <h1>Acceso restringido</h1>

          <p>
            Tu cuenta no tiene permisos para acceder
            al panel de administración.
          </p>

          <Link to="/" className="btn btn-primario">
            Volver al inicio
          </Link>
        </div>
      </section>
    );
  }

  // Únicamente el administrador puede ver el contenido.
  return children;
}

export default AdminAccessGuard;
