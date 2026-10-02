import ProductCard from "./ProductCard";

function ProductList({ productos, onVerDetalle }) {
  return (
    <div className="grilla-productos" aria-live="polite">
      {productos.map((producto) => (
        <ProductCard
          key={producto.id}
          producto={producto}
          onVerDetalle={onVerDetalle}
        />
      ))}
    </div>
  );
}

export default ProductList;
