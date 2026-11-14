
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./RegisterPage.css";

const API_URL =
  process.env.REACT_APP_API_URL?.replace(/\/api\/productos\/?$/, "") ||
  "http://localhost:3000";

function RegisterPage() {
  const navigate = useNavigate();

  const [formulario, setFormulario] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

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
        `${API_URL}/api/usuarios/registro`,
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
          datos.mensaje || "No pudimos completar el registro."
        );
      }

      // El usuario podrá iniciar sesión con su nueva cuenta.
      navigate("/login", {
        state: {
          mensaje: "Tu cuenta fue creada correctamente. Ya podés ingresar.",
        },
      });
    } catch (errorRegistro) {
      setError(
        errorRegistro.message ||
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

          <h1>Crear una cuenta</h1>

          <p>
            Registrate para disfrutar de una experiencia
            de compra personalizada.
          </p>
        </div>

        <form
          className="registro-formulario"
          onSubmit={manejarEnvio}
        >
          <div className="registro-campo">
            <label htmlFor="username">
              Nombre de usuario
            </label>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              value={formulario.username}
              onChange={manejarCambio}
              required
              maxLength={80}
            />
          </div>

          <div className="registro-campo">
            <label htmlFor="email">
              Correo electrónico
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={formulario.email}
              onChange={manejarCambio}
              required
            />
          </div>

          <div className="registro-campo">
            <label htmlFor="password">
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              value={formulario.password}
              onChange={manejarCambio}
              minLength={8}
              required
            />

            <p className="registro-ayuda">
              Utilizá al menos 8 caracteres.
            </p>
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
            {cargando ? "Creando cuenta..." : "Crear cuenta"}
          </button>

          <p className="registro-acceso">
            ¿Ya tenés una cuenta?{" "}
            <Link to="/login">Iniciar sesión</Link>
          </p>
        </form>
      </div>
    </section>
  );
}

export default RegisterPage;
