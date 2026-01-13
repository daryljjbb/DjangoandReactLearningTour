import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SidebarLayout from "./layout/SidebarLayout";
import Dashboard from "./pages/Dashboard";
// import Invoices, Payments, Customers when ready

export default function App() {
  return (
    <Router>
      <SidebarLayout>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          {/* Future pages */}
          {/* <Route path="/invoices" element={<Invoices />} /> */}
          {/* <Route path="/payments" element={<Payments />} /> */}
          {/* <Route path="/customers" element={<Customers />} /> */}
        </Routes>
      </SidebarLayout>
    </Router>
  );
}

