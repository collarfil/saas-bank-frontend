// src/pages/Customer/ApplyLoan.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loanProductApi } from "../../api/loanProductApi";
import { loanApi } from "../../api/loanApi";
import { customerApi } from "../../api/customerApi";
import toast from "react-hot-toast";
import { BanknotesIcon } from "@heroicons/react/24/outline";

const ApplyLoan = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    loanProductId: "",
    principal: "",
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await loanProductApi.getAll();
        setProducts(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        toast.error("Failed to load loan products.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // 1. Get the customer's actual integer ID
      const profileRes = await customerApi.getMyProfile();
      const customerId = profileRes.data.id;

      // 2. Submit the application
      const payload = {
        CustomerId: customerId,
        LoanProductId: parseInt(formData.loanProductId),
        Principal: parseFloat(formData.principal),
      };

      await loanApi.apply(payload);

      toast.success("Loan application submitted successfully!");
      navigate("/dashboard/my-loans"); // Redirect to view their loans
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to submit loan application.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Get the selected product details for preview
  const selectedProduct = products.find(
    (p) => p.id === parseInt(formData.loanProductId),
  );

  if (loading) {
    return (
      <div className="p-10 text-center text-gray-500">Loading products...</div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Apply for a Loan</h1>
        <p className="text-sm text-gray-500 mt-1">
          Select a loan product and enter the amount you need.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Loan Product <span className="text-red-500">*</span>
            </label>
            <select
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              value={formData.loanProductId}
              onChange={(e) =>
                setFormData({ ...formData, loanProductId: e.target.value })
              }
            >
              <option value="">-- Choose a product --</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name} ({product.interestRate}% Interest)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Loan Amount (₦) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              required
              min="1000"
              step="500"
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. 50000"
              value={formData.principal}
              onChange={(e) =>
                setFormData({ ...formData, principal: e.target.value })
              }
            />
          </div>

          {/* Loan Preview Box */}
          {selectedProduct && formData.principal > 0 && (
            <div className="bg-blue-50 rounded-lg p-5 border border-blue-100 mt-6">
              <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                <BanknotesIcon className="h-5 w-5" />
                Loan Summary
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-blue-700">Principal Amount:</span>
                  <span className="font-medium">
                    ₦{parseFloat(formData.principal).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Interest Rate:</span>
                  <span className="font-medium">
                    {selectedProduct.interestRate}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Duration:</span>
                  <span className="font-medium">
                    {selectedProduct.duration} months
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Penalty Rate:</span>
                  <span className="font-medium">
                    {selectedProduct.penaltyRate}%
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 font-medium"
            >
              {submitting ? "Submitting..." : "Submit Application"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplyLoan;
