import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { customerApi } from "../../api/customerApi";
import { accountApi } from "../../api/accountApi";
import { customerKYCApi } from "../../api/customerKYCApi";
import { Link } from "react-router-dom";
import {
  UserCircleIcon,
  BanknotesIcon,
  ShieldCheckIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";

const CustomerDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [kycStatus, setKycStatus] = useState("Loading...");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        // 1. Fetch Profile
        const profileRes = await customerApi.getMyProfile();
        const customerData = profileRes.data;
        setProfile(customerData);

        // 2. Fetch Accounts (and filter for this customer)
        const accountsRes = await accountApi.getAll();
        const allAccounts = Array.isArray(accountsRes.data)
          ? accountsRes.data
          : [];
        const myAccounts = allAccounts.filter(
          (a) => a.customerId === customerData.id,
        );
        setAccounts(myAccounts);

        // 3. Fetch KYC
        const kycRes = await customerKYCApi.getAll();
        const allKyc = Array.isArray(kycRes.data) ? kycRes.data : [];
        const myKyc = allKyc.find((k) => k.customerId === customerData.id);

        if (!myKyc) {
          setKycStatus("Not Submitted");
        } else if (myKyc.nin && myKyc.bvn) {
          setKycStatus("Verified");
        } else {
          setKycStatus("Incomplete");
        }
      } catch (error) {
        toast.error("Failed to load your dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const formatCurrency = (val) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(val || 0);

  if (loading) {
    return (
      <div className="p-10 text-center text-gray-500">
        Loading your dashboard...
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="p-10 text-center text-red-500">
        Profile not found. Please contact the bank.
      </div>
    );
  }

  const totalBalance = accounts.reduce(
    (sum, acc) => sum + (acc.balance || 0),
    0,
  );

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Welcome Banner */}
      <div className="bg-blue-600 rounded-2xl p-8 text-white shadow-lg flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">
            Welcome back, {profile.firstName}!
          </h1>
          <p className="mt-2 text-blue-100">
            Here is a summary of your banking profile.
          </p>
        </div>
        <UserCircleIcon className="h-20 w-20 text-blue-300 opacity-50 hidden sm:block" />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Balance */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center gap-4">
          <div className="bg-green-50 p-4 rounded-full text-green-600">
            <BanknotesIcon className="h-8 w-8" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Balance</p>
            <h2 className="text-2xl font-bold text-gray-900">
              {formatCurrency(totalBalance)}
            </h2>
          </div>
        </div>

        {/* Accounts Count */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center gap-4">
          <div className="bg-purple-50 p-4 rounded-full text-purple-600">
            <BanknotesIcon className="h-8 w-8" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Active Accounts</p>
            <h2 className="text-2xl font-bold text-gray-900">
              {accounts.length}
            </h2>
          </div>
        </div>

        {/* KYC Status */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center gap-4">
          <div
            className={`p-4 rounded-full ${kycStatus === "Verified" ? "bg-green-50 text-green-600" : "bg-amber-50 text-amber-600"}`}
          >
            <ShieldCheckIcon className="h-8 w-8" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">KYC Status</p>
            <h2
              className={`text-2xl font-bold ${kycStatus === "Verified" ? "text-green-600" : "text-amber-600"}`}
            >
              {kycStatus}
            </h2>
          </div>
        </div>
      </div>

      {/* My Accounts Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-900">My Accounts</h2>
          <Link
            to="/dashboard/my-accounts"
            className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1 font-medium"
          >
            View All <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>

        {accounts.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            You do not have any active accounts yet.
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Account Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Balance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {accounts.map((acc) => (
                <tr key={acc.id}>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {acc.account_Number}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {acc.account_TypeId}
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-green-600">
                    {formatCurrency(acc.balance)}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                      {acc.status === 1 ? "Active" : "Inactive"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          to="/dashboard/transactions"
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:border-blue-300 hover:shadow-md transition group"
        >
          <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600">
            View Transactions
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            See your recent account statements and activity.
          </p>
        </Link>
        <Link
          to="/dashboard/profile"
          className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:border-blue-300 hover:shadow-md transition group"
        >
          <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600">
            Update Profile
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Keep your contact information and KYC up to date.
          </p>
        </Link>
      </div>
    </div>
  );
};

export default CustomerDashboard;
