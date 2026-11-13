import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { customerApi } from "../../api/customerApi";
import api from "../../api/axios";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    FirstName: "",
    LastName: "",
    Email: "",
    Phone: "",
    Gender: "Male",
    DOB: "",
    Password: "",
  });

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const response = await customerApi.getAll();
      const data = Array.isArray(response.data) ? response.data : [];
      setCustomers(data);
    } catch (error) {
      toast.error("Failed to load customers.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await customerApi.upsert({
        Id: editingId || 0,
        FirstName: formData.FirstName,
        LastName: formData.LastName,
        Email: formData.Email,
        Phone: formData.Phone,
        Gender: formData.Gender,
        DOB: new Date(formData.DOB).toISOString(),
        Password: formData.Password || null,
        Created_At: new Date().toISOString(),
      });
      toast.success(editingId ? "Customer updated" : "Customer created");
      fetchCustomers();
      closeModal();
    } catch (error) {
      toast.error(error.response?.data?.message || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateLogin = async (customer) => {
    const password = window.prompt(
      `Enter a password for ${customer.firstName}'s login:`,
    );
    if (!password) return;

    try {
      await api.post(`/customer/${customer.id}/create-login`, { password });
      toast.success("Login account created! Customer can now log in.");
      fetchCustomers();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create login");
    }
  };

  const handleEdit = (customer) => {
    setEditingId(customer.id);
    setFormData({
      FirstName: customer.firstName || "",
      LastName: customer.lastName || "",
      Email: customer.email || "",
      Phone: customer.phone || "",
      Gender: customer.gender || "Male",
      DOB: customer.dob ? customer.dob.split("T")[0] : "",
      Password: "",
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      try {
        await customerApi.delete(id);
        toast.success("Customer deleted");
        fetchCustomers();
      } catch (error) {
        toast.error("Failed to delete customer");
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
      Phone: "",
      Gender: "Male",
      DOB: "",
      Password: "",
    });
  };

  return (
    <div style={{ padding: "20px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "20px",
        }}
      >
        <h1 style={{ fontSize: "24px", fontWeight: "bold" }}>Customers</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          style={{
            background: "#2563eb",
            color: "white",
            padding: "8px 16px",
            borderRadius: "6px",
            border: "none",
            cursor: "pointer",
          }}
        >
          + Add Customer
        </button>
      </div>

      {loading ? (
        <p>Loading customers...</p>
      ) : (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            background: "white",
            borderRadius: "8px",
            overflow: "hidden",
          }}
        >
          <thead style={{ background: "#f3f4f6", textAlign: "left" }}>
            <tr>
              <th
                style={{ padding: "12px", borderBottom: "1px solid #e5e7eb" }}
              >
                Name
              </th>
              <th
                style={{ padding: "12px", borderBottom: "1px solid #e5e7eb" }}
              >
                Email
              </th>
              <th
                style={{ padding: "12px", borderBottom: "1px solid #e5e7eb" }}
              >
                Login Status
              </th>
              <th
                style={{ padding: "12px", borderBottom: "1px solid #e5e7eb" }}
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {customers.length === 0 ? (
              <tr>
                <td
                  colSpan="4"
                  style={{
                    padding: "20px",
                    textAlign: "center",
                    color: "#6b7280",
                  }}
                >
                  No customers found.
                </td>
              </tr>
            ) : (
              customers.map((c) => (
                <tr key={c.id} style={{ borderBottom: "1px solid #e5e7eb" }}>
                  <td style={{ padding: "12px" }}>
                    {c.firstName} {c.lastName}
                  </td>
                  <td style={{ padding: "12px" }}>{c.email}</td>
                  <td style={{ padding: "12px" }}>
                    {c.applicationUserId ? (
                      <span style={{ color: "#16a34a", fontWeight: "bold" }}>
                        Active
                      </span>
                    ) : (
                      <span style={{ color: "#dc2626", fontWeight: "bold" }}>
                        No Login
                      </span>
                    )}
                  </td>
                  <td style={{ padding: "12px" }}>
                    {!c.applicationUserId && (
                      <button
                        onClick={() => handleCreateLogin(c)}
                        style={{
                          background: "#2563eb",
                          color: "white",
                          padding: "4px 8px",
                          borderRadius: "4px",
                          border: "none",
                          cursor: "pointer",
                          marginRight: "10px",
                        }}
                      >
                        Create Login
                      </button>
                    )}
                    <button
                      onClick={() => handleEdit(c)}
                      style={{
                        color: "#2563eb",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        marginRight: "10px",
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(c.id)}
                      style={{
                        color: "#dc2626",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}

      {/* Modal for Creating/Editing Customer */}
      {isModalOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 50,
          }}
        >
          <div
            style={{
              background: "white",
              padding: "24px",
              borderRadius: "8px",
              width: "100%",
              maxWidth: "500px",
            }}
          >
            <h2
              style={{
                fontSize: "20px",
                fontWeight: "bold",
                marginBottom: "16px",
              }}
            >
              {editingId ? "Edit Customer" : "Add Customer"}
            </h2>
            <form
              onSubmit={handleSubmit}
              style={{ display: "flex", flexDirection: "column", gap: "12px" }}
            >
              <div style={{ display: "flex", gap: "12px" }}>
                <div style={{ flex: 1 }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: "14px",
                      marginBottom: "4px",
                    }}
                  >
                    First Name
                  </label>
                  <input
                    required
                    value={formData.FirstName}
                    onChange={(e) =>
                      setFormData({ ...formData, FirstName: e.target.value })
                    }
                    style={{
                      width: "100%",
                      padding: "8px",
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                    }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: "14px",
                      marginBottom: "4px",
                    }}
                  >
                    Last Name
                  </label>
                  <input
                    required
                    value={formData.LastName}
                    onChange={(e) =>
                      setFormData({ ...formData, LastName: e.target.value })
                    }
                    style={{
                      width: "100%",
                      padding: "8px",
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                    }}
                  />
                </div>
              </div>
              <div style={{ display: "flex", gap: "12px" }}>
                <div style={{ flex: 1 }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: "14px",
                      marginBottom: "4px",
                    }}
                  >
                    Email
                  </label>
                  <input
                    required
                    type="email"
                    value={formData.Email}
                    onChange={(e) =>
                      setFormData({ ...formData, Email: e.target.value })
                    }
                    style={{
                      width: "100%",
                      padding: "8px",
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                    }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: "14px",
                      marginBottom: "4px",
                    }}
                  >
                    Phone
                  </label>
                  <input
                    required
                    value={formData.Phone}
                    onChange={(e) =>
                      setFormData({ ...formData, Phone: e.target.value })
                    }
                    style={{
                      width: "100%",
                      padding: "8px",
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                    }}
                  />
                </div>
              </div>
              <div style={{ display: "flex", gap: "12px" }}>
                <div style={{ flex: 1 }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: "14px",
                      marginBottom: "4px",
                    }}
                  >
                    Gender
                  </label>
                  <select
                    value={formData.Gender}
                    onChange={(e) =>
                      setFormData({ ...formData, Gender: e.target.value })
                    }
                    style={{
                      width: "100%",
                      padding: "8px",
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                    }}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: "14px",
                      marginBottom: "4px",
                    }}
                  >
                    Date of Birth
                  </label>
                  <input
                    required
                    type="date"
                    value={formData.DOB}
                    onChange={(e) =>
                      setFormData({ ...formData, DOB: e.target.value })
                    }
                    style={{
                      width: "100%",
                      padding: "8px",
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                    }}
                  />
                </div>
              </div>
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "14px",
                    marginBottom: "4px",
                  }}
                >
                  Password {editingId && "(Leave blank)"}
                </label>
                <input
                  required={!editingId}
                  type="password"
                  value={formData.Password}
                  onChange={(e) =>
                    setFormData({ ...formData, Password: e.target.value })
                  }
                  style={{
                    width: "100%",
                    padding: "8px",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                  }}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "10px",
                  marginTop: "10px",
                }}
              >
                <button
                  type="button"
                  onClick={closeModal}
                  style={{
                    padding: "8px 16px",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    background: "white",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    padding: "8px 16px",
                    background: "#2563eb",
                    color: "white",
                    borderRadius: "4px",
                    border: "none",
                    cursor: "pointer",
                  }}
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

export default Customers;
