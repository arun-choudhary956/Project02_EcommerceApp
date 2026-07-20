import React from 'react';
import { useCart } from '../context/CartContext';

const Cart = ({ onClose }) => {
  const { cartItems, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();

  return (
    <div className="cart-overlay" onClick={onClose}>
      <div className="cart-panel" onClick={(e) => e.stopPropagation()}>
        <div className="cart-panel__header">
          <h2>Your Cart</h2>
          <button className="cart-panel__close" onClick={onClose} aria-label="Close cart">
            &times;
          </button>
        </div>

        {cartItems.length === 0 ? (
          <div className="empty-state">
            <h3>Your cart is empty</h3>
            <p>Add a few products to see them here.</p>
          </div>
        ) : (
          <>
            {cartItems.map((item) => (
              <div className="cart-item" key={item._id}>
                <img src={item.imageUrl} alt={item.name} />
                <div className="cart-item__info">
                  <span>{item.name}</span>
                  <span>${item.price.toFixed(2)} each</span>
                  <div className="cart-item__qty-controls">
                    <button
                      className="qty-btn"
                      onClick={() => updateQuantity(item._id, item.quantity - 1)}
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      className="qty-btn"
                      onClick={() => updateQuantity(item._id, item.quantity + 1)}
                    >
                      +
                    </button>
                    <button
                      className="btn btn--ghost"
                      style={{ marginLeft: 'auto', fontSize: '0.75rem', padding: '4px 8px' }}
                      onClick={() => removeFromCart(item._id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}

            <div className="cart-panel__total">
              <span>Total</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>

            <button
              className="btn btn--dark"
              style={{ marginTop: 20, fontFamily: 'Inter, sans-serif' }}
              onClick={clearCart}
            >
              Clear cart
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;
