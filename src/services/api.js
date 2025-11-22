import axios from "axios";

// dynamic baseURL (local vs production)
const api = axios.create({
  baseURL:
    process.env.REACT_APP_API_URL || "http://localhost:5000/api",  
});

// attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ------------------ AUTH ------------------
export const registerUser = (data) => api.post("/auth/register", data);
export const loginUser = (data) => api.post("/auth/login", data);
export const fetchCurrentUser = () => api.get("/auth/me");

// ------------------ PRODUCTS ------------------
export const getProducts = (page = 1, limit = 5, sortField = "id", sortOrder = "asc") =>
  api.get(
    `/products?page=${page}&limit=${limit}&sortField=${sortField}&sortOrder=${sortOrder}`
  );

export const searchProducts = (name) =>
  api.get(`/products/search?name=${name}`);

export const createProduct = (data) => api.post("/products", data);

export const updateProduct = (id, data) => api.put(`/products/${id}`, data);

export const deleteProduct = (id) => api.delete(`/products/${id}`);

// ------------------ IMPORT / EXPORT ------------------
export const importCSV = (file) => {
  const formData = new FormData();
  formData.append("file", file);

  return api.post("/products/import", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const exportCSV = () =>
  api.get("/products/export", { responseType: "blob" });

// ------------------ HISTORY ------------------
export const getHistory = (id) => api.get(`/products/${id}/history`);

export default api;
