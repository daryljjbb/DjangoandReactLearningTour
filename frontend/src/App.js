// src/App.jsx

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SidebarLayout from "./layout/SidebarLayout";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import RequireAuth from "./utils/RequireAuth";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public route */}
        <Route path="/login" element={<Login />} />

        {/* Protected routes */}
        <Route
          path="/*"
          element={
            <SidebarLayout>
              <Routes>
                <Route
                  path="/dashboard"
                  element={
                    <RequireAuth>
                      <Dashboard />
                    </RequireAuth>
                  }
                />
              </Routes>
            </SidebarLayout>
          }
        />
      </Routes>
    </Router>
  );
}




