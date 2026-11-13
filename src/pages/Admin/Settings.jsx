// src/pages/Admin/Settings.jsx
import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import { UserCircleIcon, ServerIcon } from "@heroicons/react/24/outline";

const Settings = () => {
  const { user } = useAuth();

  const [systemSettings, setSystemSettings] = useState({
    allowTenantRegistration: true,
    maintenanceMode: false,
    defaultCurrency: "NGN",
  });

  const handleSave = (e) => {
    e.preventDefault();
    toast.success("System settings saved successfully!");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">System Settings</h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage your profile and platform-wide configurations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Admin Profile */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <UserCircleIcon className="h-5 w-5 text-gray-500" />
            Admin Profile
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                disabled
                className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 text-gray-500"
                value={`${user?.firstName || ""} ${user?.lastName || ""}`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                disabled
                className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 text-gray-500"
                value={user?.email || ""}
              />
            </div>
          </div>
        </div>

        {/* System Config */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <ServerIcon className="h-5 w-5 text-gray-500" />
            Platform Configuration
          </h2>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Allow Tenant Registration
                </p>
                <p className="text-xs text-gray-500">
                  Allow new banks to sign up
                </p>
              </div>
              <input
                type="checkbox"
                className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                checked={systemSettings.allowTenantRegistration}
                onChange={(e) =>
                  setSystemSettings({
                    ...systemSettings,
                    allowTenantRegistration: e.target.checked,
                  })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Maintenance Mode
                </p>
                <p className="text-xs text-gray-500">
                  Temporarily disable all tenant portals
                </p>
              </div>
              <input
                type="checkbox"
                className="h-5 w-5 text-red-600 rounded focus:ring-red-500"
                checked={systemSettings.maintenanceMode}
                onChange={(e) =>
                  setSystemSettings({
                    ...systemSettings,
                    maintenanceMode: e.target.checked,
                  })
                }
              />
            </div>

            <div className="pt-4 border-t border-gray-100">
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-medium"
              >
                Save Settings
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Settings;
