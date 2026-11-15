// src/api/loanApi.js
import api from "./axios";

/**
 * LoanController routes (verified against backend):
 *   POST /api/loan/apply            → ApplyLoanDto { CustomerId, LoanProductId, Principal }
 *   POST /api/loan/approve/{id}     → approve a pending loan
 *   POST /api/loan/disburse/{id}    → disbursement of an approved loan
 *   POST /api/loan/repay            → LoanRepayment { LoanId, Amount }
 *
 * ⚠️ LoanController has NO list or getById endpoint.
 *    To display loans, you need a LoanController.GetAll action added on backend.
 *    Do not add `getAll` here until the endpoint exists.
 */
export const loanApi = {
  apply: (data) => api.post("/loan/apply", data),
  approve: (id) => api.post(`/loan/approve/${id}`),
  disburse: (id) => api.post(`/loan/disburse/${id}`),
  repay: (data) => api.post("/loan/repay", data),
};

export default loanApi;
