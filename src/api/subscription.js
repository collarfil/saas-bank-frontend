// src/api/subscriptionApi.js
import api from './axios';

export const subscriptionApi = {
    getAll: () => api.get('/subscriptions'),
    getById: (id) => api.get(`/subscriptions/${id}`),
    create: (data) => api.post('/subscriptions', data),
    cancel: (id) => api.post(`/subscriptions/cancel/${id}`),
    renew: (id) => api.post(`/subscriptions/renew/${id}`)
};