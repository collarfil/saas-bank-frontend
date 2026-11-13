import api from "./axios";

export const paymentApi = {
  // Paystack (Matches PaystackPaymentsController)
  initializePaystack: (data) => api.post("/paystackpayments/initialize", data),
  confirmPaystack: (reference, success) =>
    api.post(`/paystackpayments/confirm/${reference}?success=${success}`),

  // Flutterwave (Matches FlutterwavePaymentsController)
  initializeFlutterwave: (data) =>
    api.post("/flutterwavepayments/initialize", data),
  confirmFlutterwave: (reference, success) =>
    api.post(`/flutterwavepayments/confirm/${reference}?success=${success}`),
};
