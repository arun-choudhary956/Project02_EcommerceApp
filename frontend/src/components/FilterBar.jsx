import React from 'react';

const FilterBar = ({ filters, onChange, categories }) => {
  const handleChange = (field, value) => {
    onChange({ ...filters, [field]: value });
  };

  return (
    <div className="filter-bar">
      <input
        type="text"
        placeholder="Search products by name..."
        value={filters.search}
        onChange={(e) => handleChange('search', e.target.value)}
      />
      <select value={filters.category} onChange={(e) => handleChange('category', e.target.value)}>
        <option value="All">All categories</option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
      <div className="filter-bar__price">
        <span>$</span>
        <input
          type="number"
          min="0"
          placeholder="Min"
          value={filters.minPrice}
          onChange={(e) => handleChange('minPrice', e.target.value)}
        />
        <span>–</span>
        <input
          type="number"
          min="0"
          placeholder="Max"
          value={filters.maxPrice}
          onChange={(e) => handleChange('maxPrice', e.target.value)}
        />
      </div>
    </div>
  );
};

export default FilterBar;
