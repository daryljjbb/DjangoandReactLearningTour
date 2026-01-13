import { Table, Card } from "react-bootstrap";

export default function OverdueList({ invoices }) {
  return (
    <Card className="shadow-sm">
      <Card.Body>
        <Card.Title>Overdue Invoices</Card.Title>

        {invoices.length === 0 && <p>No overdue invoices</p>}

        {invoices.length > 0 && (
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map(inv => (
                <tr key={inv.id}>
                  <td>{inv.id}</td>
                  <td>{inv.customer_name}</td>
                  <td>${inv.amount}</td>
                  <td>{inv.status}</td>
                  <td>{inv.created_at}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card.Body>
    </Card>
  );
}
