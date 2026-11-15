// src/api/loanProductApi.js
import api from "./axios";

/**
 * LoanProductController routes (verified against backend):
 *   GET    /api/loanproduct
 *   GET    /api/loanproduct/{id}
 *   POST   /api/loanproduct/upsert
 *   DELETE /api/loanproduct/{id}
 */
export const loanProductApi = {
  getAll: () => api.get("/loanproduct"),
  getById: (id) => api.get(`/loanproduct/${id}`),
  upsert: (data) => api.post("/loanproduct/upsert", data),
  delete: (id) => api.delete(`/loanproduct/${id}`),
};

export default loanProductApi;
