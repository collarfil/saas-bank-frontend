// src/pages/Customer/MyTransactions.jsx
import React, { useState, useEffect } from "react";
import { accountApi } from "../../api/accountApi";
import { transactionApi } from "../../api/transactionApi";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import DataTable from "../../components/DataTable"; // Assuming you want to use your existing component
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { customerApi } from "../../api/customerApi";

const MyTransactions = () => {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState([]);
  const [selectedAccountId, setSelectedAccountId] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchingTx, setFetchingTx] = useState(false);

  // 1. Fetch the customer's accounts on mount
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        // 1. Get the actual Customer entity to get the integer ID
        const profileRes = await customerApi.getMyProfile();
        const customerId = profileRes.data.id; // This is the int ID (e.g., 1)

        // 2. Fetch accounts using the integer ID
        const response = await accountApi.getByCustomer(customerId);
        const myAccounts = Array.isArray(response.data) ? response.data : [];
        setAccounts(myAccounts);

        if (myAccounts.length > 0) {
          setSelectedAccountId(myAccounts[0].id);
        }
      } catch (error) {
        toast.error("Failed to load your accounts.");
      } finally {
        setLoading(false);
      }
    };
    fetchAccounts();
  }, []);

  // 2. Fetch transactions whenever the selected account changes
  useEffect(() => {
    if (!selectedAccountId) return;

    const fetchTransactions = async () => {
      setFetchingTx(true);
      try {
        const response = await transactionApi.getByAccount(selectedAccountId);
        // The backend sorts descending, but just to be safe we reverse it or sort by date
        const txs = Array.isArray(response.data) ? response.data : [];
        setTransactions(txs);
      } catch (error) {
        toast.error("Failed to load transactions.");
      } finally {
        setFetchingTx(false);
      }
    };
    fetchTransactions();
  }, [selectedAccountId]);

  const formatCurrency = (val) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(val || 0);

  const formatDate = (val) => {
    if (!val) return "—";
    return new Date(val).toLocaleString("en-NG", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  // Define columns for your DataTable component
  const columns = [
    {
      key: "created_At",
      label: "Date",
      format: (value) => formatDate(value),
    },
    { key: "reference", label: "Reference" },
    { key: "narration", label: "Narration" },
    {
      key: "amount",
      label: "Amount",
      format: (value, row) => (
        <span
          className={`font-semibold ${row.type === "Credit" ? "text-green-600" : "text-red-600"}`}
        >
          {row.type === "Credit" ? "+" : "-"}
          {formatCurrency(value)}
        </span>
      ),
    },
    {
      key: "type",
      label: "Type",
      format: (value) => (
        <span
          className={`px-2 py-1 rounded-full text-xs ${value === "Credit" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
        >
          {value}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      format: (value) => (
        <span
          className={`px-2 py-1 rounded-full text-xs ${
            value === "Approved"
              ? "bg-green-100 text-green-800"
              : value === "Rejected"
                ? "bg-red-100 text-red-800"
                : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {value}
        </span>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="p-10 text-center text-gray-500">Loading accounts...</div>
    );
  }

  if (accounts.length === 0) {
    return (
      <div className="p-10 text-center text-gray-500 bg-white rounded-xl shadow-sm border border-gray-100">
        You need an active account to view transactions.
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Transactions</h1>
          <p className="text-sm text-gray-500">View your account activity</p>
        </div>

        {/* Account Selector */}
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-gray-700">Account:</label>
          <select
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none"
            value={selectedAccountId}
            onChange={(e) => setSelectedAccountId(e.target.value)}
          >
            {accounts.map((acc) => (
              <option key={acc.id} value={acc.id}>
                {acc.account_Number} (₦{acc.balance.toLocaleString()})
              </option>
            ))}
          </select>
          <button
            onClick={() => setSelectedAccountId(selectedAccountId)} // trigger refresh
            className="p-2 text-gray-500 hover:text-blue-600 bg-white border border-gray-300 rounded-lg"
            title="Refresh"
          >
            <ArrowPathIcon
              className={`h-4 w-4 ${fetchingTx ? "animate-spin" : ""}`}
            />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {transactions.length === 0 && !fetchingTx ? (
          <div className="p-10 text-center text-gray-500">
            No transactions found for this account.
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={transactions}
            loading={fetchingTx}
            itemsPerPage={10}
          />
        )}
      </div>
    </div>
  );
};

export default MyTransactions;
