import { useEffect, useState } from "react";
import KPISection from "../components/dashboard/KPISection";
import RevenueChart from "../components/dashboard/RevenueChart";
import PaymentsChart from "../components/dashboard/PaymentsChart";
import OverdueList from "../components/dashboard/OverdueList";
import { Container, Row, Col, Spinner } from "react-bootstrap";

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [revenue, setRevenue] = useState([]);
  const [payments, setPayments] = useState([]);
  const [overdue, setOverdue] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("http://localhost:8000/api/dashboard/summary/").then(res => res.json()),
      fetch("http://localhost:8000/api/dashboard/monthly-revenue/").then(res => res.json()),
      fetch("http://localhost:8000/api/dashboard/monthly-payments/").then(res => res.json()),
      fetch("http://localhost:8000/api/dashboard/overdue/").then(res => res.json()),
    ]).then(([summaryData, revenueData, paymentsData, overdueData]) => {
      setSummary(summaryData);
      setRevenue(revenueData);
      setPayments(paymentsData);
      setOverdue(overdueData);
      setLoading(false);
    });
  }, []);

  return (
    <Container className="mt-4">
      <h1 className="mb-4">Dashboard</h1>

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" />
          <p>Loading dashboard...</p>
        </div>
      ) : (
        <>
          <KPISection summary={summary} />

          <Row className="mt-4">
            <Col md={6}>
              <RevenueChart data={revenue} />
            </Col>
            <Col md={6}>
              <PaymentsChart data={payments} />
            </Col>
          </Row>

          <Row className="mt-4">
            <Col>
              <OverdueList invoices={overdue} />
            </Col>
          </Row>
        </>
      )}
    </Container>
  );
}
