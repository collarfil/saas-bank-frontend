import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { tenantApi } from "../../api/tenantApi";

const AdminDashboard = () => {
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTenants();
  }, []);

  const fetchTenants = async () => {
    setLoading(true);
    try {
      const response = await tenantApi.getAll();
      // Handle if response is an array or has a .data property
      const data = Array.isArray(response.data)
        ? response.data
        : response.data?.data || [];
      setTenants(data);
    } catch (error) {
      toast.error("Failed to load tenants");
    } finally {
      setLoading(false);
    }
  };

  const activeTenants = tenants.filter((t) => t.isActive).length;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Super Admin Dashboard
        </h1>
        <p className="text-gray-500 mt-1">
          Overview of all registered tenants on the platform.
        </p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <p className="text-sm font-medium text-gray-500">Total Tenants</p>
          <h3 className="text-3xl font-bold text-gray-900 mt-2">
            {loading ? "..." : tenants.length}
          </h3>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <p className="text-sm font-medium text-gray-500">Active Tenants</p>
          <h3 className="text-3xl font-bold text-green-600 mt-2">
            {loading ? "..." : activeTenants}
          </h3>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <p className="text-sm font-medium text-gray-500">Inactive Tenants</p>
          <h3 className="text-3xl font-bold text-amber-600 mt-2">
            {loading ? "..." : tenants.length - activeTenants}
          </h3>
        </div>
      </div>

      {/* Recent Tenants Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Registered Tenants</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Identifier
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Connection
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {tenants.length === 0 ? (
                <tr>
                  <td
                    colSpan="4"
                    className="px-4 py-6 text-center text-gray-500"
                  >
                    No tenants found.
                  </td>
                </tr>
              ) : (
                tenants.map((tenant) => (
                  <tr key={tenant.id}>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      {tenant.identifier}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {tenant.name}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${tenant.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                      >
                        {tenant.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500 truncate max-w-xs">
                      {tenant.connectionString?.substring(0, 30)}...
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
