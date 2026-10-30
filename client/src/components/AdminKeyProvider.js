import {
  createContext,
  useContext,
  useRef,
  useState,
} from "react";

const AdminKeyContext = createContext(null);

const API_URL =
  process.env.REACT_APP_API_URL ||
  "http://localhost:3000/api/productos";

const URL_VERIFICACION = API_URL.replace(
  /\/api\/productos\/?$/,
  "/api/admin/verificar-acceso"
);

export function AdminKeyProvider({ children }) {
  const [abierto, setAbierto] = useState(false);
  const [clave, setClave] = useState("");
  const [error, setError] = useState("");
  const [verificando, setVerificando] = useState(false);

  const resolverPendiente = useRef(null);

  function solicitarClave() {
    return new Promise((resolve) => {
      resolverPendiente.current = resolve;
      setClave("");
      setError("");
      setAbierto(true);
    });
  }

  function finalizar(valor) {
    setAbierto(false);
    setClave("");
    setError("");
    setVerificando(false);

    if (resolverPendiente.current) {
      resolverPendiente.current(valor);
      resolverPendiente.current = null;
    }
  }

  async function confirmar(evento) {
    evento.preventDefault();

    if (!clave.trim() || verificando) {
      return;
    }

    setError("");
    setVerificando(true);

    try {
      const respuesta = await fetch(URL_VERIFICACION, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contrasena: clave,
        }),
      });

      if (!respuesta.ok) {
        if (respuesta.status === 401) {
          throw new Error(
            "La contraseña de Administración es incorrecta."
          );
        }

        throw new Error(
          "No se pudo verificar la contraseña. Intentá nuevamente."
        );
      }

      const datos = await respuesta.json();

      if (
        !datos.autorizado ||
        typeof datos.token !== "string" ||
        !datos.token
      ) {
        throw new Error(
          "El servidor no devolvió una autorización válida."
        );
      }

      // Devolver el token, no la contraseña.
      finalizar(datos.token);
    } catch (error) {
      setError(
        error.message ||
          "No se pudo verificar la contraseña."
      );
    } finally {
      setVerificando(false);
    }
  }

  function cancelar() {
    if (!verificando) {
      finalizar(null);
    }
  }

  return (
    <AdminKeyContext.Provider value={solicitarClave}>
      {children}

      {abierto && (
        <div
          role="presentation"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            backgroundColor: "rgba(0, 0, 0, 0.65)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "20px",
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="titulo-clave-admin"
            style={{
              backgroundColor: "#fff",
              color: "#333",
              padding: "28px",
              borderRadius: "12px",
              width: "100%",
              maxWidth: "400px",
            }}
          >
            <h2 id="titulo-clave-admin">
              Autorización de administrador
            </h2>

            <p>
              Ingresá tu contraseña de Administración
              para realizar esta operación.
            </p>

            <form onSubmit={confirmar}>
              <label htmlFor="clave-administrador">
                Contraseña de Administración
              </label>

              <input
                id="clave-administrador"
                type="password"
                value={clave}
                onChange={(evento) =>
                  setClave(evento.target.value)
                }
                autoComplete="current-password"
                autoFocus
                required
                disabled={verificando}
                style={{
                  display: "block",
                  width: "100%",
                  boxSizing: "border-box",
                  margin: "10px 0 20px",
                  padding: "12px",
                  border: "1px solid #aaa",
                  borderRadius: "6px",
                }}
              />

              {error && (
                <p
                  role="alert"
                  style={{
                    color: "#b91c1c",
                    marginBottom: "16px",
                  }}
                >
                  {error}
                </p>
              )}

              <div
                style={{
                  display: "flex",
                  gap: "12px",
                }}
              >
                <button
                  type="button"
                  onClick={cancelar}
                  disabled={verificando}
                  style={{
                    padding: "10px 16px",
                    cursor: "pointer",
                  }}
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={verificando}
                  style={{
                    padding: "10px 16px",
                    cursor: "pointer",
                  }}
                >
                  {verificando
                    ? "Verificando..."
                    : "Confirmar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminKeyContext.Provider>
  );
}

export function useAdminKey() {
  const solicitarClave = useContext(AdminKeyContext);

  if (!solicitarClave) {
    throw new Error(
      "useAdminKey debe utilizarse dentro de AdminKeyProvider"
    );
  }

  return solicitarClave;
}