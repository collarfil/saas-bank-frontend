import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { employeeApi } from "../../api/employeeApi";
import { departmentApi } from "../../api/departmentApi";

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // State matches your EmployeeDto exactly
  const [formData, setFormData] = useState({
    FirstName: "",
    LastName: "",
    Email: "",
    Password: "",
    Gender: "Male",
    DOB: "",
    StaffNumber: "",
    DepartmentId: "",
    Position: "",
    Role: "Teller",
  });

  useEffect(() => {
    fetchEmployees();
    fetchDepartments();
  }, []);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const response = await employeeApi.getAll();
      setEmployees(response.data);
    } catch (error) {
      toast.error("Failed to load employees. Check your backend.");
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await departmentApi.getAll();
      setDepartments(response.data);
    } catch (error) {
      console.error("Failed to load departments");
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Convert data to match EmployeeDto types exactly
      const payload = {
        Id: editingId || 0,
        FirstName: formData.FirstName,
        LastName: formData.LastName,
        Email: formData.Email,
        Password: formData.Password,
        Gender: formData.Gender,
        DOB: new Date(formData.DOB).toISOString(),
        StaffNumber: formData.StaffNumber,
        DepartmentId: parseInt(formData.DepartmentId),
        Position: formData.Position,
        Role: formData.Role,
      };

      await employeeApi.upsert(payload);
      toast.success(editingId ? "Employee updated!" : "Employee created!");
      closeModal();
      fetchEmployees();
    } catch (error) {
      // This will print the exact C# error to your screen if it fails
      toast.error(
        error.response?.data?.message ||
          error.response?.data ||
          "Failed to save employee",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (emp) => {
    setEditingId(emp.id);
    setFormData({
      FirstName: emp.firstName || "",
      LastName: emp.lastName || "",
      Email: emp.email || "",
      Password: "", // Leave blank for edits
      Gender: emp.gender || "Male",
      DOB: emp.dob ? emp.dob.split("T")[0] : "",
      StaffNumber: emp.staffNumber || "",
      DepartmentId: emp.departmentId || "",
      Position: emp.position || "",
      Role: emp.role || "Teller",
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      try {
        await employeeApi.delete(id);
        toast.success("Employee deleted");
        fetchEmployees();
      } catch (error) {
        toast.error("Failed to delete employee");
      }
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({
      FirstName: "",
      LastName: "",
      Email: "",
      Password: "",
      Gender: "Male",
      DOB: "",
      StaffNumber: "",
      DepartmentId: "",
      Position: "",
      Role: "Teller",
    });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Employees</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          + Add Employee
        </button>
      </div>

      {loading && employees.length === 0 ? (
        <p>Loading...</p>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Staff No.
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {employees.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No employees found.
                  </td>
                </tr>
              ) : (
                employees.map((emp) => (
                  <tr key={emp.id}>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {emp.staffNumber}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {emp.firstName} {emp.lastName}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {emp.email}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {emp.role || "—"}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium space-x-3">
                      <button
                        onClick={() => handleEdit(emp)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(emp.id)}
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
      )}

      {/* MANUAL MODAL (No external component dependencies to prevent crashes) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {editingId ? "Edit Employee" : "Add Employee"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1">First Name</label>
                  <input
                    required
                    name="FirstName"
                    value={formData.FirstName}
                    onChange={handleInputChange}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Last Name</label>
                  <input
                    required
                    name="LastName"
                    value={formData.LastName}
                    onChange={handleInputChange}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1">Email</label>
                  <input
                    required
                    type="email"
                    name="Email"
                    value={formData.Email}
                    onChange={handleInputChange}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">
                    Password {editingId && "(Leave blank to keep current)"}
                  </label>
                  <input
                    required={!editingId}
                    type="password"
                    name="Password"
                    value={formData.Password}
                    onChange={handleInputChange}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1">Staff Number</label>
                  <input
                    required
                    name="StaffNumber"
                    value={formData.StaffNumber}
                    onChange={handleInputChange}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Department</label>
                  <select
                    required
                    name="DepartmentId"
                    value={formData.DepartmentId}
                    onChange={handleInputChange}
                    className="w-full border rounded px-3 py-2"
                  >
                    <option value="">Select Department</option>
                    {departments.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1">Position</label>
                  <input
                    required
                    name="Position"
                    value={formData.Position}
                    onChange={handleInputChange}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Role</label>
                  <select
                    required
                    name="Role"
                    value={formData.Role}
                    onChange={handleInputChange}
                    className="w-full border rounded px-3 py-2"
                  >
                    <optgroup label="Core">
                      <option value="TenantAdmin">Tenant Admin</option>
                      <option value="BranchManager">Branch Manager</option>
                      <option value="Teller">Teller</option>
                      <option value="LoanOfficer">Loan Officer</option>
                    </optgroup>

                    <optgroup label="Executive / Governance">
                      <option value="CEO">CEO</option>
                      <option value="CFO">CFO</option>
                      <option value="CRO">CRO</option>
                      <option value="CCO">CCO</option>
                      <option value="CTO">CTO</option>
                    </optgroup>

                    <optgroup label="Front Office">
                      <option value="RelationshipManager">
                        Relationship Manager
                      </option>
                      <option value="CreditAnalyst">Credit Analyst</option>
                      <option value="InvestmentAdvisor">
                        Investment Advisor
                      </option>
                    </optgroup>

                    <optgroup label="Middle Office">
                      <option value="CreditRiskOfficer">
                        Credit Risk Officer
                      </option>
                      <option value="TreasuryOfficer">Treasury Officer</option>
                      <option value="ComplianceOfficer">
                        Compliance Officer
                      </option>
                      <option value="FraudAnalyst">Fraud Analyst</option>
                    </optgroup>

                    <optgroup label="Back Office">
                      <option value="GLAccountant">GL Accountant</option>
                      <option value="LoanOpsOfficer">
                        Loan Operations Officer
                      </option>
                      <option value="SettlementOfficer">
                        Settlement Officer
                      </option>
                      <option value="DisbursementOfficer">
                        Disbursement Officer
                      </option>
                      <option value="SystemAdmin">System Administrator</option>
                      <option value="InternalAuditor">Internal Auditor</option>
                    </optgroup>

                    <optgroup label="Legacy">
                      <option value="Staff">Staff</option>
                      <option value="Employee">Employee</option>
                      <option value="Jr Staff">Jr Staff</option>
                    </optgroup>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1">Gender</label>
                  <select
                    name="Gender"
                    value={formData.Gender}
                    onChange={handleInputChange}
                    className="w-full border rounded px-3 py-2"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm mb-1">Date of Birth</label>
                  <input
                    required
                    type="date"
                    name="DOB"
                    value={formData.DOB}
                    onChange={handleInputChange}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t mt-6">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 border rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                >
                  {loading ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Employees;
