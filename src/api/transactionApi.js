// src/api/transactionApi.js
import api from './axios';

export const transactionApi = {
    getAll: () => api.get('/transaction'),
    getById: (id) => api.get(`/transaction/${id}`),
    getAccountTransactions: (accountId) => api.get(`/transaction/account/${accountId}`),
    deposit: (data) => api.post('/transaction/deposit', data),
    withdraw: (data) => api.post('/transaction/withdraw', data),
    transfer: (data) => api.post('/transaction/transfer', data),
    reverse: (id, reason) => api.post(`/transaction/reverse/${id}`, reason),
    getStatement: (accountId, fromDate, toDate) => api.get(`/transaction/account/${accountId}/statement`, { params: { fromDate, toDate } }),
    getBalance: (accountId) => api.get(`/transaction/account/${accountId}/balance`)
};