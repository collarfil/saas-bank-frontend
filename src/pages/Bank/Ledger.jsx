import React, { useState } from "react";
import toast from "react-hot-toast";
import { ledgerApi } from "../../api/ledgerApi";

const Ledger = () => {
  const [activeTab, setActiveTab] = useState("search"); // 'search', 'submit', 'approve'

  // State for Search
  const [searchAccountId, setSearchAccountId] = useState("");
  const [entries, setEntries] = useState([]);
  const [loadingSearch, setLoadingSearch] = useState(false);

  // State for Submit
  const [submitData, setSubmitData] = useState({
    DebitAccountId: "",
    CreditAccountId: "",
    Amount: "",
  });
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  // State for Approve/Reject
  const [transactionId, setTransactionId] = useState("");
  const [loadingAction, setLoadingAction] = useState(false);

  // --- Handlers ---
  const handleSearch = async (e) => {
    e.preventDefault();
    setLoadingSearch(true);
    try {
      const response = await ledgerApi.getByAccount(searchAccountId);
      setEntries(response.data);
      if (response.data.length === 0)
        toast.info("No entries found for this account.");
    } catch (error) {
      toast.error("Failed to fetch ledger entries");
    } finally {
      setLoadingSearch(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingSubmit(true);
    try {
      // Backend expects a List<LedgerEntryDto>
      const payload = [
        {
          AccountId: parseInt(submitData.DebitAccountId),
          Amount: parseFloat(submitData.Amount),
          EntryType: 1, // 1 = Debit (based on your enum)
        },
        {
          AccountId: parseInt(submitData.CreditAccountId),
          Amount: parseFloat(submitData.Amount),
          EntryType: 2, // 2 = Credit (based on your enum)
        },
      ];

      await ledgerApi.submit(payload);
      toast.success("Journal entry submitted! Awaiting approval.");
      setSubmitData({ DebitAccountId: "", CreditAccountId: "", Amount: "" });
    } catch (error) {
      toast.error(error.response?.data || "Failed to submit entry");
    } finally {
      setLoadingSubmit(false);
    }
  };

  const handleAction = async (action) => {
    if (!transactionId) return toast.error("Please enter a Transaction ID");
    setLoadingAction(true);
    try {
      if (action === "approve") {
        await ledgerApi.approve(transactionId);
        toast.success("Transaction approved and posted!");
      } else {
        await ledgerApi.reject(transactionId);
        toast.success("Transaction rejected.");
      }
      setTransactionId("");
    } catch (error) {
      toast.error(error.response?.data || `Failed to ${action} transaction`);
    } finally {
      setLoadingAction(false);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">General Ledger</h1>
        <p className="text-sm text-gray-500 mt-1">
          Query account ledgers, submit journal entries, and approve pending
          transactions.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 mb-6 border-b">
        <button
          onClick={() => setActiveTab("search")}
          className={`pb-2 px-4 font-medium ${activeTab === "search" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-500"}`}
        >
          Search Account
        </button>
        <button
          onClick={() => setActiveTab("submit")}
          className={`pb-2 px-4 font-medium ${activeTab === "submit" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-500"}`}
        >
          New Journal Entry
        </button>
        <button
          onClick={() => setActiveTab("approve")}
          className={`pb-2 px-4 font-medium ${activeTab === "approve" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-500"}`}
        >
          Approve / Reject
        </button>
      </div>

      {/* TAB: SEARCH */}
      {activeTab === "search" && (
        <div className="bg-white rounded-lg shadow p-6">
          <form onSubmit={handleSearch} className="flex gap-4 mb-6">
            <input
              required
              type="number"
              placeholder="Enter Account ID (e.g., 1)"
              value={searchAccountId}
              onChange={(e) => setSearchAccountId(e.target.value)}
              className="border rounded px-3 py-2 w-64"
            />
            <button
              type="submit"
              disabled={loadingSearch}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              {loadingSearch ? "Searching..." : "Search"}
            </button>
          </form>

          {entries.length > 0 && (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                    Entry ID
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                    Transaction ID
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                    Type
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                    Amount
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {entries.map((entry) => (
                  <tr key={entry.id}>
                    <td className="px-4 py-3 text-sm">{entry.id}</td>
                    <td className="px-4 py-3 text-sm">{entry.transactionId}</td>
                    <td className="px-4 py-3 text-sm">
                      <span
                        className={`px-2 py-1 rounded text-xs ${entry.entryType === 1 ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}`}
                      >
                        {entry.entryType === 1 ? "Debit" : "Credit"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm font-medium">
                      ₦{entry.amount?.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {new Date(entry.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* TAB: SUBMIT */}
      {activeTab === "submit" && (
        <div className="bg-white rounded-lg shadow p-6 max-w-lg">
          <h2 className="text-lg font-semibold mb-4">Submit Journal Entry</h2>
          <p className="text-xs text-gray-500 mb-4">
            This creates a Pending transaction. It will not affect balances
            until approved.
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm mb-1">Debit Account ID</label>
              <input
                required
                type="number"
                value={submitData.DebitAccountId}
                onChange={(e) =>
                  setSubmitData({
                    ...submitData,
                    DebitAccountId: e.target.value,
                  })
                }
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Credit Account ID</label>
              <input
                required
                type="number"
                value={submitData.CreditAccountId}
                onChange={(e) =>
                  setSubmitData({
                    ...submitData,
                    CreditAccountId: e.target.value,
                  })
                }
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Amount (₦)</label>
              <input
                required
                type="number"
                step="0.01"
                value={submitData.Amount}
                onChange={(e) =>
                  setSubmitData({ ...submitData, Amount: e.target.value })
                }
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <button
              type="submit"
              disabled={loadingSubmit}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 mt-4"
            >
              {loadingSubmit ? "Submitting..." : "Submit Entry"}
            </button>
          </form>
        </div>
      )}

      {/* TAB: APPROVE */}
      {activeTab === "approve" && (
        <div className="bg-white rounded-lg shadow p-6 max-w-lg">
          <h2 className="text-lg font-semibold mb-4">
            Approve or Reject Transaction
          </h2>
          <p className="text-xs text-gray-500 mb-4">
            Enter the Transaction ID to Approve or Reject.
          </p>
          <div className="space-y-4">
            <div>
              <label className="block text-sm mb-1">Transaction ID</label>
              <input
                type="number"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                className="w-full border rounded px-3 py-2"
                placeholder="e.g. 5"
              />
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => handleAction("approve")}
                disabled={loadingAction}
                className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700"
              >
                {loadingAction ? "Processing..." : "Approve"}
              </button>
              <button
                onClick={() => handleAction("reject")}
                disabled={loadingAction}
                className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700"
              >
                {loadingAction ? "Processing..." : "Reject"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Ledger;
