function formatearPrecio(precio) {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
    }).format(precio);
  }
  
  function obtenerRutaImagen(imagen) {
    if (!imagen) {
      return "";
    }
  
    if (imagen.startsWith("http://") || imagen.startsWith("https://")) {
      return imagen;
    }
  
    const rutaRelativa = imagen.replace(/^\/+/, "");
  
    return `/${rutaRelativa
      .split("/")
      .map((segmento) => encodeURIComponent(segmento))
      .join("/")}`;
  }
  
  function ProductDetail({ producto, onVolver, onAgregarAlCarrito }) {
    return (
      <section className="detalle-contenedor">
        <div className="detalle-imagen-contenedor">
          <img
            className="detalle-imagen"
            src={obtenerRutaImagen(producto.imagen)}
            alt={producto.nombre}
          />
        </div>
  
        <div className="detalle-info">
          <button
            type="button"
            className="detalle-volver"
            onClick={onVolver}
          >
            ← Volver al catálogo
          </button>
  
          <span className="detalle-categoria">{producto.categoria}</span>
  
          <h2 className="detalle-nombre">{producto.nombre}</h2>
  
          <p className="detalle-descripcion">
            {producto.descripcionCompleta || producto.descripcion}
          </p>
  
          <div className="detalle-especificaciones">
            <h3>Especificaciones</h3>
  
            <dl className="especificaciones-lista">
              <div className="especificacion-item">
                <dt>Material:</dt>
                <dd>{producto.material}</dd>
              </div>
  
              <div className="especificacion-item">
                <dt>Dimensiones:</dt>
                <dd>{producto.dimensiones}</dd>
              </div>
            </dl>
          </div>
  
          <div className="detalle-precio-accion">
  <p className="detalle-precio">
    {formatearPrecio(producto.precio)}
  </p>

  <button
    type="button"
    className="btn btn-primario btn-agregar-carrito"
    onClick={() => onAgregarAlCarrito(producto)}
  >
    Agregar al carrito
  </button>
</div>
        </div>
      </section>
    );
  }
  
  export default ProductDetail;