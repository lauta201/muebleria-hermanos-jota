
import {
    createContext,
    useContext,
    useEffect,
    useState,
  } from "react";
  
  const CartContext = createContext(null);
  
  const CLAVE_CARRITO = "hermanosJotaCarrito";
  
  // Recuperar los productos guardados al abrir la aplicación.
  function obtenerCarritoGuardado() {
    try {
      const guardado = localStorage.getItem(CLAVE_CARRITO);
  
      if (!guardado) {
        return [];
      }
  
      const datos = JSON.parse(guardado);
  
      if (!Array.isArray(datos)) {
        return [];
      }
  
      return datos.filter(
        (item) =>
          item &&
          typeof item.id === "string" &&
          item.id.length > 0 &&
          Number.isInteger(item.cantidad) &&
          item.cantidad > 0
      );
    } catch {
      return [];
    }
  }
  
  export function CartProvider({ children }) {
    const [carrito, setCarrito] = useState(obtenerCarritoGuardado);
  
    // Guardar el carrito cuando cambia.
    useEffect(() => {
      localStorage.setItem(
        CLAVE_CARRITO,
        JSON.stringify(carrito)
      );
    }, [carrito]);
  
    // Agregar productos o aumentar la cantidad existente.
    function agregarAlCarrito(producto) {
      const idProducto = String(producto._id || producto.id || "");
  
      if (!idProducto) {
        return;
      }
  
      setCarrito((actual) => {
        const existente = actual.find(
          (item) => item.id === idProducto
        );
  
        if (existente) {
          return actual.map((item) =>
            item.id === idProducto
              ? { ...item, cantidad: item.cantidad + 1 }
              : item
          );
        }
  
        return [
          ...actual,
          {
            id: idProducto,
            nombre: producto.nombre,
            precio: Number(producto.precio),
            imagen: producto.imagenUrl || producto.imagen || "",
            cantidad: 1,
          },
        ];
      });
    }
  
    // Cambiar la cantidad de unidades de un producto.
    function actualizarCantidad(idProducto, cantidad) {
      if (!Number.isInteger(cantidad)) {
        return;
      }
  
      if (cantidad <= 0) {
        quitarDelCarrito(idProducto);
        return;
      }
  
      setCarrito((actual) =>
        actual.map((item) =>
          item.id === idProducto
            ? { ...item, cantidad }
            : item
        )
      );
    }
  
    // Quitar un producto del carrito.
    function quitarDelCarrito(idProducto) {
      setCarrito((actual) =>
        actual.filter((item) => item.id !== idProducto)
      );
    }
  
    // Vaciar el carrito completamente.
    function vaciarCarrito() {
      setCarrito([]);
    }
  
    // Calcular la cantidad total de unidades.
    const cantidadCarrito = carrito.reduce(
      (total, item) => total + item.cantidad,
      0
    );
  
    // Calcular el importe total.
    const totalCarrito = carrito.reduce(
      (total, item) => total + item.precio * item.cantidad,
      0
    );
  
    return (
      <CartContext.Provider
        value={{
          carrito,
          agregarAlCarrito,
          actualizarCantidad,
          quitarDelCarrito,
          vaciarCarrito,
          cantidadCarrito,
          totalCarrito,
        }}
      >
        {children}
      </CartContext.Provider>
    );
  }
  
  export function useCart() {
    const contexto = useContext(CartContext);
  
    if (!contexto) {
      throw new Error(
        "useCart debe utilizarse dentro de CartProvider."
      );
    }
  
    return contexto;
  }
  