function crearTarjeta(producto) {
  const articulo = document.createElement('article');
  articulo.className = 'tarjeta-mueble fade-in';
  articulo.innerHTML = `
    <figure>
      <img src="${producto.imagen}" alt="${producto.nombre}" loading="lazy">
    </figure>
    <div class="tarjeta-mueble-cuerpo">
      <span class="tarjeta-etiqueta">${producto.categoria}</span>
      <h3>${producto.nombre}</h3>
      <p>${producto.descripcion}</p>
      <div class="tarjeta-pie">
        <span class="tarjeta-precio">${formatearPrecio(producto.precio)}</span>
        <a href="producto.html?id=${producto.id}" class="tarjeta-enlace">Ver detalle →</a>
      </div>
    </div>
  `;
  return articulo;
}

function renderizarProductos(lista) {
  const grilla = document.getElementById('grillaProductos');
  const sinResultados = document.getElementById('sinResultados');
  if (!grilla) return;
  grilla.innerHTML = '';
  if (lista.length === 0) {
    if (sinResultados) sinResultados.classList.remove('oculto');
    return;
  }
  if (sinResultados) sinResultados.classList.add('oculto');
  lista.forEach((producto) => grilla.appendChild(crearTarjeta(producto)));
}

function filtrarProductos(texto, categoria) {
  const termino = texto.toLowerCase().trim();
  return productos.filter((p) => {
    const coincideTexto =
      !termino ||
      p.nombre.toLowerCase().includes(termino) ||
      p.descripcion.toLowerCase().includes(termino) ||
      p.categoria.toLowerCase().includes(termino);
    const coincideCategoria = !categoria || p.categoria === categoria;
    return coincideTexto && coincideCategoria;
  });
}

async function cargarCatalogo() {
  const grilla = document.getElementById('grillaProductos');
  const contador = document.getElementById('totalProductos');
  if (!grilla) return;
  grilla.innerHTML = `
    <div class="cargando" style="grid-column: 1 / -1;">
      <div class="spinner"></div>
      <p>Cargando catálogo…</p>
    </div>
  `;
  await new Promise((resolve) => setTimeout(resolve, 700));
  renderizarProductos(productos);
  if (contador) contador.textContent = productos.length;
}

function iniciarEventosBuscador() {
  const inputBusqueda = document.getElementById('inputBusqueda');
  const selectCategoria = document.getElementById('selectCategoria');
  if (!inputBusqueda && !selectCategoria) return;
  function aplicarFiltros() {
    const texto = inputBusqueda ? inputBusqueda.value : '';
    const categoria = selectCategoria ? selectCategoria.value : '';
    renderizarProductos(filtrarProductos(texto, categoria));
  }
  if (inputBusqueda) inputBusqueda.addEventListener('input', aplicarFiltros);
  if (selectCategoria) selectCategoria.addEventListener('change', aplicarFiltros);
}

document.addEventListener('DOMContentLoaded', async () => {
  await cargarCatalogo();
  iniciarEventosBuscador();
});
