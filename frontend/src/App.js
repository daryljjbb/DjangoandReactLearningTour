// src/App.jsx

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SidebarLayout from "./layout/SidebarLayout";
import Customers from "./pages/Customers";
import Dashboard from "./pages/Dashboard";
import Invoices from "./pages/Invoices";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import RequireAuth from "./utils/RequireAuth";
import { Toaster } from "react-hot-toast";

export default function App() {
  return (
    <Router>
      <Toaster position="top-right" />

      <Routes>
        {/* Public route */}
        <Route path="/login" element={<Login />} />

        {/* Protected routes wrapped in layout */}
        <Route
          element={
            <RequireAuth>
              <SidebarLayout />
            </RequireAuth>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/invoices" element={<Invoices />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Routes>
    </Router>
  );
}
