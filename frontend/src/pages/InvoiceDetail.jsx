import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function InvoiceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentFormData, setPaymentFormData] = useState({
    amount: "",
    note: "",
  });

  const openEditPaymentModal = (payment) => {
  setSelectedPayment(payment);
  setPaymentFormData({
    amount: payment.amount,
    note: payment.note,
  });
  setShowEditPaymentModal(true);
};



const [showEditPaymentModal, setShowEditPaymentModal] = useState(false);
const [selectedPayment, setSelectedPayment] = useState(null);


const statusColors = {
  unpaid: "badge bg-danger",
  partially_paid: "badge bg-warning text-dark",
  paid: "badge bg-success",
};


  const access = localStorage.getItem("access_token");

  const fetchInvoice = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/invoices/${id}/`, {
        headers: { Authorization: `Bearer ${access}` },
      });

      const data = await response.json();
      setInvoice(data);
    } catch (error) {
      toast.error("Failed to load invoice");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoice();
  }, [id]);

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
        invoice: invoice.id,
        amount: paymentFormData.amount,
        note: paymentFormData.note,
      }),
    });

    if (!response.ok) {
      toast.error("Failed to add payment", { id: "addPayment" });
      return;
    }

    toast.success("Payment added!", { id: "addPayment" });

    // Close modal + reset form
    setShowPaymentModal(false);
    setPaymentFormData({ amount: "", note: "" });

    // Refresh invoice detail
    fetchInvoice();
  } catch (error) {
    toast.error("Error adding payment", { id: "addPayment" });
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
    fetchInvoice(); // refresh invoice detail
  } catch (error) {
    toast.error("Error deleting payment", { id: "deletePayment" });
  }
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
      body: JSON.stringify(paymentFormData),
    });

    if (!response.ok) {
      toast.error("Failed to update payment", { id: "editPayment" });
      return;
    }

    toast.success("Payment updated!", { id: "editPayment" });
    setShowEditPaymentModal(false);
    fetchInvoice();
  } catch (error) {
    toast.error("Error updating payment", { id: "editPayment" });
  }
};



  if (loading) return <p>Loading invoice...</p>;
  if (!invoice) return <p>Invoice not found</p>;

  return (
    <div>
      <button className="btn btn-secondary mb-3" onClick={() => navigate(-1)}>
        Back
      </button>

      <h2>Invoice {invoice.invoice_number}</h2>

      <div className="card p-3 mb-3">
        <p><strong>Customer:</strong> {invoice.customer_name}</p>
        <p><strong>Total Amount:</strong> ${invoice.total_amount}</p>
        <p>
            <strong>Status:</strong>
            <span className={statusColors[invoice.status] + " ms-2"}>
                {invoice.status.replace("_", " ")}
            </span>
        </p>
        <p><strong>Issue Date:</strong> {invoice.issue_date}</p>
        <p><strong>Due Date:</strong> {invoice.due_date}</p>
        <p><strong>Balance Due:</strong> ${invoice.balance_due}</p>
      </div>

      <h4>Payment History</h4>

      {invoice.payments.length === 0 && <p>No payments yet.</p>}

      <ul className="list-group mb-3">
        {invoice.payments.map((p) => (
            <li key={p.id} className="list-group-item d-flex justify-content-between align-items-center">
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


      <button className="btn btn-success" onClick={() => setShowPaymentModal(true)}>
        Add Payment
      </button>

      {showPaymentModal && (
        <div
            className="modal fade show"
            style={{ display: "block", background: "rgba(0,0,0,0.5)" }}
        >
            <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">

                <div className="modal-header">
                <h5>Add Payment</h5>
                <button className="btn-close" onClick={() => setShowPaymentModal(false)}></button>
                </div>

                <div className="modal-body">
                <input
                    type="number"
                    className="form-control mb-2"
                    placeholder="Payment Amount"
                    value={paymentFormData.amount}
                    onChange={(e) =>
                    setPaymentFormData({ ...paymentFormData, amount: e.target.value })
                    }
                />

                <textarea
                    className="form-control mb-2"
                    placeholder="Note (optional)"
                    value={paymentFormData.note}
                    onChange={(e) =>
                    setPaymentFormData({ ...paymentFormData, note: e.target.value })
                    }
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

            </div>
            </div>
        </div>
        )}
        {showEditPaymentModal && (
  <div className="modal fade show" style={{ display: "block", background: "rgba(0,0,0,0.5)" }}>
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
            value={paymentFormData.amount}
            onChange={(e) => setPaymentFormData({ ...paymentFormData, amount: e.target.value })}
          />

          <textarea
            className="form-control mb-2"
            value={paymentFormData.note}
            onChange={(e) => setPaymentFormData({ ...paymentFormData, note: e.target.value })}
          />
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={() => setShowEditPaymentModal(false)}>Cancel</button>
          <button className="btn btn-warning" onClick={handleEditPayment}>Save Changes</button>
        </div>

      </div>
    </div>
  </div>
)}


    </div>
  );
}
