// frontend/src/components/CategoryFilter.js
import React from "react";

function CategoryFilter({ allProducts, selectedCategory, onCategoryChange }) {
  const categories = React.useMemo(() => {
    const set = new Set();
    allProducts.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return ["All Categories", ...Array.from(set)];
  }, [allProducts]);

  return (
    <select
      className="form-select"
      style={{ maxWidth: 220 }}
      value={selectedCategory}
      onChange={(e) => onCategoryChange(e.target.value)}
    >
      {categories.map((cat) => (
        <option key={cat} value={cat}>
          {cat}
        </option>
      ))}
    </select>
  );
}

export default CategoryFilter;
