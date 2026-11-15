// src/pages/Bank/EmployeeDashboard.jsx
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  UsersIcon,
  BanknotesIcon,
  CreditCardIcon,
  DocumentTextIcon,
  ShieldCheckIcon,
  BookOpenIcon,
  CurrencyDollarIcon,
  BuildingLibraryIcon,
  ExclamationTriangleIcon,
  ChatBubbleLeftRightIcon,
  BellIcon,
  ClipboardDocumentCheckIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";

/**
 * Role-aware quick actions for bank staff.
 * TenantAdmin is redirected to TenantDashboard before reaching this page.
 * Each action declares which roles should see it — same pattern as BankLayout menu.
 */
const ALL_ACTIONS = [
  // ─── Customer-facing ───
  {
    title: "Find Customer",
    desc: "Look up customer profiles and KYC",
    icon: UsersIcon,
    path: "/bank/customers",
    color: "bg-blue-50 text-blue-600",
    roles: [
      "Teller",
      "RelationshipManager",
      "LoanOfficer",
      "CreditAnalyst",
      "BranchManager",
      "ComplianceOfficer",
    ],
  },
  {
    title: "Customer KYC",
    desc: "Verify and update customer KYC records",
    icon: ShieldCheckIcon,
    path: "/bank/customer-kyc",
    color: "bg-emerald-50 text-emerald-600",
    roles: [
      "ComplianceOfficer",
      "Teller",
      "RelationshipManager",
      "BranchManager",
    ],
  },

  // ─── Transactions & Payments ───
  {
    title: "Process Deposit",
    desc: "Deposit funds into a customer account",
    icon: BanknotesIcon,
    path: "/bank/transactions",
    color: "bg-green-50 text-green-600",
    roles: ["Teller", "LoanOpsOfficer", "SettlementOfficer", "BranchManager"],
  },
  {
    title: "Payments",
    desc: "Manage payments and settlements",
    icon: CurrencyDollarIcon,
    path: "/bank/payments",
    color: "bg-amber-50 text-amber-600",
    roles: ["TreasuryOfficer", "SettlementOfficer", "BranchManager"],
  },

  // ─── Accounts ───
  {
    title: "Manage Accounts",
    desc: "Open or view customer accounts",
    icon: CreditCardIcon,
    path: "/bank/accounts",
    color: "bg-purple-50 text-purple-600",
    roles: ["Teller", "RelationshipManager", "BranchManager"],
  },

  // ─── Loans ───
  {
    title: "Loan Applications",
    desc: "Review and process loan applications",
    icon: DocumentTextIcon,
    path: "/bank/loans",
    color: "bg-rose-50 text-rose-600",
    roles: [
      "LoanOfficer",
      "CreditAnalyst",
      "CreditRiskOfficer",
      "LoanOpsOfficer",
      "DisbursementOfficer",
      "BranchManager",
    ],
  },

  // ─── Ledger / GL / Journal ───
  {
    title: "Chart of Accounts",
    desc: "Manage general ledger accounts",
    icon: BookOpenIcon,
    path: "/bank/gl-accounts",
    color: "bg-slate-50 text-slate-600",
    roles: ["GLAccountant", "CFO", "InternalAuditor"],
  },
  {
    title: "Journal Entries",
    desc: "Post and review double-entry journals",
    icon: ClipboardDocumentCheckIcon,
    path: "/bank/journal-entries",
    color: "bg-indigo-50 text-indigo-600",
    roles: ["GLAccountant", "CFO", "InternalAuditor"],
  },
  {
    title: "Trial Balance",
    desc: "View trial balance and financial reports",
    icon: ChartBarIcon,
    path: "/bank/journal-entries", // trial balance lives on journal page
    color: "bg-teal-50 text-teal-600",
    roles: ["CFO", "InternalAuditor", "CEO"],
  },
  {
    title: "Ledger",
    desc: "Review ledger transactions",
    icon: BookOpenIcon,
    path: "/bank/ledger",
    color: "bg-slate-50 text-slate-600",
    roles: ["GLAccountant", "CFO", "InternalAuditor"],
  },

  // ─── Compliance / Risk ───
  {
    title: "Fraud Alerts",
    desc: "Investigate suspicious activity",
    icon: ExclamationTriangleIcon,
    path: "/bank/notifications",
    color: "bg-red-50 text-red-600",
    roles: ["FraudAnalyst", "ComplianceOfficer", "CRO"],
  },
  {
    title: "Notifications",
    desc: "Review system and compliance notices",
    icon: BellIcon,
    path: "/bank/notifications",
    color: "bg-yellow-50 text-yellow-600",
    roles: ["ComplianceOfficer", "FraudAnalyst", "BranchManager"],
  },

  // ─── Ops / Staff mgmt ───
  {
    title: "Branches",
    desc: "Manage bank branches",
    icon: BuildingLibraryIcon,
    path: "/bank/branches",
    color: "bg-cyan-50 text-cyan-600",
    roles: ["BranchManager", "SystemAdmin"],
  },
  {
    title: "Staff Management",
    desc: "Manage employees and roles",
    icon: UsersIcon,
    path: "/bank/employees",
    color: "bg-blue-50 text-blue-600",
    roles: ["BranchManager", "SystemAdmin"],
  },
  {
    title: "WhatsApp",
    desc: "Send customer messages",
    icon: ChatBubbleLeftRightIcon,
    path: "/bank/whatsapp",
    color: "bg-green-50 text-green-600",
    roles: ["RelationshipManager", "BranchManager"],
  },
];

const EmployeeDashboard = () => {
  const { user, hasRole } = useAuth();

  // Filter to actions the current user can perform
  const myActions = ALL_ACTIONS.filter((action) =>
    action.roles.some((r) => hasRole(r)),
  );

  // Show current role(s) at the top so staff sees why they have this dashboard
  const primaryRole = user?.roles?.[0] || "Staff";

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Welcome Banner */}
      <div className="bg-gray-900 rounded-2xl p-8 text-white shadow-lg">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">
              Welcome, {user?.firstName || "Staff"}!
            </h1>
            <p className="mt-2 text-gray-300">
              Here are the tools available to you today based on your role.
            </p>
          </div>
          <span className="shrink-0 px-3 py-1 rounded-full bg-white/10 text-xs font-medium text-white">
            {primaryRole}
          </span>
        </div>
      </div>

      {/* Quick Actions Grid */}
      {myActions.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 text-center">
          <p className="text-sm font-medium text-gray-700">
            No actions are currently assigned to your role.
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Please contact your branch manager or system administrator to review
            your access.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {myActions.map((action) => (
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
      )}
    </div>
  );
};

export default EmployeeDashboard;
