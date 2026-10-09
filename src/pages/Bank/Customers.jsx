// src/pages/Bank/Customers.jsx
import React, { useState, useEffect } from "react";
import DataTable from "../../components/DataTable";
import Modal from "../../components/Modal";
import { customerApi } from "../../api/customerApi";
import toast from "react-hot-toast";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    FirstName: "",
    LastName: "",
    Gender: "",
    DOB: "",
    Email: "",
    Phone: "",
    Password: "",
  });

  const tenantId = localStorage.getItem("tenantId");

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const response = await customerApi.getAll();
      // Filter by tenant if needed
      const filteredCustomers = tenantId
        ? response.data.filter((c) => c.tenantId == tenantId)
        : response.data;
      setCustomers(filteredCustomers);
    } catch (error) {
      toast.error("Failed to fetch customers");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const customerData = {
        Id: editingCustomer?.id || 0,
        TenantId: parseInt(tenantId),
        ...formData,
        Created_At: new Date().toISOString(),
      };

      if (editingCustomer) {
        await customerApi.upsert(customerData);
        toast.success("Customer updated successfully");
      } else {
        await customerApi.upsert(customerData);
        toast.success("Customer created successfully");
      }
      fetchCustomers();
      closeModal();
    } catch (error) {
      toast.error(error.response?.data?.message || "Operation failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (customer) => {
    setEditingCustomer(customer);
    setFormData({
      FirstName: customer.firstName || "",
      LastName: customer.lastName || "",
      Gender: customer.gender || "",
      DOB: customer.dob ? customer.dob.split("T")[0] : "",
      Email: customer.email || "",
      Phone: customer.phone || "",
      Password: customer.Password || "",
    });
    setModalOpen(true);
  };

  const handleDelete = async (customer) => {
    if (
      window.confirm(
        `Are you sure you want to delete customer "${customer.firstName} ${customer.lastName}"?`,
      )
    ) {
      try {
        await customerApi.delete(customer.id);
        toast.success("Customer deleted successfully");
        fetchCustomers();
      } catch (error) {
        toast.error("Failed to delete customer");
      }
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingCustomer(null);
    setFormData({
      FirstName: "",
      LastName: "",
      Gender: "",
      DOB: "",
      Email: "",
      Phone: "",
      Password: "",
    });
  };

  const columns = [
    { key: "id", label: "ID", sortable: true },
    { key: "firstName", label: "First Name", sortable: true },
    { key: "lastName", label: "Last Name", sortable: true },
    { key: "gender", label: "Gender" },
    {
      key: "dob",
      label: "Date of Birth",
      format: (value) => (value ? new Date(value).toLocaleDateString() : "N/A"),
    },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "password", label: "password" },
    {
      key: "status",
      label: "Status",
      format: (value) => (
        <span
          className={`px-2 py-1 rounded-full text-xs ${
            value === "Active"
              ? "bg-green-100 text-green-800"
              : value === "Inactive"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-red-100 text-red-800"
          }`}
        >
          {value || "Active"}
        </span>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Customers</h1>
        <button
          onClick={() => setModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition flex items-center gap-2"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Add Customer
        </button>
      </div>

      <DataTable
        columns={columns}
        data={customers}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Modal
        isOpen={modalOpen}
        onClose={closeModal}
        title={editingCustomer ? "Edit Customer" : "Add New Customer"}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.FirstName}
                onChange={(e) =>
                  setFormData({ ...formData, FirstName: e.target.value })
                }
                placeholder="Enter first name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.LastName}
                onChange={(e) =>
                  setFormData({ ...formData, LastName: e.target.value })
                }
                placeholder="Enter last name"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gender
              </label>
              <select
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.Gender}
                onChange={(e) =>
                  setFormData({ ...formData, Gender: e.target.value })
                }
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date of Birth
              </label>
              <input
                type="date"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.DOB}
                onChange={(e) =>
                  setFormData({ ...formData, DOB: e.target.value })
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.Email}
                onChange={(e) =>
                  setFormData({ ...formData, Email: e.target.value })
                }
                placeholder="customer@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password <span className="text-red-500">*</span>
              </label>

              <input
                type="password"
                required={!editingCustomer}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.Password}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    Password: e.target.value,
                  })
                }
                placeholder="Enter customer password"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.Phone}
                onChange={(e) =>
                  setFormData({ ...formData, Phone: e.target.value })
                }
                placeholder="Enter phone number"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              {isSubmitting
                ? "Processing..."
                : editingCustomer
                  ? "Update"
                  : "Create"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Customers;
