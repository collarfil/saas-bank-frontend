// src/pages/Customer/MyAccounts.jsx
import React, { useState, useEffect } from "react";
import { accountApi } from "../../api/accountApi";
import { customerApi } from "../../api/customerApi";
import toast from "react-hot-toast";
import { CreditCardIcon } from "@heroicons/react/24/outline";

const MyAccounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const profileRes = await customerApi.getMyProfile();
        const customerId = profileRes.data.id;

        const response = await accountApi.getByCustomer(customerId);
        const myAccounts = Array.isArray(response.data) ? response.data : [];

        setAccounts(myAccounts);
      } catch (error) {
        toast.error("Failed to load your accounts.");
      } finally {
        setLoading(false);
      }
    };
    fetchAccounts();
  }, []);

  const formatCurrency = (val) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(val || 0);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-500">
        Loading your accounts...
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Accounts</h1>
      </div>

      {accounts.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-10 text-center">
          <CreditCardIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">
            No accounts found
          </h3>
          <p className="text-gray-500 mt-1">
            You do not have any active accounts at this time.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {accounts.map((account) => (
            <div
              key={account.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Account Number
                  </p>
                  <h3 className="text-xl font-bold text-gray-900 tracking-wider">
                    {account.account_Number}
                  </h3>
                </div>
                <div className="bg-blue-50 p-3 rounded-full text-blue-600">
                  <CreditCardIcon className="h-6 w-6" />
                </div>
              </div>

              <div className="mt-4">
                <p className="text-sm font-medium text-gray-500">
                  Available Balance
                </p>
                <p className="text-3xl font-bold text-green-600">
                  {formatCurrency(account.balance)}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center">
                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                    account.status === "Active"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {account.status}
                </span>
                <p className="text-xs text-gray-400">
                  Opened: {new Date(account.opened_At).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyAccounts;
