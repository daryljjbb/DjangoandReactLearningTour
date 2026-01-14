import { useEffect, useState } from "react";
import KPISection from "../components/dashboard/KPISection";
import RevenueChart from "../components/dashboard/RevenueChart";
import PaymentsChart from "../components/dashboard/PaymentsChart";
import OverdueList from "../components/dashboard/OverdueList";
import { Container, Row, Col, Spinner } from "react-bootstrap";
import { refreshToken } from "../utils/auth";

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [revenue, setRevenue] = useState([]);
  const [payments, setPayments] = useState([]);
  const [overdue, setOverdue] = useState([]);
  const [loading, setLoading] = useState(true);

  async function authorizedFetch(url) {
    let access = localStorage.getItem("access_token");

    let response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${access}`,
      },
    });

    // If token expired → refresh and retry
    if (response.status === 401) {
      access = await refreshToken();
      if (!access) return null;

      response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${access}`,
        },
      });
    }

    return response.json();
  }

  useEffect(() => {
    async function loadDashboard() {
      const summaryData = await authorizedFetch("http://127.0.0.1:8000/api/dashboard/summary/");
      const revenueData = await authorizedFetch("http://127.0.0.1:8000/api/dashboard/monthly-revenue/");
      const paymentsData = await authorizedFetch("http://127.0.0.1:8000/api/dashboard/monthly-payments/");
      const overdueData = await authorizedFetch("http://127.0.0.1:8000/api/dashboard/overdue/");

      setSummary(summaryData);
      setRevenue(revenueData);
      setPayments(paymentsData);
      setOverdue(overdueData);
      setLoading(false);

       console.log("SUMMARY:", summaryData);
      console.log("REVENUE:", revenueData);
      console.log("PAYMENTS:", paymentsData);
      console.log("OVERDUE:", overdueData);
    }

   


    loadDashboard();
  }, []);

  if (loading || !summary) {
  return (
    <Container className="mt-4 text-center">
      <Spinner animation="border" />
      <p>Loading dashboard...</p>
    </Container>
  );
}


  return (
    <Container className="mt-4">
      <h1 className="mb-4">Dashboard</h1>

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
    </Container>
  );
}
