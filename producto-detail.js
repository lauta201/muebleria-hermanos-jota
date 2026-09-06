function obtenerIdDesdeURL() {
  const params = new URLSearchParams(window.location.search);
  return parseInt(params.get('id'), 10);
}

function renderizarDetalle(producto) {
  const contenedor = document.getElementById('detalleContenedor');
  if (!contenedor) return;
  contenedor.innerHTML = `
    <div class="detalle-imagen-contenedor fade-in">
      <img class="detalle-imagen" src="${producto.imagen}" alt="${producto.nombre}">
    </div>
    <div class="detalle-info fade-in">
      <span class="detalle-categoria">${producto.categoria}</span>
      <h1 class="detalle-nombre">${producto.nombre}</h1>
      <p class="detalle-descripcion">${producto.descripcionCompleta}</p>
      <div class="detalle-especificaciones">
        <h3>Especificaciones</h3>
        <dl class="especificaciones-lista">
          <div class="especificacion-item">
            <dt>Material</dt>
            <dd>${producto.material}</dd>
          </div>
          <div class="especificacion-item">
            <dt>Dimensiones</dt>
            <dd>${producto.dimensiones}</dd>
          </div>
          <div class="especificacion-item">
            <dt>Categoría</dt>
            <dd>${producto.categoria}</dd>
          </div>
        </dl>
      </div>
      <div class="detalle-precio-accion">
        <p class="detalle-precio">${formatearPrecio(producto.precio)}</p>
        <button
          id="btnAgregarCarrito"
          class="btn btn-oscuro btn-agregar-carrito"
          aria-label="Añadir ${producto.nombre} al carrito"
        >
          🛒 Añadir al Carrito
        </button>
        <div id="mensajeCarrito" class="mensaje-carrito" role="status" aria-live="polite">
          ✓ ¡Producto añadido al carrito!
        </div>
      </div>
    </div>
  `;

  document.title = `${producto.nombre} — Mueblería Hermanos Jota`;
  const breadcrumbProducto = document.getElementById('breadcrumbProducto');
  if (breadcrumbProducto) breadcrumbProducto.textContent = producto.nombre;

  const btnCarrito = document.getElementById('btnAgregarCarrito');
  const mensajeCarrito = document.getElementById('mensajeCarrito');
  btnCarrito.addEventListener('click', () => {
    agregarAlCarrito(producto);
    mensajeCarrito.classList.add('visible');
    btnCarrito.disabled = true;
    btnCarrito.textContent = '✓ Añadido';
    setTimeout(() => {
      mensajeCarrito.classList.remove('visible');
      btnCarrito.disabled = false;
      btnCarrito.innerHTML = '🛒 Añadir al Carrito';
    }, 2500);
  });
}

function renderizarError() {
  const contenedor = document.getElementById('detalleContenedor');
  if (!contenedor) return;
  contenedor.innerHTML = `
    <div class="detalle-error" style="grid-column: 1 / -1; width: 100%;">
      <p style="font-size:3rem;">😕</p>
      <h2>Producto no encontrado</h2>
      <p>El producto que buscás no existe o fue removido del catálogo.</p>
      <a href="productos.html" class="btn btn-oscuro" style="margin-top:16px; display:inline-flex;">
        ← Volver al Catálogo
      </a>
    </div>
  `;
  document.title = 'Producto no encontrado — Mueblería Hermanos Jota';
}

async function cargarDetalle() {
  const contenedor = document.getElementById('detalleContenedor');
  if (!contenedor) return;
  contenedor.innerHTML = `
    <div class="cargando" style="width:100%; grid-column: 1/-1;">
      <div class="spinner"></div>
      <p>Cargando producto…</p>
    </div>
  `;
  await new Promise((resolve) => setTimeout(resolve, 600));
  const id = obtenerIdDesdeURL();
  const producto = productos.find((p) => p.id === id);
  if (producto) {
    renderizarDetalle(producto);
  } else {
    renderizarError();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  cargarDetalle();
});
