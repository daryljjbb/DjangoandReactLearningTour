import { Card, Row, Col } from "react-bootstrap";

export default function KPISection({ summary }) {
  const cards = [
    { label: "Total Invoices", value: summary.total_invoices },
    { label: "Paid", value: summary.paid },
    { label: "Unpaid", value: summary.unpaid },
    { label: "Overdue", value: summary.overdue },
    { label: "Total Revenue", value: `$${summary.total_revenue}` },
    { label: "Payments Collected", value: `$${summary.total_payments_collected}` },
  ];

  return (
    <Row className="g-3">
      {cards.map((card, index) => (
        <Col key={index} md={4} lg={3}>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title>{card.label}</Card.Title>
              <Card.Text style={{ fontSize: "24px", fontWeight: "bold" }}>
                {card.value}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
}
