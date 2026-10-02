import { useState } from "react";

function ContactForm() {
  const [formulario, setFormulario] = useState({
    nombre: "",
    email: "",
    asunto: "",
    mensaje: "",
  });

  const [mensajeEnviado, setMensajeEnviado] = useState(false);

  function manejarCambio(evento) {
    const { name, value } = evento.target;

    setFormulario((formularioActual) => ({
      ...formularioActual,
      [name]: value,
    }));
  }

  function manejarEnvio(evento) {
    evento.preventDefault();

    setMensajeEnviado(true);

    setFormulario({
      nombre: "",
      email: "",
      asunto: "",
      mensaje: "",
    });
  }

  function nuevaConsulta() {
    setMensajeEnviado(false);
  }

  return (
    <section className="contacto-contenedor" id="contacto">
      <div className="contacto-info">
        <h2 className="seccion-titulo">Contactanos</h2>

        <p>
          Estamos para ayudarte. Visitanos en nuestro local, escribinos o
          llamanos. Te respondemos a la brevedad.
        </p>

        <address className="datos-contacto">
          <div className="dato-contacto">
            <span aria-hidden="true">📍</span>
            <span>
              <strong>Dirección:</strong> Av. San Martín 1240, Mendoza,
              Argentina
            </span>
          </div>

          <div className="dato-contacto">
            <span aria-hidden="true">📞</span>
            <span>
              <strong>Teléfono:</strong>{" "}
              <a href="tel:+542610000000">(261) 000-0000</a>
            </span>
          </div>

          <div className="dato-contacto">
            <span aria-hidden="true">✉️</span>
            <span>
              <strong>Email:</strong>{" "}
              <a href="mailto:info@hermanosjota.com.ar">
                info@hermanosjota.com.ar
              </a>
            </span>
          </div>

          <div className="dato-contacto">
            <span aria-hidden="true">🕐</span>
            <span>
              <strong>Horario:</strong> Lunes a Sábado, 9:00 a 18:00 hs
            </span>
          </div>
        </address>
      </div>

      <div>
        {mensajeEnviado ? (
          <div className="mensaje-exito" role="status">
            <span className="exito-icono" aria-hidden="true">
              ✅
            </span>

            <h3>¡Mensaje enviado con éxito!</h3>

            <p>
              Gracias por contactarnos. Te responderemos a la brevedad,
              generalmente dentro de las 24 horas hábiles.
            </p>

            <button
              type="button"
              className="btn btn-oscuro"
              onClick={nuevaConsulta}
            >
              Enviar otra consulta
            </button>
          </div>
        ) : (
          <form
            className="formulario-contacto"
            onSubmit={manejarEnvio}
            aria-label="Formulario de contacto"
          >
            <div className="campo-formulario">
              <label htmlFor="nombre">
                Nombre completo <span aria-hidden="true">*</span>
              </label>

              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formulario.nombre}
                onChange={manejarCambio}
                placeholder="Tu nombre y apellido"
                autoComplete="name"
                required
              />
            </div>

            <div className="campo-formulario">
              <label htmlFor="email">
                Correo electrónico <span aria-hidden="true">*</span>
              </label>

              <input
                type="email"
                id="email"
                name="email"
                value={formulario.email}
                onChange={manejarCambio}
                placeholder="tu@email.com"
                autoComplete="email"
                required
              />
            </div>

            <div className="campo-formulario">
              <label htmlFor="asunto">Asunto</label>

              <input
                type="text"
                id="asunto"
                name="asunto"
                value={formulario.asunto}
                onChange={manejarCambio}
                placeholder="¿En qué podemos ayudarte?"
              />
            </div>

            <div className="campo-formulario">
              <label htmlFor="mensaje">
                Mensaje <span aria-hidden="true">*</span>
              </label>

              <textarea
                id="mensaje"
                name="mensaje"
                rows="5"
                value={formulario.mensaje}
                onChange={manejarCambio}
                placeholder="Escribí tu consulta o comentario acá..."
                required
              />
            </div>

            <button type="submit" className="btn btn-oscuro btn-enviar">
              Enviar mensaje
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

export default ContactForm;