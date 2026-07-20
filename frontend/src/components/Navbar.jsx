import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Navbar = ({ onCartClick, isAdmin, onLogout }) => {
  const { cartCount } = useCart();
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <Link to="/" className="navbar__brand">
        Shop<span>Easy</span>
      </Link>
      <div className="navbar__links">
        <Link to="/">Products</Link>
        {isAdmin ? (
          <>
            <Link to="/admin">Admin Panel</Link>
            <button
              className="btn btn--ghost"
              onClick={() => {
                onLogout();
                navigate('/');
              }}
            >
              Log out
            </button>
          </>
        ) : (
          <Link to="/login">Admin login</Link>
        )}
        <button className="navbar__cart-btn" onClick={onCartClick}>
          Cart
          {cartCount > 0 && <span className="navbar__cart-count">{cartCount}</span>}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
