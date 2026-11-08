// src/api/accounttypesApi.js
import api from "./axios";

export const accounttypesApi = {
  getAll: () => api.get("/account_type"),
  getById: (id) => api.get(`/account_type/${id}`),
  upsert: (data) => api.post("/account_type/upsert", data),
  delete: (id) => api.delete(`/account_type/${id}`),
};
