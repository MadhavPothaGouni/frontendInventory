import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProducts, searchProducts, createProduct } from "../services/api";
import SearchBar from "../components/SearchBar";
import CategoryFilter from "../components/CategoryFilter";
import ImportExportBar from "../components/ImportExportBar";
import ProductTable from "../components/ProductTable";
import InventoryHistorySidebar from "../components/InventoryHistorySidebar";

function ProductsPage() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [sortField, setSortField] = useState("id");
  const [sortOrder, setSortOrder] = useState("asc");

  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [searchQuery, setSearchQuery] = useState("");

  const [showAddModal, setShowAddModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    unit: "",
    category: "",
    brand: "",
    stock: "",
    image: "",
  });

  const modalOverlayStyle = {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1050,
  };

  useEffect(() => {
    loadProducts(page, sortField, sortOrder);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, sortField, sortOrder]);

  const applyCategoryFilter = (sourceList, category) => {
    if (!category || category === "All Categories") {
      setProducts(sourceList);
    } else {
      setProducts(sourceList.filter((p) => p.category === category));
    }
  };

  const loadProducts = async (
    pageNo = 1,
    field = sortField,
    order = sortOrder
  ) => {
    const res = await getProducts(pageNo, 5, field, order);
    const rows = res.data.data || [];
    setAllProducts(rows);
    applyCategoryFilter(rows, selectedCategory);
    setTotalPages(res.data.pagination.totalPages || 1);
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setPage(1);
      await loadProducts(1, sortField, sortOrder);
      return;
    }

    const res = await searchProducts(query);
    const rows = res.data || [];
    setAllProducts(rows);
    applyCategoryFilter(rows, selectedCategory);
    setTotalPages(1);
    setPage(1);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    applyCategoryFilter(allProducts, category);
  };

  const handleSelect = (product) => {
    setSelectedProduct(product);
  };

  const handleSort = (field) => {
    let nextOrder = "asc";
    if (sortField === field && sortOrder === "asc") {
      nextOrder = "desc";
    }
    setSortField(field);
    setSortOrder(nextOrder);
    setPage(1);
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const buttons = [];
    for (let i = 1; i <= totalPages; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => setPage(i)}
          className={`btn btn-sm mx-1 ${
            page === i ? "btn-primary" : "btn-outline-secondary"
          }`}
        >
          {i}
        </button>
      );
    }

    return (
      <div className="d-flex justify-content-center align-items-center mt-3">
        <button
          className="btn btn-sm btn-outline-secondary me-2"
          disabled={page === 1}
          onClick={() => page > 1 && setPage(page - 1)}
        >
          Prev
        </button>
        {buttons}
        <button
          className="btn btn-sm btn-outline-secondary ms-2"
          disabled={page === totalPages}
          onClick={() => page < totalPages && setPage(page + 1)}
        >
          Next
        </button>
      </div>
    );
  };

  // Add New Product handlers
  const openAddModal = () => {
    setNewProduct({
      name: "",
      unit: "",
      category: "",
      brand: "",
      stock: "",
      image: "",
    });
    setShowAddModal(true);
  };

  const closeAddModal = () => {
    setShowAddModal(false);
  };

  const handleAddProductChange = (field, value) => {
    setNewProduct((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddProductSubmit = async (e) => {
    e.preventDefault();

    if (!newProduct.name.trim()) {
      alert("Name is required");
      return;
    }

    const stockNumber = Number(newProduct.stock || 0);
    const status = stockNumber === 0 ? "Out of Stock" : "In Stock";

    try {
      await createProduct({
        ...newProduct,
        stock: stockNumber,
        status,
      });

      closeAddModal();
      setPage(1);
      await loadProducts(1, sortField, sortOrder);
    } catch (err) {
      console.error(err);
      alert("Failed to create product");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0">Inventory Management</h2>
        <button
          className="btn btn-outline-secondary btn-sm"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>

      <div className="row align-items-center mb-3">
        <div className="col-md-8 d-flex align-items-center gap-2">
          <SearchBar onSearch={handleSearch} />
          <CategoryFilter
            allProducts={allProducts}
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
          />
          <button
            type="button"
            className="btn btn-success btn-sm ms-2"
            style={{ whiteSpace: "nowrap" }}
            onClick={openAddModal}
          >
            + Add Product
          </button>
        </div>
        <div className="col-md-4 d-flex justify-content-end">
          <ImportExportBar
            onImported={() => loadProducts(page, sortField, sortOrder)}
          />
        </div>
      </div>

      <ProductTable
        products={products}
        onSelect={handleSelect}
        refresh={() => loadProducts(page, sortField, sortOrder)}
        sortField={sortField}
        sortOrder={sortOrder}
        onSort={handleSort}
      />

      {renderPagination()}

      <InventoryHistorySidebar
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />

      {showAddModal && (
        <div style={modalOverlayStyle} onClick={closeAddModal}>
          <div
            className="card shadow"
            style={{ maxWidth: "700px", width: "90%" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Add New Product</h5>
              <button
                type="button"
                className="btn-close"
                onClick={closeAddModal}
              ></button>
            </div>

            <form onSubmit={handleAddProductSubmit}>
              <div className="card-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newProduct.name}
                      onChange={(e) =>
                        handleAddProductChange("name", e.target.value)
                      }
                      required
                    />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">Unit</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newProduct.unit}
                      onChange={(e) =>
                        handleAddProductChange("unit", e.target.value)
                      }
                    />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">Category</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newProduct.category}
                      onChange={(e) =>
                        handleAddProductChange("category", e.target.value)
                      }
                    />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label">Brand</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newProduct.brand}
                      onChange={(e) =>
                        handleAddProductChange("brand", e.target.value)
                      }
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Stock</label>
                    <input
                      type="number"
                      className="form-control"
                      value={newProduct.stock}
                      onChange={(e) =>
                        handleAddProductChange("stock", e.target.value)
                      }
                      min="0"
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Image URL</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newProduct.image}
                      onChange={(e) =>
                        handleAddProductChange("image", e.target.value)
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="card-footer d-flex justify-content-end gap-2">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={closeAddModal}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductsPage;
