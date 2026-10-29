import {
    createContext,
    useContext,
    useRef,
    useState,
  } from "react";
  
  const AdminKeyContext = createContext(null);
  
  export function AdminKeyProvider({ children }) {
    const [abierto, setAbierto] = useState(false);
    const [clave, setClave] = useState("");
    const resolverPendiente = useRef(null);
  
    function solicitarClave() {
      return new Promise((resolve) => {
        resolverPendiente.current = resolve;
        setClave("");
        setAbierto(true);
      });
    }
  
    function finalizar(valor) {
      setAbierto(false);
      setClave("");
  
      if (resolverPendiente.current) {
        resolverPendiente.current(valor);
        resolverPendiente.current = null;
      }
    }
  
    function confirmar(evento) {
      evento.preventDefault();
  
      if (!clave.trim()) {
        return;
      }
  
      finalizar(clave);
    }
  
    function cancelar() {
      finalizar(null);
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
                Ingresá tu clave para realizar esta operación.
              </p>
  
              <form onSubmit={confirmar}>
                <label htmlFor="clave-administrador">
                  Clave de administración
                </label>
  
                <input
                  id="clave-administrador"
                  type="password"
                  value={clave}
                  onChange={(evento) =>
                    setClave(evento.target.value)
                  }
                  autoComplete="off"
                  autoFocus
                  required
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
  
                <div
                  style={{
                    display: "flex",
                    gap: "12px",
                  }}
                >
                  <button
                    type="button"
                    onClick={cancelar}
                    style={{
                      padding: "10px 16px",
                      cursor: "pointer",
                    }}
                  >
                    Cancelar
                  </button>
  
                  <button
                    type="submit"
                    style={{
                      padding: "10px 16px",
                      cursor: "pointer",
                    }}
                  >
                    Confirmar
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