// src/pages/Customer/MyLoans.jsx
import React, { useState, useEffect } from "react";
import { loanApi } from "../../api/loanApi";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import { BanknotesIcon } from "@heroicons/react/24/outline";
import { customerApi } from "../../api/customerApi";

const MyLoans = () => {
  const { user } = useAuth();
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        // 1. Get the actual Customer entity to get the integer ID
        const profileRes = await customerApi.getMyProfile();
        const customerId = profileRes.data.id; // This is the int ID

        // 2. Fetch loans using the integer ID
        const response = await loanApi.getByCustomer(customerId);
        setLoans(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        toast.error("Failed to load your loans.");
      } finally {
        setLoading(false);
      }
    };
    fetchLoans();
  }, []);

  const formatCurrency = (val) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(val || 0);

  const getStatusColor = (status) => {
    switch (status) {
      case "Disbursed":
      case "Approved":
        return "bg-green-100 text-green-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="p-10 text-center text-gray-500">
        Loading your loans...
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Loans</h1>
          <p className="text-sm text-gray-500">
            Track your loan applications and active loans
          </p>
        </div>
      </div>

      {loans.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-10 text-center">
          <BanknotesIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No loans found</h3>
          <p className="text-gray-500 mt-1">
            You haven't applied for any loans yet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {loans.map((loan) => (
            <div
              key={loan.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Loan ID: #{loan.id}
                  </p>
                  <h3 className="text-xl font-bold text-gray-900 mt-1">
                    {formatCurrency(loan.principal)}
                  </h3>
                </div>
                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(loan.status)}`}
                >
                  {loan.status}
                </span>
              </div>

              <div className="space-y-3 mt-6 border-t border-gray-100 pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Interest</span>
                  <span className="font-medium text-gray-900">
                    {formatCurrency(loan.interest)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Total Payable</span>
                  <span className="font-bold text-blue-600">
                    {formatCurrency(loan.totalPayable)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Disbursed Date</span>
                  <span className="font-medium text-gray-900">
                    {loan.disbursedAt
                      ? new Date(loan.disbursedAt).toLocaleDateString()
                      : "Not Disbursed"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyLoans;
