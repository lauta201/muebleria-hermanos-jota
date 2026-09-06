function obtenerCarrito() {
  try {
    return JSON.parse(localStorage.getItem('carrito_hj')) || [];
  } catch {
    return [];
  }
}

function guardarCarrito(carrito) {
  localStorage.setItem('carrito_hj', JSON.stringify(carrito));
}

function agregarAlCarrito(producto) {
  const carrito = obtenerCarrito();
  const existente = carrito.find((item) => item.id === producto.id);
  if (existente) {
    existente.cantidad += 1;
  } else {
    carrito.push({ ...producto, cantidad: 1 });
  }
  guardarCarrito(carrito);
  actualizarContadorCarrito();
}

function actualizarContadorCarrito() {
  const carrito = obtenerCarrito();
  const total = carrito.reduce((acc, item) => acc + item.cantidad, 0);
  const contador = document.getElementById('carritoContador');
  if (contador) {
    contador.textContent = total;
    contador.classList.remove('actualizado');
    void contador.offsetWidth;
    contador.classList.add('actualizado');
  }
}

function iniciarNavegacion() {
  const toggle = document.getElementById('navToggle');
  const nav = document.getElementById('navPrincipal');
  if (!toggle || !nav) return;
  toggle.addEventListener('click', () => {
    const abierto = nav.classList.toggle('abierto');
    toggle.setAttribute('aria-expanded', abierto);
    toggle.textContent = abierto ? '✕' : '☰';
  });
  nav.querySelectorAll('a').forEach((enlace) => {
    enlace.addEventListener('click', () => {
      nav.classList.remove('abierto');
      toggle.textContent = '☰';
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}

function marcarEnlaceActivo() {
  const paginaActual = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-principal a').forEach((enlace) => {
    const href = enlace.getAttribute('href');
    if (href === paginaActual) {
      enlace.classList.add('activo');
      enlace.setAttribute('aria-current', 'page');
    }
  });
}

function formatearPrecio(precio) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
  }).format(precio);
}

document.addEventListener('DOMContentLoaded', () => {
  iniciarNavegacion();
  marcarEnlaceActivo();
  actualizarContadorCarrito();
});
