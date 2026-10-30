import { useState } from "react";

const API_URL =
  process.env.REACT_APP_API_URL ||
  "http://localhost:3000/api/productos";

const URL_VERIFICACION = API_URL.replace(
  /\/api\/productos\/?$/,
  "/api/admin/verificar-acceso"
);

function AdminAccessGuard({ children }) {
  const [autorizado, setAutorizado] = useState(
    () => sessionStorage.getItem("adminAccess") === "true"
  );
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");
  const [verificando, setVerificando] = useState(false);

  async function iniciarSesion(evento) {
    evento.preventDefault();

    setError("");
    setVerificando(true);

    try {
      const respuesta = await fetch(URL_VERIFICACION, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ contrasena }),
      });

      if (!respuesta.ok) {
        if (respuesta.status === 401) {
          throw new Error("Contraseña incorrecta.");
        }

        throw new Error(
          "No se pudo verificar el acceso. Intentá nuevamente."
        );
      }

      const datos = await respuesta.json();

      if (!datos.autorizado) {
        throw new Error("Acceso denegado.");
      }

      sessionStorage.setItem("adminAccess", "true");
      setAutorizado(true);
      setContrasena("");
    } catch (error) {
      setError(error.message);
    } finally {
      setVerificando(false);
    }
  }

  if (autorizado) {
    return children;
  }

  return (
    <section className="seccion">
      <div className="formulario-producto">
        <h1>Acceso a Administración</h1>

        <p>
          Ingresá tu contraseña para acceder al panel.
        </p>

        <form onSubmit={iniciarSesion}>
          <div>
            <label htmlFor="contrasena-acceso">
              Contraseña de administración
            </label>

            <input
              id="contrasena-acceso"
              type="password"
              value={contrasena}
              onChange={(evento) =>
                setContrasena(evento.target.value)
              }
              autoComplete="current-password"
              required
            />
          </div>

          {error && (
            <p role="alert" style={{ color: "#b91c1c" }}>
              {error}
            </p>
          )}

          <button
            className="btn btn-primario"
            type="submit"
            disabled={verificando}
          >
            {verificando ? "Verificando..." : "Ingresar"}
          </button>
        </form>
      </div>
    </section>
  );
}

export default AdminAccessGuard;