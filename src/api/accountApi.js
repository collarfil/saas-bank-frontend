// src/api/accountApi.js
import api from './axios';

export const accountApi = {
    getAll: () => api.get('/account'),
    getById: (id) => api.get(`/account/${id}`),
    upsert: (data) => api.post('/account/upsert', data),
    delete: (id) => api.delete(`/account/${id}`),
    getTypes: () => api.get('/account/types')
};