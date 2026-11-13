// src/pages/Auth/Login.jsx
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const { tenant } = useParams();
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    setLoading(true);

    try {
      const result = await login(
        formData.email.trim(),
        formData.password,
        tenant || null,
      );

      const roles = result.roles || [];

      let destination = null;

      if (roles.includes("SuperAdmin")) {
        destination = "/admin";
      } else if (roles.includes("Customer")) {
        destination = "/dashboard";
      } else if (roles.length > 0) {
        // Catch-all: Any other role (TenantAdmin, Teller, Staff, Employee, etc.)
        // belongs to the Bank Portal.
        destination = "/bank";
      }

      if (!destination) {
        throw new Error(
          "Your account does not have an authorized application role.",
        );
      }

      toast.success(`Welcome back, ${result.user.firstName || "User"}!`);

      navigate(destination, { replace: true });
    } catch (error) {
      console.error("Login error:", error);

      toast.error(
        error.response?.data?.message ||
          error.response?.data?.error ||
          error.message ||
          "Login failed. Please check your credentials.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 px-4">
      <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-2xl w-full max-w-md border border-white/20">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🏦</span>
          </div>

          <h1 className="text-2xl font-bold text-white">SaaS Micro Finance</h1>

          <p className="text-gray-300 mt-1">Access your banking portal</p>

          {tenant && (
            <p className="text-blue-300 text-sm mt-3">Tenant: {tenant}</p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">
              Email Address
            </label>

            <input
              type="email"
              required
              autoComplete="username"
              className="w-full border border-gray-600 bg-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  email: e.target.value,
                })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">
              Password
            </label>

            <input
              type="password"
              required
              autoComplete="current-password"
              className="w-full border border-gray-600 bg-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Enter your password"
              value={formData.password}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  password: e.target.value,
                })
              }
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2.5 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition disabled:opacity-50"
          >
            {loading ? "Authenticating..." : "Sign In"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-400 text-sm">Secure banking access</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
