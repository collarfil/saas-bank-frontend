import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { loanProductApi } from "../../api/loanProductApi";

const LoanProducts = () => {
  const [loanProducts, setLoanProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Matches LoanProductDto exactly
  const [formData, setFormData] = useState({
    Name: "",
    InterestRate: 0,
    Duration: 0,
    PenaltyRate: 0,
  });

  useEffect(() => {
    fetchLoanProducts();
  }, []);

  const fetchLoanProducts = async () => {
    setLoading(true);
    try {
      const response = await loanProductApi.getAll();
      setLoanProducts(response.data);
    } catch (error) {
      toast.error("Failed to load loan products");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        Id: editingId || 0,
        Name: formData.Name,
        InterestRate: parseFloat(formData.InterestRate),
        Duration: parseInt(formData.Duration),
        PenaltyRate: parseFloat(formData.PenaltyRate),
      };

      await loanProductApi.upsert(payload);
      toast.success(
        editingId ? "Loan Product updated!" : "Loan Product created!",
      );
      closeModal();
      fetchLoanProducts();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to save loan product",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setEditingId(product.id);
    setFormData({
      Name: product.name || "",
      InterestRate: product.interestRate || 0,
      Duration: product.duration || 0,
      PenaltyRate: product.penaltyRate || 0,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this loan product?")) {
      try {
        await loanProductApi.delete(id);
        toast.success("Loan Product deleted");
        fetchLoanProducts();
      } catch (error) {
        toast.error("Failed to delete loan product");
      }
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({ Name: "", InterestRate: 0, Duration: 0, PenaltyRate: 0 });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Loan Products</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          + Add Loan Product
        </button>
      </div>

      {loading && loanProducts.length === 0 ? (
        <p>Loading...</p>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Interest Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Duration (Months)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Penalty Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loanProducts.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No loan products found.
                  </td>
                </tr>
              ) : (
                loanProducts.map((product) => (
                  <tr key={product.id}>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {product.id}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {product.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {product.interestRate}%
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {product.duration}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {product.penaltyRate}%
                    </td>
                    <td className="px-6 py-4 text-sm font-medium space-x-3">
                      <button
                        onClick={() => handleEdit(product)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* MANUAL MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {editingId ? "Edit Loan Product" : "Add Loan Product"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm mb-1">Product Name</label>
                <input
                  required
                  name="Name"
                  value={formData.Name}
                  onChange={handleInputChange}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Interest Rate (%)</label>
                <input
                  required
                  type="number"
                  step="0.01"
                  name="InterestRate"
                  value={formData.InterestRate}
                  onChange={handleInputChange}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Duration (Months)</label>
                <input
                  required
                  type="number"
                  name="Duration"
                  value={formData.Duration}
                  onChange={handleInputChange}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Penalty Rate (%)</label>
                <input
                  required
                  type="number"
                  step="0.01"
                  name="PenaltyRate"
                  value={formData.PenaltyRate}
                  onChange={handleInputChange}
                  className="w-full border rounded px-3 py-2"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t mt-6">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 border rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                >
                  {loading ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoanProducts;
