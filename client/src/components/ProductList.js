import ProductCard from "./ProductCard";

function ProductList({
  productos,
  onVerDetalle,
  onEditar,
  onEliminar,
}) {
  return (
    <div className="grilla-productos" aria-live="polite">
      {productos.map((producto) => (
        <ProductCard
          key={producto._id || producto.id}
          producto={producto}
          onVerDetalle={onVerDetalle}
          onEditar={onEditar}
          onEliminar={onEliminar}
        />
      ))}
    </div>
  );
}

export default ProductList;
