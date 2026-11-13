// src/pages/Admin/Reports.jsx
import React, { useState, useEffect } from "react";
import { tenantApi } from "../../api/tenantApi";
import toast from "react-hot-toast";
import {
  ChartBarIcon,
  DocumentArrowDownIcon,
} from "@heroicons/react/24/outline";

const Reports = () => {
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTenants = async () => {
      try {
        const response = await tenantApi.getAll();
        setTenants(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        toast.error("Failed to load tenants for reporting.");
      } finally {
        setLoading(false);
      }
    };
    fetchTenants();
  }, []);

  const handleExport = () => {
    toast.success("Report export functionality coming soon!");
  };

  if (loading) {
    return (
      <div className="p-10 text-center text-gray-500">Loading reports...</div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">System Reports</h1>
          <p className="text-sm text-gray-500 mt-1">
            Overview of all registered tenants on the platform.
          </p>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition"
        >
          <DocumentArrowDownIcon className="h-5 w-5" />
          Export CSV
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center gap-4">
          <div className="bg-blue-50 p-4 rounded-full text-blue-600">
            <ChartBarIcon className="h-8 w-8" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Tenants</p>
            <h2 className="text-2xl font-bold text-gray-900">
              {tenants.length}
            </h2>
          </div>
        </div>
        {/* You can add more metric cards here once you have aggregate backend endpoints */}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">
            Tenant Database Status
          </h2>
        </div>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Tenant Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Identifier
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Database Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tenants.map((tenant) => (
              <tr key={tenant.id}>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {tenant.name}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {tenant.identifier}
                </td>
                <td className="px-6 py-4">
                  <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Connected
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Reports;
