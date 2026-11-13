import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  UsersIcon,
  BanknotesIcon,
  CreditCardIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";

const EmployeeDashboard = () => {
  const { user } = useAuth();

  const quickActions = [
    {
      title: "Find Customer",
      desc: "Look up customer profiles and KYC",
      icon: UsersIcon,
      path: "/bank/customers",
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: "Process Deposit",
      desc: "Deposit funds into an account",
      icon: BanknotesIcon,
      path: "/bank/transactions",
      color: "bg-green-50 text-green-600",
    },
    {
      title: "Manage Accounts",
      desc: "Open or view customer accounts",
      icon: CreditCardIcon,
      path: "/bank/accounts",
      color: "bg-purple-50 text-purple-600",
    },
    {
      title: "Loan Applications",
      desc: "Review and apply for loans",
      icon: DocumentTextIcon,
      path: "/bank/loans",
      color: "bg-amber-50 text-amber-600",
    },
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Welcome Banner */}
      <div className="bg-gray-900 rounded-2xl p-8 text-white shadow-lg">
        <h1 className="text-3xl font-bold">
          Welcome, {user?.firstName || "Staff"}!
        </h1>
        <p className="mt-2 text-gray-300">
          Here are your operational tools for today. What would you like to do?
        </p>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {quickActions.map((action) => (
          <Link
            key={action.title}
            to={action.path}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-start gap-4 hover:shadow-md transition group"
          >
            <div className={`p-4 rounded-lg ${action.color}`}>
              <action.icon className="h-8 w-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition">
                {action.title}
              </h3>
              <p className="text-sm text-gray-500 mt-1">{action.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default EmployeeDashboard;
