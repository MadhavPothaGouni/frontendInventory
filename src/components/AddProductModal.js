import React, { useState } from "react";
import { createProduct } from "../services/api";

function AddProductModal({ show, onClose, onCreated }) {
  const [form, setForm] = useState({
    name: "",
    unit: "",
    category: "",
    brand: "",
    stock: "",
    status: "In Stock",
    image: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.name || !form.stock) {
      alert("Name and Stock are required");
      return;
    }

    const payload = {
      ...form,
      stock: Number(form.stock),
      status: Number(form.stock) === 0 ? "Out of Stock" : "In Stock",
    };

    await createProduct(payload);
    onCreated();
    onClose();
  };

  if (!show) return null;

  return (
    <div className="modal fade show" style={{ display: "block" }} tabIndex="-1">
      <div className="modal-dialog">
        <div className="modal-content">

          <div className="modal-header">
            <h5 className="modal-title">Add New Product</h5>
            <button className="btn-close" onClick={onClose}></button>
          </div>

          <div className="modal-body">
            <div className="mb-2">
              <label className="form-label">Name</label>
              <input className="form-control" name="name" value={form.name} onChange={handleChange} />
            </div>

            <div className="mb-2">
              <label className="form-label">Unit</label>
              <input className="form-control" name="unit" value={form.unit} onChange={handleChange} />
            </div>

            <div className="mb-2">
              <label className="form-label">Category</label>
              <input className="form-control" name="category" value={form.category} onChange={handleChange} />
            </div>

            <div className="mb-2">
              <label className="form-label">Brand</label>
              <input className="form-control" name="brand" value={form.brand} onChange={handleChange} />
            </div>

            <div className="mb-2">
              <label className="form-label">Stock</label>
              <input type="number" className="form-control" name="stock" value={form.stock} onChange={handleChange} />
            </div>

            <div className="mb-2">
              <label className="form-label">Image URL</label>
              <input className="form-control" name="image" value={form.image} onChange={handleChange} />
            </div>

          </div>

          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSubmit}>Save</button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default AddProductModal;
