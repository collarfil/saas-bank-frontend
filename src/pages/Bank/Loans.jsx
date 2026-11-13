import React, { useState, useEffect } from "react";
import { loanApi } from "../../api/loanApi";
import { customerApi } from "../../api/customerApi";
import { loanProductApi } from "../../api/loanProductApi";
import Modal from "../../components/Modal";
import toast from "react-hot-toast";

const Loans = () => {
  const [loans, setLoans] = useState([]); // <-- ADDED LOANS STATE
  const [customers, setCustomers] = useState([]);
  const [loanProducts, setLoanProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const [loanApplication, setLoanApplication] = useState({
    CustomerId: "",
    LoanProductId: "",
    Principal: "",
  });

  useEffect(() => {
    fetchLoans(); // <-- FETCH LOANS ON MOUNT
    fetchCustomers();
    fetchLoanProducts();
  }, []);

  const fetchLoans = async () => {
    try {
      const response = await loanApi.getAll();
      const data = Array.isArray(response.data) ? response.data : [];
      setLoans(data);
    } catch (error) {
      console.error("Failed to fetch loans:", error);
    }
  };

  const fetchCustomers = async () => {
    try {
      const response = await customerApi.getAll();
      const data = Array.isArray(response.data) ? response.data : [];
      setCustomers(data);
    } catch (error) {
      console.error("Failed to fetch customers:", error);
    }
  };

  const fetchLoanProducts = async () => {
    try {
      const response = await loanProductApi.getAll();
      const data = Array.isArray(response.data) ? response.data : [];
      setLoanProducts(data);
    } catch (error) {
      console.error("Failed to fetch loan products:", error);
    }
  };

  const handleApplyLoan = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await loanApi.apply({
        CustomerId: parseInt(loanApplication.CustomerId),
        LoanProductId: parseInt(loanApplication.LoanProductId),
        Principal: parseFloat(loanApplication.Principal),
      });
      toast.success("Loan application submitted");
      setModalOpen(false);
      setLoanApplication({ CustomerId: "", LoanProductId: "", Principal: "" });
      fetchLoans(); // <-- REFRESH TABLE
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.response?.data ||
          "Failed to submit loan application",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await loanApi.approve(id);
      toast.success("Loan approved");
      fetchLoans();
    } catch (err) {
      toast.error("Failed to approve loan");
    }
  };

  const handleDisburse = async (id) => {
    try {
      await loanApi.disburse(id);
      toast.success("Loan disbursed");
      fetchLoans();
    } catch (err) {
      toast.error("Failed to disburse loan");
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Loans</h1>
        <button
          onClick={() => setModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          Apply for Loan
        </button>
      </div>

      {/* LOANS TABLE */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Principal
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Interest
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          {/* ✅ THE MISSING TBODY */}
          <tbody className="bg-white divide-y divide-gray-200">
            {loans.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                  No loans found
                </td>
              </tr>
            ) : (
              loans.map((loan) => {
                const customer = customers.find(
                  (c) => c.id === loan.customerId,
                );
                const customerName = customer
                  ? `${customer.firstName} ${customer.lastName}`
                  : `Customer ID: ${loan.customerId}`;

                return (
                  <tr key={loan.id}>
                    <td className="px-6 py-4 text-sm">{loan.id}</td>
                    <td className="px-6 py-4 text-sm">{customerName}</td>
                    <td className="px-6 py-4 text-sm">
                      ₦{loan.principal?.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      ₦{loan.interest?.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                        {loan.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm space-x-3">
                      {loan.status === "Pending" && (
                        <button
                          onClick={() => handleApprove(loan.id)}
                          className="text-green-600 hover:text-green-900"
                        >
                          Approve
                        </button>
                      )}
                      {loan.status === "Approved" && (
                        <button
                          onClick={() => handleDisburse(loan.id)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Disburse
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Apply Loan Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Apply for Loan"
      >
        <form onSubmit={handleApplyLoan} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Customer</label>
            <select
              required
              className="w-full border rounded-lg px-3 py-2"
              value={loanApplication.CustomerId}
              onChange={(e) =>
                setLoanApplication({
                  ...loanApplication,
                  CustomerId: e.target.value,
                })
              }
            >
              <option value="">Select Customer</option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.firstName} {customer.lastName} - {customer.email}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Loan Product
            </label>
            <select
              required
              className="w-full border rounded-lg px-3 py-2"
              value={loanApplication.LoanProductId}
              onChange={(e) =>
                setLoanApplication({
                  ...loanApplication,
                  LoanProductId: e.target.value,
                })
              }
            >
              <option value="">Select Loan Product</option>
              {loanProducts.length === 0 ? (
                <option value="" disabled>
                  No loan products exist. Create one first.
                </option>
              ) : (
                loanProducts.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name} - {product.interestRate}% interest
                  </option>
                ))
              )}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Principal Amount (₦)
            </label>
            <input
              type="number"
              required
              min="1000"
              className="w-full border rounded-lg px-3 py-2"
              value={loanApplication.Principal}
              onChange={(e) =>
                setLoanApplication({
                  ...loanApplication,
                  Principal: e.target.value,
                })
              }
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4 border-t">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || loanProducts.length === 0}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Submit Application"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Loans;
