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

  if (
    imagen.startsWith("http://") ||
    imagen.startsWith("https://")
  ) {
    return imagen;
  }

  const rutaRelativa = imagen.replace(/^\/+/, "");

  return `/${rutaRelativa
    .split("/")
    .map((segmento) => encodeURIComponent(segmento))
    .join("/")}`;
}

function ProductCard({
  producto,
  onVerDetalle,
  onEditar,
  onEliminar,
}) {
  const rutaImagen = obtenerRutaImagen(
    producto.imagenUrl || producto.imagen
  );

  return (
    <article className="tarjeta-mueble">
      <figure>
        <img
          src={rutaImagen}
          alt={producto.nombre}
          loading="lazy"
        />
      </figure>

      <div className="tarjeta-mueble-cuerpo">
        {producto.categoria ? (
          <span className="tarjeta-etiqueta">
            {producto.categoria}
          </span>
        ) : null}

        <h3>{producto.nombre}</h3>

        <p>{producto.descripcion}</p>

        <div className="tarjeta-pie">
          <span className="tarjeta-precio">
            {formatearPrecio(producto.precio)}
          </span>

          <button
            type="button"
            className="tarjeta-ver-detalle"
            onClick={() => onVerDetalle(producto)}
          >
            Ver detalle
          </button>
        </div>

        {(onEditar || onEliminar) && (
          <div className="tarjeta-acciones-admin">
            {onEditar && (
              <button
                type="button"
                className="btn-admin-editar"
                onClick={() => onEditar(producto)}
              >
                Editar
              </button>
            )}

            {onEliminar && (
              <button
                type="button"
                className="btn-admin-eliminar"
                onClick={() => onEliminar(producto)}
              >
                Eliminar
              </button>
            )}
          </div>
        )}
      </div>
    </article>
  );
}

export default ProductCard;
