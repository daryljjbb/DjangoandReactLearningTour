import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SidebarLayout from "./layout/SidebarLayout";
import Dashboard from "./pages/Dashboard";

export default function App() {
  return (
    <Router>
      <SidebarLayout>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          {/* other routes */}
        </Routes>
      </SidebarLayout>
    </Router>
  );
}
