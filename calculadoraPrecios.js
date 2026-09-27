const IVA = 0.21;

function sumarIva(precioBase) {
  return precioBase * (1 + IVA);
}

function calcularDescuento(precio, porcentaje) {
  const montoDescuento = (precio * porcentaje) / 100;
  return precio - montoDescuento;
}
module.exports = {
  sumarIva,
  calcularDescuento,
};
