// src/api/glAccountApi.js
import api from "./axios";

export const glAccountApi = {
  getAll: (includeInactive = false) =>
    api.get("/glaccount", { params: { includeInactive } }),
  getById: (id) => api.get(`/glaccount/${id}`),
  create: (data) => api.post("/glaccount", data),
  update: (id, data) => api.put(`/glaccount/${id}`, data),
  delete: (id) => api.delete(`/glaccount/${id}`), // soft delete
  hardDelete: (id) => api.delete(`/glaccount/${id}/hard`), // guarded hard delete
};

export default glAccountApi;
