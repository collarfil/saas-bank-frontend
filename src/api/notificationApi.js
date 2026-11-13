import api from "./axios";

export const notificationApi = {
  getAll: () => api.get("/notification"),
  getById: (id) => api.get(`/notification/${id}`),
  // Note: Backend route is [HttpPost("Upsert")]
  upsert: (data) => api.post("/notification/upsert", data),
  delete: (id) => api.delete(`/notification/${id}`),
};

export default notificationApi;
