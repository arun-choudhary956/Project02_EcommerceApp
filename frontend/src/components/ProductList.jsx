import React, { useEffect, useState } from 'react';
import { getProducts, getCategories } from '../api/api';
import ProductCard from './ProductCard';
import FilterBar from './FilterBar';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    search: '',
    category: 'All',
    minPrice: '',
    maxPrice: '',
  });

  // Load category list once
  useEffect(() => {
    getCategories()
      .then((res) => setCategories(res.data))
      .catch(() => setCategories([]));
  }, []);

  // Re-fetch products whenever filters change, debounced so typing doesn't
  // fire a request per keystroke.
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      const params = {};
      if (filters.search) params.search = filters.search;
      if (filters.category !== 'All') params.category = filters.category;
      if (filters.minPrice) params.minPrice = filters.minPrice;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;

      getProducts(params)
        .then((res) => {
          setProducts(res.data);
          setError('');
        })
        .catch(() => setError('Could not load products. Is the backend running?'))
        .finally(() => setLoading(false));
    }, 300);

    return () => clearTimeout(timer);
  }, [filters]);

  return (
    <div>
      <div className="page-header">
        <span className="page-header__eyebrow">Project 02 · Product Catalog</span>
        <h1>Fresh picks, fair prices.</h1>
        <p>Browse the full catalog, search by name, and filter by category or budget.</p>
      </div>

      <FilterBar filters={filters} onChange={setFilters} categories={categories} />

      {error && <div className="form-error">{error}</div>}

      {loading ? (
        <div className="empty-state">Loading products...</div>
      ) : products.length === 0 ? (
        <div className="empty-state">
          <h3>No products match your search</h3>
          <p>Try a different keyword, category, or price range.</p>
        </div>
      ) : (
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductList;
