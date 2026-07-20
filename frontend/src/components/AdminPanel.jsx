import React, { useEffect, useState } from 'react';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../api/api';

const emptyForm = {
  name: '',
  imageUrl: '',
  category: '',
  price: '',
  description: '',
  stockCount: '',
};

const AdminPanel = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const loadProducts = () => {
    setLoading(true);
    getProducts()
      .then((res) => setProducts(res.data))
      .catch(() => setError('Could not load products.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const openCreateModal = () => {
    setEditingId(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingId(product._id);
    setForm({
      name: product.name,
      imageUrl: product.imageUrl,
      category: product.category,
      price: product.price,
      description: product.description,
      stockCount: product.stockCount,
    });
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product? This cannot be undone.')) return;
    try {
      await deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete product.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    const payload = {
      ...form,
      price: parseFloat(form.price),
      stockCount: parseInt(form.stockCount, 10),
    };

    try {
      if (editingId) {
        const res = await updateProduct(editingId, payload);
        setProducts((prev) => prev.map((p) => (p._id === editingId ? res.data : p)));
      } else {
        const res = await createProduct(payload);
        setProducts((prev) => [res.data, ...prev]);
      }
      setModalOpen(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save product.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <span className="page-header__eyebrow">Admin Panel</span>
        <h1>Manage the catalog.</h1>
        <p>Add, edit, or remove products. Changes reflect on the storefront immediately.</p>
      </div>

      <div className="admin-toolbar">
        <span style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>
          {products.length} product{products.length !== 1 ? 's' : ''}
        </span>
        <button className="btn btn--primary" onClick={openCreateModal}>
          + Add product
        </button>
      </div>

      {error && !modalOpen && <div className="form-error">{error}</div>}

      {loading ? (
        <div className="empty-state">Loading products...</div>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th></th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                <td>
                  <img src={product.imageUrl} alt={product.name} />
                </td>
                <td>{product.name}</td>
                <td>{product.category}</td>
                <td>${product.price.toFixed(2)}</td>
                <td>{product.stockCount}</td>
                <td>
                  <div className="admin-table__actions">
                    <button className="btn btn--ghost" onClick={() => openEditModal(product)}>
                      Edit
                    </button>
                    <button className="btn btn--danger" onClick={() => handleDelete(product._id)}>
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h3>{editingId ? 'Edit product' : 'Add product'}</h3>

            {error && <div className="form-error">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-field span-2">
                  <label>Product name</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>
                <div className="form-field span-2">
                  <label>Image URL</label>
                  <input
                    type="text"
                    required
                    value={form.imageUrl}
                    onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                  />
                </div>
                <div className="form-field">
                  <label>Category</label>
                  <input
                    type="text"
                    required
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                  />
                </div>
                <div className="form-field">
                  <label>Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                  />
                </div>
                <div className="form-field span-2">
                  <label>Description</label>
                  <textarea
                    rows={3}
                    required
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                  />
                </div>
                <div className="form-field">
                  <label>Stock count</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={form.stockCount}
                    onChange={(e) => setForm({ ...form, stockCount: e.target.value })}
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn btn--ghost"
                  onClick={() => setModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn--primary" disabled={saving}>
                  {saving ? 'Saving...' : editingId ? 'Save changes' : 'Create product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
