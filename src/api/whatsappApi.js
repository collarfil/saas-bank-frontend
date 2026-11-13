import api from "./axios";

export const whatsappApi = {
  getAll: () => api.get("/whatsapp"),
  getById: (id) => api.get(`/whatsapp/${id}`),
  // Note: Backend route is [HttpPost("Upsert")]
  upsert: (data) => api.post("/whatsapp/upsert", data),
  delete: (id) => api.delete(`/whatsapp/${id}`),
};

export default whatsappApi;
