import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Tab, Tabs } from "react-bootstrap";
import toast from "react-hot-toast";

export default function CustomerDetail() {
  const { id } = useParams();

  const [customer, setCustomer] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [invoiceForm, setInvoiceForm] = useState({
    invoice_number: "",
    total_amount: "",
    issue_date: "",
    due_date: "",
  });

  const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState(null);

    const [paymentForm, setPaymentForm] = useState({
    amount: "",
    note: "",
    });

    const openPaymentModal = (invoice) => {
  setSelectedInvoice(invoice);
  setShowPaymentModal(true);
};


const statusColors = {
  unpaid: "badge bg-danger",
  partially_paid: "badge bg-warning text-dark",
  paid: "badge bg-success",
};

const [showPaymentHistory, setShowPaymentHistory] = useState(false);
const [selectedInvoicePayments, setSelectedInvoicePayments] = useState([]);

const [showEditPaymentModal, setShowEditPaymentModal] = useState(false);
const [selectedPayment, setSelectedPayment] = useState(null);


const openEditPaymentModal = (payment) => {
  setSelectedPayment(payment);
  setPaymentForm({
    amount: payment.amount,
    note: payment.note,
  });
  setShowEditPaymentModal(true);
};


  const access = localStorage.getItem("access_token");

  const fetchCustomer = async () => {
    const res = await fetch(`http://127.0.0.1:8000/api/customers/${id}/`, {
      headers: { Authorization: `Bearer ${access}` },
    });
    setCustomer(await res.json());
  };

  const fetchInvoices = async () => {
    const res = await fetch(`http://127.0.0.1:8000/api/customers/${id}/invoices/`, {
      headers: { Authorization: `Bearer ${access}` },
    });
    setInvoices(await res.json());
  };

  useEffect(() => {
    Promise.all([fetchCustomer(), fetchInvoices()]).then(() => setLoading(false));
  }, [id]);

  const handleCreateInvoice = async () => {
    toast.loading("Creating invoice...", { id: "createInvoice" });

    const response = await fetch("http://127.0.0.1:8000/api/invoices/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access}`,
      },
      body: JSON.stringify({
        ...invoiceForm,
        customer: id, // ⭐ AUTO‑ATTACH CUSTOMER
      }),
    });

    if (!response.ok) {
      toast.error("Failed to create invoice", { id: "createInvoice" });
      return;
    }

    toast.success("Invoice created!", { id: "createInvoice" });
    setShowInvoiceModal(false);
    setInvoiceForm({ invoice_number: "", total_amount: "", issue_date: "", due_date: "" });
    fetchInvoices();
  };

  const handleAddPayment = async () => {
  const access = localStorage.getItem("access_token");

  toast.loading("Adding payment...", { id: "addPayment" });

  try {
    const response = await fetch("http://127.0.0.1:8000/api/payments/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access}`,
      },
      body: JSON.stringify({
        invoice: selectedInvoice.id,
        amount: paymentForm.amount,
        note: paymentForm.note,
      }),
    });

    if (!response.ok) {
      toast.error("Failed to add payment", { id: "addPayment" });
      return;
    }

    toast.success("Payment added!", { id: "addPayment" });

    setShowPaymentModal(false);
    setPaymentForm({ amount: "", note: "" });

    // Refresh invoice list inside the tab
    fetchInvoices();
  } catch (error) {
    toast.error("Error adding payment", { id: "addPayment" });
  }
};


const openPaymentHistory = async (invoice) => {
  setSelectedInvoice(invoice);

  const access = localStorage.getItem("access_token");

  const res = await fetch(`http://127.0.0.1:8000/api/invoices/${invoice.id}/`, {
    headers: { Authorization: `Bearer ${access}` },
  });

  const data = await res.json();
  setSelectedInvoicePayments(data.payments);

  setShowPaymentHistory(true);
};


const handleEditPayment = async () => {
  const access = localStorage.getItem("access_token");

  toast.loading("Updating payment...", { id: "editPayment" });

  try {
    const response = await fetch(`http://127.0.0.1:8000/api/payments/${selectedPayment.id}/`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access}`,
      },
      body: JSON.stringify(paymentForm),
    });

    if (!response.ok) {
      toast.error("Failed to update payment", { id: "editPayment" });
      return;
    }

    toast.success("Payment updated!", { id: "editPayment" });
    setShowEditPaymentModal(false);

    // Refresh invoice + payment history
    fetchInvoices();
    openPaymentHistory(selectedInvoice);
  } catch (error) {
    toast.error("Error updating payment", { id: "editPayment" });
  }
};

const handleDeletePayment = async (paymentId) => {
  const access = localStorage.getItem("access_token");

  toast.loading("Deleting payment...", { id: "deletePayment" });

  try {
    const response = await fetch(`http://127.0.0.1:8000/api/payments/${paymentId}/`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${access}` },
    });

    if (!response.ok) {
      toast.error("Failed to delete payment", { id: "deletePayment" });
      return;
    }

    toast.success("Payment deleted", { id: "deletePayment" });

    // Refresh invoice + payment history
    fetchInvoices();
    openPaymentHistory(selectedInvoice);
  } catch (error) {
    toast.error("Error deleting payment", { id: "deletePayment" });
  }
};



  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2>{customer.name}</h2>
      <p>{customer.email}</p>
      <p>{customer.phone}</p>

      <Tabs defaultActiveKey="invoices" className="mt-4">
        
        <Tab eventKey="overview" title="Overview">
          <p>Customer overview content here...</p>
        </Tab>

        <Tab eventKey="invoices" title="Invoices">
          <button className="btn btn-primary mb-3" onClick={() => setShowInvoiceModal(true)}>
            Add Invoice
          </button>

          <table className="table table-striped">
            <thead>
              <tr>
                <th>Invoice #</th>
                <th>Total</th>
                <th>Balance Due</th>
                <th>Status</th>
                <th>Due</th>
              </tr>
            </thead>
            <tbody>
            {invoices.map((inv) => (
                <tr
                    key={inv.id}
                    className={inv.is_overdue ? "table-danger" : ""}
                    >

                <td>{inv.invoice_number}</td>
                <td>${inv.total_amount}</td>
                <td>${inv.balance_due}</td>

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
                    onClick={() => openPaymentHistory(inv)}
                >
                    View Payments
                </button>

                <button
                    className="btn btn-sm btn-success"
                    onClick={() => openPaymentModal(inv)}
                >
                    Add Payment
                </button>
                </td>

                </tr>
            ))}
            </tbody>

          </table>
        </Tab>

      </Tabs>

      {showInvoiceModal && (
        <div className="modal fade show" style={{ display: "block", background: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">

              <div className="modal-header">
                <h5>Create Invoice</h5>
                <button className="btn-close" onClick={() => setShowInvoiceModal(false)}></button>
              </div>

              <div className="modal-body">
                <input
                  className="form-control mb-2"
                  placeholder="Invoice Number"
                  value={invoiceForm.invoice_number}
                  onChange={(e) => setInvoiceForm({ ...invoiceForm, invoice_number: e.target.value })}
                />

                <input
                  type="number"
                  className="form-control mb-2"
                  placeholder="Total Amount"
                  value={invoiceForm.total_amount}
                  onChange={(e) => setInvoiceForm({ ...invoiceForm, total_amount: e.target.value })}
                />

                <input
                  type="date"
                  className="form-control mb-2"
                  value={invoiceForm.issue_date}
                  onChange={(e) => setInvoiceForm({ ...invoiceForm, issue_date: e.target.value })}
                />

                <input
                  type="date"
                  className="form-control mb-2"
                  value={invoiceForm.due_date}
                  onChange={(e) => setInvoiceForm({ ...invoiceForm, due_date: e.target.value })}
                />
              </div>

              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowInvoiceModal(false)}>
                  Cancel
                </button>
                <button className="btn btn-primary" onClick={handleCreateInvoice}>
                  Create Invoice
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
      {showPaymentModal && (
  <div
    className="modal fade show"
    style={{ display: "block", background: "rgba(0,0,0,0.5)" }}
  >
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content">

        <div className="modal-header">
          <h5>Add Payment to {selectedInvoice.invoice_number}</h5>
          <button className="btn-close" onClick={() => setShowPaymentModal(false)}></button>
        </div>

        <div className="modal-body">
          <input
            type="number"
            className="form-control mb-2"
            placeholder="Payment Amount"
            value={paymentForm.amount}
            onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
          />

          <textarea
            className="form-control mb-2"
            placeholder="Note (optional)"
            value={paymentForm.note}
            onChange={(e) => setPaymentForm({ ...paymentForm, note: e.target.value })}
          />
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={() => setShowPaymentModal(false)}>
            Cancel
          </button>
          <button className="btn btn-success" onClick={handleAddPayment}>
            Add Payment
          </button>
        </div>
        <ul className="list-group">
        {selectedInvoicePayments.map((p) => (
            <li
            key={p.id}
            className="list-group-item d-flex justify-content-between align-items-center"
            >
            <div>
                <strong>${p.amount}</strong> — {p.created_at}
                <br />
                <small>{p.note}</small>
            </div>

            <div>
                <button
                className="btn btn-sm btn-warning me-2"
                onClick={() => openEditPaymentModal(p)}
                >
                Edit
                </button>

                <button
                className="btn btn-sm btn-danger"
                onClick={() => handleDeletePayment(p.id)}
                >
                Delete
                </button>
            </div>
            </li>
        ))}
        </ul>


      </div>
    </div>
  </div>
)}

{showPaymentHistory && (
  <div
    className="modal fade show"
    style={{ display: "block", background: "rgba(0,0,0,0.5)" }}
  >
    <div className="modal-dialog modal-dialog-centered modal-lg">
      <div className="modal-content">

        <div className="modal-header">
          <h5>Payment History — {selectedInvoice.invoice_number}</h5>
          <button className="btn-close" onClick={() => setShowPaymentHistory(false)}></button>
        </div>

        <div className="modal-body">
          {selectedInvoicePayments.length === 0 && (
            <p>No payments yet.</p>
          )}

          <ul className="list-group">
            {selectedInvoicePayments.map((p) => (
              <li
                key={p.id}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <div>
                  <strong>${p.amount}</strong> — {p.created_at}
                  <br />
                  <small>{p.note}</small>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={() => setShowPaymentHistory(false)}>
            Close
          </button>
        </div>

      </div>
    </div>
  </div>
)}
{showEditPaymentModal && (
  <div
    className="modal fade show"
    style={{ display: "block", background: "rgba(0,0,0,0.5)" }}
  >
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content">

        <div className="modal-header">
          <h5>Edit Payment</h5>
          <button className="btn-close" onClick={() => setShowEditPaymentModal(false)}></button>
        </div>

        <div className="modal-body">
          <input
            type="number"
            className="form-control mb-2"
            value={paymentForm.amount}
            onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
          />

          <textarea
            className="form-control mb-2"
            value={paymentForm.note}
            onChange={(e) => setPaymentForm({ ...paymentForm, note: e.target.value })}
          />
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={() => setShowEditPaymentModal(false)}>
            Cancel
          </button>
          <button className="btn btn-warning" onClick={handleEditPayment}>
            Save Changes
          </button>
        </div>

      </div>
    </div>
  </div>
)}

    </div>
  );
}
