import api from "./axios";

export const ledgerApi = {
  submit: (entries) => api.post("/ledger/submit", entries),
  approve: (transactionId) => api.post(`/ledger/approve/${transactionId}`),
  reject: (transactionId) => api.post(`/ledger/reject/${transactionId}`),
  getByAccount: (accountId) => api.get(`/ledger/account/${accountId}`),
};
