// src/api/journalEntryApi.js
import api from "./axios";

export const journalEntryApi = {
  getAll: (params = {}) => api.get("/journalentry", { params }),
  getById: (id) => api.get(`/journalentry/${id}`),
  create: (data) => api.post("/journalentry", data),
  post: (id) => api.post(`/journalentry/${id}/post`),
  cancel: (id) => api.post(`/journalentry/${id}/cancel`),
  reverse: (id) => api.post(`/journalentry/${id}/reverse`),
  trialBalance: (fromDate, toDate, branchId = null) =>
    api.get("/journalentry/trial-balance", {
      params: { fromDate, toDate, ...(branchId ? { branchId } : {}) },
    }),
};

export default journalEntryApi;
