import { useState } from "react";

const API_URL =
  process.env.REACT_APP_API_URL ||
  "http://localhost:3000/api/productos";

const URL_VERIFICACION = API_URL.replace(
  /\/api\/productos\/?$/,
  "/api/admin/verificar-acceso"
);

const CLAVE_TOKEN = "adminSessionToken";
const CLAVE_EXPIRACION = "adminSessionExpiration";

function obtenerSesion() {
  const token = sessionStorage.getItem(CLAVE_TOKEN);
  const expiracion = Number(
    sessionStorage.getItem(CLAVE_EXPIRACION)
  );

  if (
    !token ||
    !Number.isFinite(expiracion) ||
    expiracion * 1000 <= Date.now()
  ) {
    sessionStorage.removeItem(CLAVE_TOKEN);
    sessionStorage.removeItem(CLAVE_EXPIRACION);
    sessionStorage.removeItem("adminAccess");

    return false;
  }

  return true;
}

function AdminAccessGuard({ children }) {
  const [autorizado, setAutorizado] = useState(obtenerSesion);
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

      if (
        !datos.autorizado ||
        typeof datos.token !== "string" ||
        !Number.isFinite(datos.expiraEn)
      ) {
        throw new Error(
          "El servidor no devolvió una sesión válida."
        );
      }

      sessionStorage.setItem(CLAVE_TOKEN, datos.token);
      sessionStorage.setItem(
        CLAVE_EXPIRACION,
        String(datos.expiraEn)
      );

      sessionStorage.removeItem("adminAccess");

      setAutorizado(true);
      setContrasena("");
    } catch (error) {
      setError(
        error.message || "No se pudo iniciar sesión."
      );
    } finally {
      setVerificando(false);
    }
  }

  function cerrarSesion() {
    sessionStorage.removeItem(CLAVE_TOKEN);
    sessionStorage.removeItem(CLAVE_EXPIRACION);
    sessionStorage.removeItem("adminAccess");

    setAutorizado(false);
    setContrasena("");
    setError("");
  }

  if (autorizado) {
    return (
      <>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            padding: "12px 24px",
          }}
        >
          <button
            type="button"
            onClick={cerrarSesion}
            className="btn"
          >
            Cerrar sesión
          </button>
        </div>

        {children}
      </>
    );
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