import api from "./axios";

export const tenantApi = {
  getAll: () => api.get("/tenant"),
  getById: (id) => api.get(`/tenant/${id}`),
  create: (data) => api.post("/tenant", data),
  update: (id, data) => api.put(`/tenant/${id}`, data),
  delete: (id) => api.delete(`/tenant/${id}`),
  activate: (id) => api.post(`/tenant/${id}/activate`),
  deactivate: (id) => api.post(`/tenant/${id}/deactivate`),
};
