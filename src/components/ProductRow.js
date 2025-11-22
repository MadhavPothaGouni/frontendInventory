// src/components/ProductRow.js
import React, { useState } from "react";
import { updateProduct, deleteProduct } from "../services/api";
import { toast } from "react-toastify";

function ProductRow({ product, onSelect, refresh }) {
  const [isEditing, setEditing] = useState(false);
  const [form, setForm] = useState(product);

  const handleSave = async (e) => {
    e.stopPropagation();
    try {
      await updateProduct(product.id, form);
      toast.success("Product updated!");
      setEditing(false);
      refresh();
    } catch {
      toast.error("Update failed.");
    }
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (!window.confirm("Delete this product?")) return;

    try {
      await deleteProduct(product.id);
      toast.success("Product deleted");
      refresh();
    } catch {
      toast.error("Delete failed.");
    }
  };

  const handleRowClick = () => {
    if (!isEditing) {
      onSelect(product);
    }
  };

  return (
    <tr onClick={handleRowClick} style={{ cursor: "pointer" }}>
      <td className="text-center">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="img-thumbnail"
            style={{ width: "50px", height: "50px", objectFit: "cover" }}
          />
        ) : (
          <span className="text-muted small">No Image</span>
        )}
      </td>

      <td>
        {isEditing ? (
          <input
            className="form-control form-control-sm"
            value={form.name}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        ) : (
          <strong>{product.name}</strong>
        )}
      </td>

      <td>
        {isEditing ? (
          <input
            className="form-control form-control-sm"
            value={form.unit}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => setForm({ ...form, unit: e.target.value })}
          />
        ) : (
          product.unit
        )}
      </td>

      <td>{product.category}</td>
      <td>{product.brand}</td>

      <td>
        {isEditing ? (
          <input
            type="number"
            className="form-control form-control-sm"
            value={form.stock}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) =>
              setForm({ ...form, stock: Number(e.target.value) })
            }
          />
        ) : (
          product.stock
        )}
      </td>

      <td>
        <span
          className={`badge ${
            product.stock === 0 ? "bg-danger" : "bg-success"
          }`}
        >
          {product.stock === 0 ? "Out of Stock" : "In Stock"}
        </span>
      </td>

      <td>
        {isEditing ? (
          <div className="btn-group btn-group-sm">
            <button className="btn btn-success" onClick={handleSave}>
              Save
            </button>
            <button
              className="btn btn-outline-secondary"
              onClick={(e) => {
                e.stopPropagation();
                setForm(product);
                setEditing(false);
              }}
            >
              Cancel
            </button>
          </div>
        ) : (
          <div className="btn-group btn-group-sm">
            <button
              className="btn btn-outline-primary"
              onClick={(e) => {
                e.stopPropagation();
                setEditing(true);
              }}
            >
              Edit
            </button>
            <button
              className="btn btn-outline-danger"
              onClick={handleDelete}
            >
              Delete
            </button>
          </div>
        )}
      </td>
    </tr>
  );
}

export default ProductRow;
