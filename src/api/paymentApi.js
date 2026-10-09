import api from './axios';

export const paymentApi = {
    // Paystack
    initializePaystack: (data) => api.post('/payment/paystack/initialize', data),
    verifyPaystack: (reference) => api.get(`/payment/paystack/verify/${reference}`),
    
    // Flutterwave
    initializeFlutterwave: (data) => api.post('/payment/flutterwave/initialize', data),
    verifyFlutterwave: (transactionId) => api.get(`/payment/flutterwave/verify/${transactionId}`),
    
    // Common
    getHistory: () => api.get('/payment/history'),
    processSubscription: (data) => api.post('/payment/process-subscription', data)
};