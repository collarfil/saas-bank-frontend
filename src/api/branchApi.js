import api from "./axios";

export const branchApi = {
  getAll: () => api.get("/branch"),
  getById: (id) => api.get(`/branch/${id}`),
  upsert: (data) => api.post("/branch/upsert", data),
  delete: (id) => api.delete(`/branch/${id}`),
};
