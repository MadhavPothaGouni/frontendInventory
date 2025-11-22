import React from "react";
import ProductRow from "./ProductRow";

function ProductTable({ products, onSelect, refresh, sortField, sortOrder, onSort }) {
  const renderSortIcon = (field) => {
    if (!onSort) return null;

    if (sortField !== field) {
      return <span className="ms-1 text-muted">↕</span>;
    }
    return <span className="ms-1">{sortOrder === "asc" ? "▲" : "▼"}</span>;
  };

  return (
    <div className="table-responsive">
      <table className="table align-middle">
        <thead className="table-light">
          <tr>
            <th>Image</th>
            <th
              role="button"
              onClick={() => onSort && onSort("name")}
            >
              Name {renderSortIcon("name")}
            </th>
            <th>Unit</th>
            <th
              role="button"
              onClick={() => onSort && onSort("category")}
            >
              Category {renderSortIcon("category")}
            </th>
            <th
              role="button"
              onClick={() => onSort && onSort("brand")}
            >
              Brand {renderSortIcon("brand")}
            </th>
            <th
              role="button"
              onClick={() => onSort && onSort("stock")}
            >
              Stock {renderSortIcon("stock")}
            </th>
            <th>Status</th>
            <th style={{ width: "150px" }}>Actions</th>
          </tr>
        </thead>

        <tbody>
          {products.map((product) => (
            <ProductRow
              key={product.id}
              product={product}
              onSelect={onSelect}
              refresh={refresh}
            />
          ))}

          {products.length === 0 && (
            <tr>
              <td colSpan="8" className="text-center py-4">
                No products to show.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ProductTable;
