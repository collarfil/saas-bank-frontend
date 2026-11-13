// src/pages/Bank/Payments.jsx
import React, { useState } from "react";
import toast from "react-hot-toast";
import { paymentApi } from "../../api/paymentApi";

const Payments = () => {
  const [provider, setProvider] = useState("paystack"); // 'paystack' or 'flutterwave'
  const [loading, setLoading] = useState(false);

  // Initialize State
  const [initData, setInitData] = useState({
    SubscriptionId: "",
    Amount: "",
  });
  const [generatedRef, setGeneratedRef] = useState("");

  // Confirm State
  const [confirmData, setConfirmData] = useState({
    Reference: "",
    Success: "true",
  });

  const handleInitialize = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        SubscriptionId: parseInt(initData.SubscriptionId),
        Amount: parseFloat(initData.Amount),
      };

      let response;
      if (provider === "paystack") {
        response = await paymentApi.initializePaystack(payload);
      } else {
        response = await paymentApi.initializeFlutterwave(payload);
      }

      // Backend returns PaymentDto with transactionReference
      setGeneratedRef(response.data.transactionReference);
      toast.success(`${provider} payment initialized!`);

      // Pre-fill the confirm box for easy testing
      setConfirmData({
        ...confirmData,
        Reference: response.data.transactionReference,
      });
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.response?.data ||
          "Failed to initialize payment",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const successBool = confirmData.Success === "true";

      if (provider === "paystack") {
        await paymentApi.confirmPaystack(confirmData.Reference, successBool);
      } else {
        await paymentApi.confirmFlutterwave(confirmData.Reference, successBool);
      }

      toast.success(
        `Payment confirmed as ${confirmData.Success === "true" ? "Successful" : "Failed"}`,
      );
      setConfirmData({ Reference: "", Success: "true" });
      setGeneratedRef("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to confirm payment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Payment Gateways</h1>
        <p className="text-sm text-gray-500 mt-1">
          Initialize and confirm transactions using Paystack or Flutterwave.
        </p>
      </div>

      {/* Provider Toggle */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setProvider("paystack")}
          className={`px-6 py-3 rounded-lg font-medium transition ${provider === "paystack" ? "bg-green-600 text-white shadow-md" : "bg-white text-gray-600 border hover:bg-gray-50"}`}
        >
          Paystack
        </button>
        <button
          onClick={() => setProvider("flutterwave")}
          className={`px-6 py-3 rounded-lg font-medium transition ${provider === "flutterwave" ? "bg-blue-600 text-white shadow-md" : "bg-white text-gray-600 border hover:bg-gray-50"}`}
        >
          Flutterwave
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Initialize Payment */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4 border-b pb-2">
            1. Initialize Payment
          </h2>
          <form onSubmit={handleInitialize} className="space-y-4">
            <div>
              <label className="block text-sm mb-1">Subscription ID</label>
              <input
                required
                type="number"
                value={initData.SubscriptionId}
                onChange={(e) =>
                  setInitData({ ...initData, SubscriptionId: e.target.value })
                }
                className="w-full border rounded px-3 py-2"
                placeholder="e.g. 1"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Amount (₦)</label>
              <input
                required
                type="number"
                step="0.01"
                value={initData.Amount}
                onChange={(e) =>
                  setInitData({ ...initData, Amount: e.target.value })
                }
                className="w-full border rounded px-3 py-2"
                placeholder="e.g. 5000"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full text-white py-2 rounded ${provider === "paystack" ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"}`}
            >
              {loading ? "Initializing..." : `Initialize ${provider}`}
            </button>
          </form>

          {generatedRef && (
            <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded text-sm break-all">
              <span className="font-semibold block mb-1">
                Generated Reference:
              </span>
              <code>{generatedRef}</code>
            </div>
          )}
        </div>

        {/* Confirm Payment */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4 border-b pb-2">
            2. Confirm Payment
          </h2>
          <p className="text-xs text-gray-500 mb-4">
            Simulate the webhook or callback from the provider.
          </p>

          <form onSubmit={handleConfirm} className="space-y-4">
            <div>
              <label className="block text-sm mb-1">
                Transaction Reference
              </label>
              <input
                required
                type="text"
                value={confirmData.Reference}
                onChange={(e) =>
                  setConfirmData({ ...confirmData, Reference: e.target.value })
                }
                className="w-full border rounded px-3 py-2"
                placeholder="Paste the generated reference here"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Payment Status</label>
              <select
                value={confirmData.Success}
                onChange={(e) =>
                  setConfirmData({ ...confirmData, Success: e.target.value })
                }
                className="w-full border rounded px-3 py-2"
              >
                <option value="true">Successful</option>
                <option value="false">Failed</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-800 text-white py-2 rounded hover:bg-gray-900"
            >
              {loading ? "Confirming..." : "Confirm Payment"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Payments;
