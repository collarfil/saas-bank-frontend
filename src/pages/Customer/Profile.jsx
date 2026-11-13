// src/pages/Customer/Profile.jsx
import React, { useState, useEffect } from "react";
import { customerApi } from "../../api/customerApi";
import toast from "react-hot-toast";
import { UserCircleIcon } from "@heroicons/react/24/outline";

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    Id: 0,
    FirstName: "",
    LastName: "",
    Email: "",
    Phone: "",
    Gender: "",
    DOB: "",
    Password: "", // Kept blank unless they want to change it
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await customerApi.getMyProfile();
        const data = response.data;

        setFormData({
          Id: data.id,
          FirstName: data.firstName || "",
          LastName: data.lastName || "",
          Email: data.email || "",
          Phone: data.phone || "",
          Gender: data.gender || "",
          DOB: data.dob ? data.dob.split("T")[0] : "",
          Password: "", // Don't populate the password field
        });
      } catch (error) {
        toast.error("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = {
        ...formData,
        // Ensure dates are formatted correctly for the backend
        DOB: new Date(formData.DOB).toISOString(),
      };

      await customerApi.upsert(payload);
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-10 text-center text-gray-500">Loading profile...</div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        <p className="text-sm text-gray-500 mt-1">
          Update your personal information and contact details.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8">
        <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-100">
          <div className="h-16 w-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
            <UserCircleIcon className="h-10 w-10" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              {formData.FirstName} {formData.LastName}
            </h2>
            <p className="text-sm text-gray-500">Customer Account</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name
              </label>
              <input
                type="text"
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.FirstName}
                onChange={(e) =>
                  setFormData({ ...formData, FirstName: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name
              </label>
              <input
                type="text"
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.LastName}
                onChange={(e) =>
                  setFormData({ ...formData, LastName: e.target.value })
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50"
                value={formData.Email}
                onChange={(e) =>
                  setFormData({ ...formData, Email: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                type="tel"
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.Phone}
                onChange={(e) =>
                  setFormData({ ...formData, Phone: e.target.value })
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gender
              </label>
              <select
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
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
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.DOB}
                onChange={(e) =>
                  setFormData({ ...formData, DOB: e.target.value })
                }
              />
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Password{" "}
              <span className="text-gray-400 font-normal">
                (leave blank to keep current)
              </span>
            </label>
            <input
              type="password"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Enter new password"
              value={formData.Password}
              onChange={(e) =>
                setFormData({ ...formData, Password: e.target.value })
              }
            />
          </div>

          <div className="pt-6 flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 font-medium"
            >
              {submitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
