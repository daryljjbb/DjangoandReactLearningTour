import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import '../index.css';
export default function Invoices() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  const access = localStorage.getItem("access_token");

const [showAddModal, setShowAddModal] = useState(false);
const [showEditModal, setShowEditModal] = useState(false);
const [showDeleteModal, setShowDeleteModal] = useState(false);

const [selectedInvoice, setSelectedInvoice] = useState(null);

const [invoiceFormData, setInvoiceFormData] = useState({
  customer: "",
  invoice_number: "",
  issue_date: "",
  due_date: "",
  total_amount: "",
});

const navigate = useNavigate();


const statusColors = {
  unpaid: "badge bg-danger",
  partially_paid: "badge bg-warning text-dark",
  paid: "badge bg-success",
};

  const fetchInvoices = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/invoices/", {
        headers: { Authorization: `Bearer ${access}` },
      });

      const data = await response.json();
      setInvoices(data);
    } catch (error) {
      toast.error("Failed to load invoices");
    } finally {
      setLoading(false);
    }
  };

 useEffect(() => {
  fetchInvoices();
  fetchCustomers();
}, []);


 const [customers, setCustomers] = useState([]);

const fetchCustomers = async () => {
  const response = await fetch("http://127.0.0.1:8000/api/customers/", {
    headers: { Authorization: `Bearer ${access}` },
  });
  const data = await response.json();
  setCustomers(data);
};

const handleAddInvoice = async () => {
  toast.loading("Creating invoice...", { id: "addInvoice" });

  try {
    const response = await fetch("http://127.0.0.1:8000/api/invoices/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access}`,
      },
      body: JSON.stringify(invoiceFormData),
    });

    if (!response.ok) {
      toast.error("Failed to create invoice", { id: "addInvoice" });
      return;
    }

    toast.success("Invoice created!", { id: "addInvoice" });
    setShowAddModal(false);
    setInvoiceFormData({
      customer: "",
      invoice_number: "",
      issue_date: "",
      due_date: "",
      total_amount: "",
    });
    fetchInvoices();
  } catch (error) {
    toast.error("Error creating invoice", { id: "addInvoice" });
  }
};

const handleEditInvoice = async () => {
  toast.loading("Updating invoice...", { id: "editInvoice" });

  try {
    const response = await fetch(
      `http://127.0.0.1:8000/api/invoices/${selectedInvoice.id}/`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access}`,
        },
        body: JSON.stringify(invoiceFormData),
      }
    );

    if (!response.ok) {
      toast.error("Failed to update invoice", { id: "editInvoice" });
      return;
    }

    toast.success("Invoice updated!", { id: "editInvoice" });
    setShowEditModal(false);
    fetchInvoices();
  } catch (error) {
    toast.error("Error updating invoice", { id: "editInvoice" });
  }
};


const handleDeleteInvoice = async () => {
  toast.loading("Deleting invoice...", { id: "deleteInvoice" });

  try {
    console.log("DELETE TOKEN:", access);
    const response = await fetch(
      `http://127.0.0.1:8000/api/invoices/${selectedInvoice.id}/`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${access}` },
      }
    );

    if (!response.ok) {
      toast.error("Failed to delete invoice", { id: "deleteInvoice" });
      return;
    }

    toast.success("Invoice deleted", { id: "deleteInvoice" });
    setShowDeleteModal(false);
    fetchInvoices();
  } catch (error) {
    toast.error("Error deleting invoice", { id: "deleteInvoice" });
  }
};

  if (!Array.isArray(customers)) { return <p>Loading customers...</p>; }
  if (!Array.isArray(invoices)) { return <p>Loading invoices...</p>; }

  if (loading) return <p>Loading invoices...</p>;

  return (
    <div>
      <h2 className="mb-3">Invoices</h2>

      <button className="btn btn-primary mb-3" onClick={() => setShowAddModal(true)}>
        Add Invoice
      </button>

      <table className="table table-hover">
        <thead>
          <tr>
            <th>Invoice #</th>
            <th>Customer</th>
            <th>Total</th>
            <th>Status</th>
            <th>Due</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {invoices.map((inv) => (
          <tr
                    key={inv.id}
                    className={inv.is_overdue ? "table-danger" : ""}
         >




              <td>{inv.invoice_number}</td>
              <td>{inv.customer_name}</td>
              <td>${inv.total_amount}</td>
              <td>
                <span className={statusColors[inv.status]}>
                    {inv.status.replace("_", " ")}
                </span>

                {inv.is_overdue && inv.status !== "paid" && (
                    <span className="badge bg-danger ms-2">Overdue</span>
                )}
                </td>

              <td>{inv.due_date}</td>
              <td>
                <button
                className="btn btn-sm btn-info me-2"
                onClick={() => navigate(`/invoices/${inv.id}`)}
                >
                View
                </button>

                <button
                className="btn btn-sm btn-warning me-2"
                onClick={() => {
                    setSelectedInvoice(inv);
                    setInvoiceFormData({
                    customer: inv.customer.id, // ✅ use ID
                    invoice_number: inv.invoice_number,
                    issue_date: inv.issue_date,
                    due_date: inv.due_date,
                    total_amount: inv.total_amount,
                    });
                    setShowEditModal(true);
                }}
                >
                Edit
                </button>

                <button
                className="btn btn-sm btn-danger"
                onClick={() => {
                    setSelectedInvoice(inv);
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
      {showAddModal && (
  <div className="modal fade show" style={{ display: "block", background: "rgba(0,0,0,0.5)" }}>
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content">

        <div className="modal-header">
          <h5>Add Invoice</h5>
          <button className="btn-close" onClick={() => setShowAddModal(false)}></button>
        </div>

        <div className="modal-body">

          <select
            className="form-control mb-2"
            value={invoiceFormData.customer}
            onChange={(e) => setInvoiceFormData({ ...invoiceFormData, customer: e.target.value })}
          >
            <option value="">Select Customer</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          <input
            className="form-control mb-2"
            placeholder="Invoice Number"
            value={invoiceFormData.invoice_number}
            onChange={(e) => setInvoiceFormData({ ...invoiceFormData, invoice_number: e.target.value })}
          />

          <input
            type="date"
            className="form-control mb-2"
            value={invoiceFormData.issue_date}
            onChange={(e) => setInvoiceFormData({ ...invoiceFormData, issue_date: e.target.value })}
          />

          <input
            type="date"
            className="form-control mb-2"
            value={invoiceFormData.due_date}
            onChange={(e) => setInvoiceFormData({ ...invoiceFormData, due_date: e.target.value })}
          />

          <input
            className="form-control mb-2"
            placeholder="Total Amount"
            type="number"
            value={invoiceFormData.total_amount}
            onChange={(e) => setInvoiceFormData({ ...invoiceFormData, total_amount: e.target.value })}
          />

        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
          <button className="btn btn-primary" onClick={handleAddInvoice}>Add Invoice</button>
        </div>

      </div>
    </div>
  </div>
)}

{showEditModal && (
  <div className="modal fade show" style={{ display: "block", background: "rgba(0,0,0,0.5)" }}>
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content">

        <div className="modal-header">
          <h5>Edit Invoice</h5>
          <button className="btn-close" onClick={() => setShowEditModal(false)}></button>
        </div>

        <div className="modal-body">

            <select
                className="form-control mb-2"
                value={invoiceFormData.customer}
                onChange={(e) => setInvoiceFormData({ ...invoiceFormData, customer: e.target.value })}
            >
                <option value="">Select Customer</option>
                {customers.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
                ))}
            </select>

            <input
                className="form-control mb-2"
                placeholder="Invoice Number"
                value={invoiceFormData.invoice_number}
                onChange={(e) => setInvoiceFormData({ ...invoiceFormData, invoice_number: e.target.value })}
            />

            <input
                type="date"
                className="form-control mb-2"
                value={invoiceFormData.issue_date}
                onChange={(e) => setInvoiceFormData({ ...invoiceFormData, issue_date: e.target.value })}
            />

            <input
                type="date"
                className="form-control mb-2"
                value={invoiceFormData.due_date}
                onChange={(e) => setInvoiceFormData({ ...invoiceFormData, due_date: e.target.value })}
            />

            <input
                className="form-control mb-2"
                placeholder="Total Amount"
                type="number"
                value={invoiceFormData.total_amount}
                onChange={(e) => setInvoiceFormData({ ...invoiceFormData, total_amount: e.target.value })}
            />

            </div>


        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={() => setShowEditModal(false)}>Cancel</button>
          <button className="btn btn-warning" onClick={handleEditInvoice}>Save Changes</button>
        </div>

      </div>
    </div>
  </div>
)}


{showDeleteModal && (
  <div className="modal fade show" style={{ display: "block", background: "rgba(0,0,0,0.5)" }}>
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content">

        <div className="modal-header">
          <h5>Delete Invoice</h5>
          <button className="btn-close" onClick={() => setShowDeleteModal(false)}></button>
        </div>

        <div className="modal-body">
          <p>Are you sure you want to delete invoice <strong>{selectedInvoice?.invoice_number}</strong>?</p>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={() => setShowDeleteModal(false)}>Cancel</button>
          <button className="btn btn-danger" onClick={handleDeleteInvoice}>Delete</button>
        </div>

      </div>
    </div>
  </div>
)}

    </div>
  );
}
