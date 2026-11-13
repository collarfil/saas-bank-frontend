// src/api/transactionApi.js
import api from "./axios";

export const transactionApi = {
  deposit: (data) => api.post("/transaction/deposit", data),
  getByAccount: (accountId) => api.get(`/transaction/account/${accountId}`),
};
