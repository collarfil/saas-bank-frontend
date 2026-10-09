import api from './axios';

export const customerKYCApi = {
    getAll: () => api.get('/customer_kyc'),
    getById: (id) => api.get(`/customer_kyc/${id}`),
    upsert: (data) => api.post('/customer_kyc/upsert', data),
    delete: (id) => api.delete(`/customer_kyc/${id}`)
};