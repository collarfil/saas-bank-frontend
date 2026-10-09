import api from './axios';

export const employeeApi = {
    getAll: () => api.get('/employee'),
    getById: (id) => api.get(`/employee/${id}`),
    upsert: (data) => api.post('/employee/upsert', data),
    delete: (id) => api.delete(`/employee/${id}`)
};