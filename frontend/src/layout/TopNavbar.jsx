// src/layout/TopNavbar.jsx

import { Navbar, Nav, Dropdown, Image } from "react-bootstrap";
import { FiUser, FiSettings, FiLogOut } from "react-icons/fi";
import { logout } from "../utils/auth";

export default function TopNavbar() {
  const userName = "Daryl"; // Later you can fetch this from API or JWT

  return (
    <Navbar bg="white" className="px-4 shadow-sm" expand="lg">
      <Navbar.Brand className="fw-bold">My App</Navbar.Brand>

      <Nav className="ms-auto">
        <Dropdown align="end">
          <Dropdown.Toggle
            variant="light"
            className="d-flex align-items-center border-0 bg-transparent"
          >
            <Image
              src={`https://ui-avatars.com/api/?name=${userName}&background=0D8ABC&color=fff`}
              roundedCircle
              width="36"
              height="36"
            />
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Header>Hello, {userName}</Dropdown.Header>

           <Dropdown.Item
              className="d-flex align-items-center gap-2"
              onClick={() => (window.location.href = "/profile")}
            >
              <FiUser /> Profile
            </Dropdown.Item>

            <Dropdown.Item className="d-flex align-items-center gap-2">
              <FiSettings /> Settings
            </Dropdown.Item>

            <Dropdown.Divider />

            <Dropdown.Item
              className="d-flex align-items-center gap-2 text-danger"
              onClick={logout}
            >
              <FiLogOut /> Logout
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </Nav>
    </Navbar>
  );
}
