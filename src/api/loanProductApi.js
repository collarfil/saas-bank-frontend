import api from "./axios";

export const loanProductApi = {
  getAll: () => api.get("/loanproduct"),
  getById: (id) => api.get(`/loanproduct/${id}`),
  upsert: (data) => api.post("/loanproduct/upsert", data),
  delete: (id) => api.delete(`/loanproduct/${id}`),
};
