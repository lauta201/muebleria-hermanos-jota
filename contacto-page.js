const REGLAS = {
  nombre: {
    validar: (v) => v.trim().length >= 2,
    mensaje: 'El nombre debe tener al menos 2 caracteres.',
  },
  email: {
    validar: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
    mensaje: 'Ingresá un correo electrónico válido.',
  },
  mensaje: {
    validar: (v) => v.trim().length >= 10,
    mensaje: 'El mensaje debe tener al menos 10 caracteres.',
  },
};

function validarCampo(campo) {
  const id = campo.id;
  const regla = REGLAS[id];
  const errorEl = document.getElementById(`error-${id}`);
  if (!regla) return true;
  const esValido = regla.validar(campo.value);
  campo.classList.toggle('invalido', !esValido);
  campo.classList.toggle('valido', esValido);
  if (errorEl) {
    errorEl.textContent = esValido ? '' : regla.mensaje;
    errorEl.classList.toggle('visible', !esValido);
  }
  return esValido;
}

function validarFormulario() {
  const campos = ['nombre', 'email', 'mensaje'];
  return campos
    .map((id) => {
      const campo = document.getElementById(id);
      return campo ? validarCampo(campo) : true;
    })
    .every(Boolean);
}

function mostrarExito() {
  const formulario = document.getElementById('formularioContacto');
  const mensajeExito = document.getElementById('mensajeExito');
  if (formulario) formulario.style.display = 'none';
  if (mensajeExito) {
    mensajeExito.classList.add('visible');
    mensajeExito.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

async function simularEnvio(btnEnviar) {
  btnEnviar.disabled = true;
  btnEnviar.textContent = 'Enviando…';
  await new Promise((resolve) => setTimeout(resolve, 1200));
  mostrarExito();
}

function iniciarFormulario() {
  const formulario = document.getElementById('formularioContacto');
  if (!formulario) return;
  ['nombre', 'email', 'mensaje'].forEach((id) => {
    const campo = document.getElementById(id);
    if (!campo) return;
    campo.addEventListener('blur', () => validarCampo(campo));
    campo.addEventListener('input', () => {
      if (campo.classList.contains('invalido') || campo.classList.contains('valido')) {
        validarCampo(campo);
      }
    });
  });
  formulario.addEventListener('submit', async (evento) => {
    evento.preventDefault();
    const esValido = validarFormulario();
    if (!esValido) {
      const primerInvalido = formulario.querySelector('.invalido');
      if (primerInvalido) primerInvalido.focus();
      return;
    }
    const btnEnviar = document.getElementById('btnEnviar');
    await simularEnvio(btnEnviar);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  iniciarFormulario();
});
