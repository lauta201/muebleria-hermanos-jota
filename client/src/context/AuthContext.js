
import {
    createContext,
    useContext,
    useEffect,
    useState,
  } from "react";
  
  const AuthContext = createContext(null);
  
  const API_URL =
    process.env.REACT_APP_API_URL?.replace(/\/api\/productos\/?$/, "") ||
    "http://localhost:3000";
  
  export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [cargandoSesion, setCargandoSesion] = useState(true);
  
    // Recuperar y verificar la sesión al cargar la aplicación.
    useEffect(() => {
      const controller = new AbortController();
  
      async function recuperarSesion() {
        const token = localStorage.getItem("authToken");
  
        if (!token) {
          setCargandoSesion(false);
          return;
        }
  
        try {
          const respuesta = await fetch(
            `${API_URL}/api/usuarios/perfil`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
              signal: controller.signal,
            }
          );
  
          if (!respuesta.ok) {
            throw new Error("Sesión inválida");
          }
  
          const datos = await respuesta.json();
          setCurrentUser(datos.usuario);
        } catch (error) {
          if (error.name !== "AbortError") {
            localStorage.removeItem("authToken");
            setCurrentUser(null);
          }
        } finally {
          if (!controller.signal.aborted) {
            setCargandoSesion(false);
          }
        }
      }
  
      recuperarSesion();
  
      return () => controller.abort();
    }, []);
  
    // Guardar el token y actualizar el usuario autenticado.
    function login(token, usuario) {
      localStorage.setItem("authToken", token);
      setCurrentUser(usuario);
    }
  
    // Eliminar la sesión actual.
    function logout() {
      localStorage.removeItem("authToken");
      setCurrentUser(null);
    }
  
    return (
      <AuthContext.Provider
        value={{
          currentUser,
          cargandoSesion,
          login,
          logout,
        }}
      >
        {children}
      </AuthContext.Provider>
    );
  }
  
  // Hook para acceder al contexto desde otros componentes.
  export function useAuth() {
    const contexto = useContext(AuthContext);
  
    if (!contexto) {
      throw new Error(
        "useAuth debe utilizarse dentro de AuthProvider"
      );
    }
  
    return contexto;
  }
  