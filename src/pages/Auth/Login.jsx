// src/pages/Auth/Login.jsx
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios";
import toast from "react-hot-toast";

const Login = () => {
  const { tenant } = useParams();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post("/auth/login", {
        email: formData.email,
        password: formData.password,
      });

      // Debug: See what backend returns
      console.log("Login response:", response.data);

      // Correct extraction based on your backend response
      const { token, user, tenant } = response.data;

      // Debug: Check user roles
      console.log("User roles from backend:", user.roles);

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // Store tenant identifier for Finbuckle MultiTenant
      if (tenant?.identifier) {
        localStorage.setItem("tenantId", tenant.identifier);
      } else {
        localStorage.removeItem("tenantId");
      }

      toast.success(`Welcome back, ${user.firstName}!`);

      // Navigate based on roles ARRAY
      const roles = user.roles || [];

      if (roles.includes("SuperAdmin")) {
        console.log("Navigating to /admin");
        navigate("/admin");
      } else if (
        roles.includes("TenantAdmin") ||
        roles.includes("BranchManager")
      ) {
        console.log("Navigating to /bank");
        navigate("/bank");
      } else {
        console.log("Navigating to /dashboard");
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-2xl w-full max-w-md border border-white/20">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🏦</span>
          </div>
          <h1 className="text-2xl font-bold text-white">SaaS Micro Finance</h1>
          <p className="text-gray-300 mt-1">Access your banking portal</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              className="w-full border border-gray-600 bg-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="admin@saasbank.com"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
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
              className="w-full border border-gray-600 bg-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
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
          <p className="text-gray-400 text-sm">
            Demo: admin@saasbank.com / Admin@123456
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
