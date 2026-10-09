import api from './axios';

export const customerAddressApi = {
    getAll: () => api.get('/customer_address'),
    getById: (id) => api.get(`/customer_address/${id}`),
    upsert: (data) => api.post('/customer_address/upsert', data),
    delete: (id) => api.delete(`/customer_address/${id}`)
};