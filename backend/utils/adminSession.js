import {
    createHmac,
    randomBytes,
    timingSafeEqual,
  } from "node:crypto";

  const DURACION_SEGUNDOS = 12 * 60 * 60;

  function obtenerSecreto() {
    const clave = process.env.ADMIN_API_KEY;

    if (!clave) {
      throw new Error("Falta configurar ADMIN_API_KEY");
    }

    return clave;
  }

  function firmar(contenido) {
    return createHmac("sha256", obtenerSecreto())
      .update(`admin-session:${contenido}`)
      .digest("base64url");
  }

  export function crearSesionAdmin() {
    const ahora = Math.floor(Date.now() / 1000);

    const datos = {
      iat: ahora,
      exp: ahora + DURACION_SEGUNDOS,
      nonce: randomBytes(16).toString("hex"),
    };

    const contenido = Buffer.from(
      JSON.stringify(datos)
    ).toString("base64url");

    const firma = firmar(contenido);

    return {
      token: `${contenido}.${firma}`,
      expiraEn: datos.exp,
    };
  }

  export function verificarSesionAdmin(token) {
    if (
      typeof token !== "string" ||
      token.length > 2048
    ) {
      return false;
    }

    const partes = token.split(".");

    if (partes.length !== 2) {
      return false;
    }

    const [contenido, firmaRecibida] = partes;

    if (!contenido || !firmaRecibida) {
      return false;
    }

    try {
      const firmaEsperada = firmar(contenido);

      const recibida = Buffer.from(
        firmaRecibida,
        "utf8"
      );

      const esperada = Buffer.from(
        firmaEsperada,
        "utf8"
      );

      if (
        recibida.length !== esperada.length ||
        !timingSafeEqual(recibida, esperada)
      ) {
        return false;
      }

      const datos = JSON.parse(
        Buffer.from(contenido, "base64url").toString("utf8")
      );

      const ahora = Math.floor(Date.now() / 1000);

      return (
        Number.isInteger(datos.iat) &&
        Number.isInteger(datos.exp) &&
        typeof datos.nonce === "string" &&
        datos.iat <= ahora &&
        datos.exp > ahora &&
        datos.exp - datos.iat === DURACION_SEGUNDOS
      );
    } catch {
      return false;
    }
  }