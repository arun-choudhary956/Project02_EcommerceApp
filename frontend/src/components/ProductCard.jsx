import React from 'react';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const lowStock = product.stockCount > 0 && product.stockCount <= 5;
  const outOfStock = product.stockCount === 0;

  return (
    <div className="product-card">
      <div className="product-card__image-wrap">
        <img src={product.imageUrl} alt={product.name} loading="lazy" />
        <span className="price-tag">${product.price.toFixed(2)}</span>
      </div>
      <div className="product-card__body">
        <span className="product-card__category">{product.category}</span>
        <h3 className="product-card__name">{product.name}</h3>
        <p className="product-card__desc">{product.description}</p>
        <div className="product-card__footer">
          <span className={`product-card__stock ${lowStock ? 'product-card__stock--low' : ''}`}>
            {outOfStock ? 'Out of stock' : `${product.stockCount} in stock`}
          </span>
          <button
            className="btn btn--primary"
            disabled={outOfStock}
            onClick={() => addToCart(product)}
          >
            Add to cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
