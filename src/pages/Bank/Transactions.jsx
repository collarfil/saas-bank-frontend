// src/pages/Bank/Transactions.jsx
import React, { useState, useEffect } from "react";
import Modal from "../../components/Modal";
import { transactionApi } from "../../api/transactionApi";
import { accountApi } from "../../api/accountApi";
import toast from "react-hot-toast";

const Transactions = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    AccountId: "",
    Amount: "",
    Reference: "DEP-" + Math.floor(Math.random() * 100000000), // Auto-generated
    Narration: "",
    Channel: "Cash",
  });

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const response = await accountApi.getAll();
      // Only show Active accounts in the dropdown
      const activeAccounts = response.data.filter((a) => a.status === "Active");
      setAccounts(activeAccounts);
    } catch (error) {
      toast.error("Failed to fetch accounts");
    }
  };

  const handleDeposit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        AccountId: parseInt(formData.AccountId),
        Amount: parseFloat(formData.Amount),
        Reference: formData.Reference,
        Narration: formData.Narration,
        Channel: formData.Channel,
      };

      await transactionApi.deposit(payload);
      toast.success("Deposit successful!");

      // Reset form and generate new reference
      setFormData({
        AccountId: "",
        Amount: "",
        Reference: "DEP-" + Math.floor(Math.random() * 100000000),
        Narration: "",
        Channel: "Cash",
      });
      setModalOpen(false);
    } catch (error) {
      toast.error(error.response?.data || "Deposit failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Transactions</h1>
          <p className="text-sm text-gray-500 mt-1">
            Process customer deposits
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
        >
          + New Deposit
        </button>
      </div>

      {/* Placeholder for future transaction list */}
      <div className="bg-white rounded-lg shadow p-10 text-center border-dashed border-2 border-gray-300">
        <p className="text-gray-500 mb-2">
          Transaction History is unavailable.
        </p>
        <p className="text-sm text-gray-400">
          The current backend controller only supports making a deposit. To view
          a history of transactions, a{" "}
          <code className="bg-gray-100 p-1 rounded">GET /api/transaction</code>{" "}
          endpoint needs to be added to the backend.
        </p>
      </div>

      {/* Deposit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Make Deposit"
      >
        <form onSubmit={handleDeposit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Account</label>
            <select
              required
              className="w-full border rounded-lg px-3 py-2"
              value={formData.AccountId}
              onChange={(e) =>
                setFormData({ ...formData, AccountId: e.target.value })
              }
            >
              <option value="">Select Account</option>
              {accounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.account_Number || account.accountNumber} - ₦
                  {account.balance?.toLocaleString()}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Amount (₦)</label>
            <input
              type="number"
              required
              min="1"
              step="0.01"
              className="w-full border rounded-lg px-3 py-2"
              value={formData.Amount}
              onChange={(e) =>
                setFormData({ ...formData, Amount: e.target.value })
              }
              placeholder="e.g. 5000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Reference</label>
            <input
              type="text"
              required
              className="w-full border rounded-lg px-3 py-2 bg-gray-50"
              value={formData.Reference}
              onChange={(e) =>
                setFormData({ ...formData, Reference: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Channel</label>
            <select
              className="w-full border rounded-lg px-3 py-2"
              value={formData.Channel}
              onChange={(e) =>
                setFormData({ ...formData, Channel: e.target.value })
              }
            >
              <option value="Cash">Cash</option>
              <option value="Transfer">Transfer</option>
              <option value="POS">POS</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Narration</label>
            <textarea
              rows="2"
              required
              className="w-full border rounded-lg px-3 py-2"
              value={formData.Narration}
              onChange={(e) =>
                setFormData({ ...formData, Narration: e.target.value })
              }
              placeholder="Optional description"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4 border-t mt-4">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? "Processing..." : "Confirm Deposit"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Transactions;
