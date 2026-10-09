import api from './axios';

export const departmentApi = {
    getAll: () => api.get('/department'),
    getById: (id) => api.get(`/department/${id}`),
    upsert: (data) => api.post('/department/upsert', data),
    delete: (id) => api.delete(`/depaartment/${id}`)
};