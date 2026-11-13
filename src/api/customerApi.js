import api from "./axios";

export const customerApi = {
  getAll: () => api.get("/customer"),
  getById: (id) => api.get(`/customer/${id}`),
  getMyProfile: () => api.get("/customer/me"), // <-- ADD THIS
  upsert: (data) => api.post("/customer/upsert", data),
  delete: (id) => api.delete(`/customer/${id}`),
};
