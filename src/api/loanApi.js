import api from './axios';

export const loanApi = {
    apply: (data) => api.post('/loan/apply', data),
    approve: (loanId) => api.post(`/loan/approve/${loanId}`),
    disburse: (loanId) => api.post(`/loan/disburse/${loanId}`),
    repay: (data) => api.post('/loan/repay', data)
};