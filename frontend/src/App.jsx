import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProductList from './components/ProductList';
import Cart from './components/Cart';
import Login from './components/Login';
import AdminPanel from './components/AdminPanel';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const [cartOpen, setCartOpen] = useState(false);
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const isAdmin = user?.role === 'admin';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <>
      <Navbar onCartClick={() => setCartOpen(true)} isAdmin={isAdmin} onLogout={handleLogout} />
      <div className="app-shell">
        <Routes>
          <Route path="/" element={<ProductList />} />
          <Route path="/login" element={<Login onLoginSuccess={setUser} />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute isAdmin={isAdmin}>
                <AdminPanel />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
      {cartOpen && <Cart onClose={() => setCartOpen(false)} />}
    </>
  );
}

export default App;
