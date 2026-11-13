import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { subscriptionApi } from "../../api/subscriptionApi";
import { paymentApi } from "../../api/paymentApi";

const Subscriptions = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    PlanName: "",
    Amount: "",
    StartDate: new Date().toISOString().split("T")[0],
    EndDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1))
      .toISOString()
      .split("T")[0],
  });

  const [payingSubId, setPayingSubId] = useState(null);
  const [gateway, setGateway] = useState("paystack");

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    setLoading(true);
    try {
      const response = await subscriptionApi.getAll();
      setSubscriptions(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      toast.error("Failed to load subscriptions.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await subscriptionApi.create({
        PlanName: formData.PlanName,
        Amount: parseFloat(formData.Amount),
        StartDate: new Date(formData.StartDate).toISOString(),
        EndDate: new Date(formData.EndDate).toISOString(),
      });
      toast.success("Subscription created. Please pay to activate.");
      fetchSubscriptions();
      setIsModalOpen(false);
      setFormData({ ...formData, PlanName: "", Amount: "" });
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to create subscription",
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (sub) => {
    setPayingSubId(sub.id);
    try {
      // 1. Initialize payment (generates a reference)
      const payload = { SubscriptionId: sub.id, Amount: sub.amount };
      let response;
      if (gateway === "paystack") {
        response = await paymentApi.initializePaystack(payload);
      } else {
        response = await paymentApi.initializeFlutterwave(payload);
      }

      const reference = response.data.transactionReference;
      toast.loading(`Processing ${gateway} payment...`, { id: "pay" });

      // 2. Confirm payment (this marks the subscription IsActive = true on the backend)
      if (gateway === "paystack") {
        await paymentApi.confirmPaystack(reference, true);
      } else {
        await paymentApi.confirmFlutterwave(reference, true);
      }

      toast.success("Payment successful! Platform unlocked.", { id: "pay" });
      fetchSubscriptions();

      // 3. Force a reload so the SubscriptionGuard re-runs
      setTimeout(() => navigate("/bank"), 500);
    } catch (error) {
      toast.error(error.response?.data?.message || "Payment failed", {
        id: "pay",
      });
    } finally {
      setPayingSubId(null);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Subscriptions</h1>
          <p className="text-sm text-gray-500">
            Create and pay for your bank's SaaS subscription to unlock the
            system.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          + Create Subscription
        </button>
      </div>

      {loading && subscriptions.length === 0 ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {subscriptions.length === 0 ? (
            <div className="col-span-2 bg-amber-50 border border-amber-200 p-6 rounded-lg text-center">
              <p className="text-amber-800 font-medium">
                No subscriptions found.
              </p>
              <p className="text-amber-600 text-sm mt-1">
                Create a subscription to unlock the application.
              </p>
            </div>
          ) : (
            subscriptions.map((sub) => (
              <div
                key={sub.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 relative"
              >
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-bold text-gray-900">
                    {sub.planName}
                  </h2>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${sub.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                  >
                    {sub.isActive ? "ACTIVE" : "UNPAID"}
                  </span>
                </div>
                <p className="text-3xl font-extrabold text-blue-600 mb-4">
                  ₦{sub.amount?.toLocaleString()}
                </p>
                <div className="text-sm text-gray-500 space-y-1 mb-6">
                  <p>
                    <strong>Start:</strong>{" "}
                    {new Date(sub.startDate).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>End:</strong>{" "}
                    {new Date(sub.endDate).toLocaleDateString()}
                  </p>
                </div>

                {!sub.isActive ? (
                  <div className="space-y-3">
                    <select
                      value={gateway}
                      onChange={(e) => setGateway(e.target.value)}
                      className="w-full border rounded-lg px-3 py-2 text-sm"
                    >
                      <option value="paystack">Pay with Paystack</option>
                      <option value="flutterwave">Pay with Flutterwave</option>
                    </select>
                    <button
                      onClick={() => handlePayment(sub)}
                      disabled={payingSubId === sub.id}
                      className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 font-medium"
                    >
                      {payingSubId === sub.id
                        ? "Processing..."
                        : `Pay ₦${sub.amount?.toLocaleString()}`}
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={async () => {
                      if (window.confirm("Cancel this subscription?")) {
                        await subscriptionApi.cancel(sub.id);
                        fetchSubscriptions();
                      }
                    }}
                    className="w-full border border-red-200 text-red-600 py-2 rounded-lg hover:bg-red-50 transition"
                  >
                    Cancel Subscription
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Modal for creating subscription */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Create Subscription</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm mb-1">Plan Name</label>
                <input
                  required
                  type="text"
                  placeholder="e.g., Premium Annual Plan"
                  value={formData.PlanName}
                  onChange={(e) =>
                    setFormData({ ...formData, PlanName: e.target.value })
                  }
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Amount (₦)</label>
                <input
                  required
                  type="number"
                  placeholder="e.g., 50000"
                  value={formData.Amount}
                  onChange={(e) =>
                    setFormData({ ...formData, Amount: e.target.value })
                  }
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1">Start Date</label>
                  <input
                    required
                    type="date"
                    value={formData.StartDate}
                    onChange={(e) =>
                      setFormData({ ...formData, StartDate: e.target.value })
                    }
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">End Date</label>
                  <input
                    required
                    type="date"
                    value={formData.EndDate}
                    onChange={(e) =>
                      setFormData({ ...formData, EndDate: e.target.value })
                    }
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Subscriptions;
