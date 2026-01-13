import { useState } from "react";
import { Container, Row, Col, Nav, Button } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import TopNavbar from "./TopNavbar";
import {
  FiHome,
  FiFileText,
  FiCreditCard,
  FiUsers,
  FiMenu,
  FiChevronLeft
} from "react-icons/fi";

export default function SidebarLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const toggleSidebar = () => setCollapsed(!collapsed);

  return (
    <Container fluid>
      <Row>
        {/* Sidebar */}
        <Col
          md={collapsed ? 1 : 2}
          className="bg-dark text-white vh-100 p-3"
          style={{
            position: "fixed",
            left: 0,
            top: 0,
            width: collapsed ? "70px" : "220px",
            transition: "width 0.3s ease"
          }}
        >
          {/* Collapse Button */}
          <div className="d-flex justify-content-end mb-4">
            <Button
              variant="outline-light"
              size="sm"
              onClick={toggleSidebar}
              style={{ border: "none" }}
            >
              {collapsed ? <FiMenu size={20} /> : <FiChevronLeft size={20} />}
            </Button>
          </div>

          {/* App Title */}
          {!collapsed && <h3 className="text-center mb-4">My App</h3>}

          <Nav className="flex-column gap-2">
            <Nav.Item>
              <NavLink
                to="/dashboard"
                className="nav-link text-white d-flex align-items-center gap-2"
              >
                <FiHome size={20} />
                {!collapsed && "Dashboard"}
              </NavLink>
            </Nav.Item>
            <Nav.Item>
              <NavLink
                to="/invoices"
                className="nav-link text-white d-flex align-items-center gap-2"
              >
                <FiFileText size={20} />
                {!collapsed && "Invoices"}
              </NavLink>
            </Nav.Item>
            <Nav.Item>
              <NavLink
                to="/payments"
                className="nav-link text-white d-flex align-items-center gap-2"
              >
                <FiCreditCard size={20} />
                {!collapsed && "Payments"}
              </NavLink>
            </Nav.Item>
            <Nav.Item>
              <NavLink
                to="/customers"
                className="nav-link text-white d-flex align-items-center gap-2"
              >
                <FiUsers size={20} />
                {!collapsed && "Customers"}
              </NavLink>
            </Nav.Item>
          </Nav>
        </Col>

        {/* Main Content — only one copy now */}
        <Col
          md={{ span: collapsed ? 11 : 10, offset: collapsed ? 1 : 2 }}
          className="p-0"
          style={{
            marginLeft: collapsed ? "70px" : "220px",
            transition: "margin 0.3s ease"
          }}
        >
          <TopNavbar />
          <div className="p-4">
            {children}
          </div>
        </Col>
      </Row>
    </Container>
  );
}
