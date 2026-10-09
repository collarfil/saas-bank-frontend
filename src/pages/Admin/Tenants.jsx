// src/pages/Admin/Tenants.jsx
import React, { useState, useEffect } from "react";
import { tenantApi } from "../../api/tenantApi";
import toast from "react-hot-toast";

const Tenants = () => {
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    identifier: "",
    name: "",
    adminEmail: "",
    adminPassword: "",
  });

  useEffect(() => {
    fetchTenants();
  }, []);

  const fetchTenants = async () => {
    setLoading(true);
    try {
      const response = await tenantApi.getAll();
      const tenantsData = response.data;
      setTenants(Array.isArray(tenantsData) ? tenantsData : []);
    } catch (error) {
      toast.error("Failed to fetch tenants");
      setTenants([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTenant = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        id: 0,
        identifier: formData.identifier,
        name: formData.name,
        adminEmail: formData.adminEmail,
        adminPassword: formData.adminPassword,
      };

      console.log("Sending payload:", payload);
      const response = await tenantApi.create(payload);
      console.log("Success:", response);
      toast.success("Tenant created successfully!");
      setShowModal(false);
      setFormData({
        identifier: "",
        name: "",
        adminEmail: "",
        adminPassword: "",
      });
      fetchTenants();
    } catch (error) {
      // THIS WILL SHOW THE ACTUAL VALIDATION ERRORS
      console.error("=== FULL ERROR ===");
      console.error("Error object:", error);
      console.error("Response data:", error.response?.data);
      console.error("Validation errors:", error.response?.data?.errors);

      // Display validation errors to user
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        const errorMessages = [];
        for (const [field, messages] of Object.entries(errors)) {
          errorMessages.push(`${field}: ${messages.join(", ")}`);
        }
        toast.error(errorMessages.join("\n"));
      } else {
        toast.error(error.response?.data?.title || "Failed to create tenant");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleActivateTenant = async (id, name) => {
    try {
      await tenantApi.activate(id);
      toast.success(`Tenant "${name}" activated successfully`);
      fetchTenants();
    } catch (error) {
      toast.error("Failed to activate tenant");
    }
  };

  const handleDeactivateTenant = async (id, name) => {
    try {
      await tenantApi.deactivate(id);
      toast.success(`Tenant "${name}" deactivated successfully`);
      fetchTenants();
    } catch (error) {
      toast.error("Failed to deactivate tenant");
    }
  };

  const handleDeleteTenant = async (id) => {
    if (
      window.confirm("Delete this tenant? This will delete ALL their data!")
    ) {
      try {
        await tenantApi.delete(id);
        toast.success("Tenant deleted");
        fetchTenants();
      } catch (error) {
        toast.error("Failed to delete tenant");
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Tenants</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          + New Tenant
        </button>
      </div>

      {/* Tenants Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Identifier
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tenants.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                  No tenants found. Click "New Tenant" to create one.
                </td>
              </tr>
            ) : (
              tenants.map((tenant) => (
                <tr key={tenant.id}>
                  <td className="px-6 py-4 text-sm">{tenant.id}</td>
                  <td className="px-6 py-4 text-sm font-medium">
                    {tenant.name}
                  </td>
                  <td className="px-6 py-4 text-sm">{tenant.identifier}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                      Active
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm space-x-2">
                    <button
                      onClick={() =>
                        handleActivateTenant(tenant.id, tenant.name)
                      }
                      className="text-green-600 hover:text-green-900"
                      disabled={tenant.isActive === true}
                    >
                      Activate
                    </button>
                    <button
                      onClick={() =>
                        handleDeactivateTenant(tenant.id, tenant.name)
                      }
                      className="text-yellow-600 hover:text-yellow-900"
                      disabled={tenant.isActive === false}
                    >
                      Deactivate
                    </button>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <button
                      onClick={() => handleDeleteTenant(tenant.id)}
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

      {/* Create Tenant Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Create New Tenant</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <form onSubmit={handleCreateTenant} className="space-y-4">
              <div className="border-b pb-4">
                <h3 className="font-semibold text-lg mb-3 text-gray-700">
                  Tenant Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Identifier"
                    className="border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                    value={formData.identifier}
                    onChange={(e) =>
                      setFormData({ ...formData, identifier: e.target.value })
                    }
                  />
                  <input
                    type="text"
                    placeholder="Bank Name *"
                    className="border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />

                  <input
                    type="tel"
                    placeholder="Email"
                    className="border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                    value={formData.adminEmail}
                    onChange={(e) =>
                      setFormData({ ...formData, adminEmail: e.target.value })
                    }
                  />
                  <input
                    placeholder="Password"
                    className="border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                    value={formData.adminPassword}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        adminPassword: e.target.value,
                      })
                    }
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Password must be at least 6 characters
                  </p>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {isSubmitting ? "Creating..." : "Create Tenant"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tenants;
