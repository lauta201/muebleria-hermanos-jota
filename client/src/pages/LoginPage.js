
import { useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import "./RegisterPage.css";

const API_URL =
  process.env.REACT_APP_API_URL?.replace(/\/api\/productos\/?$/, "") ||
  "http://localhost:3000";

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [formulario, setFormulario] = useState({
    email: "",
    password: "",
  });

  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  const mensajeRegistro = location.state?.mensaje;

  function manejarCambio(evento) {
    const { name, value } = evento.target;

    setFormulario((anterior) => ({
      ...anterior,
      [name]: value,
    }));
  }

  async function manejarEnvio(evento) {
    evento.preventDefault();
    setError("");
    setCargando(true);

    try {
      const respuesta = await fetch(
        `${API_URL}/api/usuarios/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formulario),
        }
      );

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(
          datos.mensaje ||
            "No pudimos iniciar sesión."
        );
      }

      // Guardar el JWT y actualizar el estado global.
      login(datos.token, datos.usuario);

      // Regresar a la página solicitada o al inicio.
      const destino = location.state?.from;

      navigate(
        typeof destino === "string" &&
          destino.startsWith("/") &&
          !destino.startsWith("//") &&
          destino !== "/login"
          ? destino
          : "/",
        { replace: true }
      );
    } catch (errorLogin) {
      setError(
        errorLogin.message ||
          "Ocurrió un problema. Intentá nuevamente."
      );
    } finally {
      setCargando(false);
    }
  }

  return (
    <section className="registro-pagina">
      <div className="registro-contenedor">
        <div className="registro-introduccion">
          <span className="registro-etiqueta">
            HERMANOS JOTA
          </span>

          <h1>Iniciar sesión</h1>

          <p>
            Ingresá a tu cuenta para continuar
            disfrutando de nuestra colección.
          </p>
        </div>

        <form
          className="registro-formulario"
          onSubmit={manejarEnvio}
        >
          {mensajeRegistro && (
            <p role="status" className="registro-exito">
              {mensajeRegistro}
            </p>
          )}

          <div className="registro-campo">
            <label htmlFor="login-email">
              Correo electrónico
            </label>

            <input
              id="login-email"
              name="email"
              type="email"
              autoComplete="email"
              value={formulario.email}
              onChange={manejarCambio}
              required
            />
          </div>

          <div className="registro-campo">
            <label htmlFor="login-password">
              Contraseña
            </label>

            <input
              id="login-password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={formulario.password}
              onChange={manejarCambio}
              required
            />
          </div>

          {error && (
            <p className="registro-error" role="alert">
              {error}
            </p>
          )}

          <button
            className="registro-boton"
            type="submit"
            disabled={cargando}
          >
            {cargando
              ? "Ingresando..."
              : "Iniciar sesión"}
          </button>

          <p className="registro-acceso">
            ¿Todavía no tenés una cuenta?{" "}
            <Link to="/registro">
              Crear cuenta
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
}

export default LoginPage;
