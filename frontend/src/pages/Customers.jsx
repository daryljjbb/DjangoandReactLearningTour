import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const access = localStorage.getItem("access_token");

  // Fetch customers
  const fetchCustomers = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/customers/", {
        headers: { Authorization: `Bearer ${access}` },
      });

      const data = await response.json();
      setCustomers(data);
    } catch (error) {
      toast.error("Failed to load customers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // Handle Add Customer
  const handleAddCustomer = async () => {
    toast.loading("Adding customer...", { id: "addCustomer" });

    try {
      const response = await fetch("http://127.0.0.1:8000/api/customers/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        toast.error("Failed to add customer", { id: "addCustomer" });
        return;
      }

      toast.success("Customer added!", { id: "addCustomer" });
      setShowAddModal(false);
      setFormData({ name: "", email: "", phone: "" });
      fetchCustomers();
    } catch (error) {
      toast.error("Error adding customer", { id: "addCustomer" });
    }
  };

  // Handle Edit Customer
  const handleEditCustomer = async () => {
    toast.loading("Updating customer...", { id: "editCustomer" });

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/customers/${selectedCustomer.id}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        toast.error("Failed to update customer", { id: "editCustomer" });
        return;
      }

      toast.success("Customer updated!", { id: "editCustomer" });
      setShowEditModal(false);
      fetchCustomers();
    } catch (error) {
      toast.error("Error updating customer", { id: "editCustomer" });
    }
  };

  // Handle Delete Customer
  const handleDeleteCustomer = async () => {
    toast.loading("Deleting customer...", { id: "deleteCustomer" });

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/customers/${selectedCustomer.id}/`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${access}` },
        }
      );

      if (!response.ok) {
        toast.error("Failed to delete customer", { id: "deleteCustomer" });
        return;
      }

      toast.success("Customer deleted", { id: "deleteCustomer" });
      setShowDeleteModal(false);
      fetchCustomers();
    } catch (error) {
      toast.error("Error deleting customer", { id: "deleteCustomer" });
    }
  };

  if (loading) return <p>Loading customers...</p>;

  return (
    <div>
      <h2 className="mb-3">Customers</h2>

      <button
        className="btn btn-primary mb-3"
        onClick={() => setShowAddModal(true)}
      >
        Add Customer
      </button>

      {/* Customer Table */}
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {customers.map((c) => (
            <tr key={c.id}>
              <td>{c.name}</td>
              <td>{c.email}</td>
              <td>{c.phone}</td>
              <td>
                <button
                  className="btn btn-sm btn-warning me-2"
                  onClick={() => {
                    setSelectedCustomer(c);
                    setFormData({
                      name: c.name,
                      email: c.email,
                      phone: c.phone,
                    });
                    setShowEditModal(true);
                  }}
                >
                  Edit
                </button>

                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => {
                    setSelectedCustomer(c);
                    setShowDeleteModal(true);
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ---------------------- Add Customer Modal ---------------------- */}
      {showAddModal && (
        <div className="modal fade show" style={{ display: "block", background: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5>Add Customer</h5>
                <button className="btn-close" onClick={() => setShowAddModal(false)}></button>
              </div>

              <div className="modal-body">
                <input
                  className="form-control mb-2"
                  placeholder="Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
                <input
                  className="form-control mb-2"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
                <input
                  className="form-control mb-2"
                  placeholder="Phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>

              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
                <button className="btn btn-primary" onClick={handleAddCustomer}>
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------- Edit Customer Modal ---------------------- */}
      {showEditModal && (
        <div className="modal fade show" style={{ display: "block", background: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5>Edit Customer</h5>
                <button className="btn-close" onClick={() => setShowEditModal(false)}></button>
              </div>

              <div className="modal-body">
                <input
                  className="form-control mb-2"
                  placeholder="Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
                <input
                  className="form-control mb-2"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
                <input
                  className="form-control mb-2"
                  placeholder="Phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>

              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowEditModal(false)}>
                  Cancel
                </button>
                <button className="btn btn-warning" onClick={handleEditCustomer}>
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------- Delete Customer Modal ---------------------- */}
      {showDeleteModal && (
        <div className="modal fade show" style={{ display: "block", background: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5>Delete Customer</h5>
                <button className="btn-close" onClick={() => setShowDeleteModal(false)}></button>
              </div>

              <div className="modal-body">
                <p>Are you sure you want to delete <strong>{selectedCustomer?.name}</strong>?</p>
              </div>

              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowDeleteModal(false)}>
                  Cancel
                </button>
                <button className="btn btn-danger" onClick={handleDeleteCustomer}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
