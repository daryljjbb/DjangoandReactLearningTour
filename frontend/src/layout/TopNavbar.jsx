import { Navbar, Nav, Dropdown, Image } from "react-bootstrap";
import { FiUser, FiSettings, FiLogOut } from "react-icons/fi";
import { logout } from "../utils/auth";


export default function TopNavbar() {
  return (
    <Navbar
      bg="light"
      expand="lg"
      className="px-3 shadow-sm"
      style={{ height: "60px" }}
    >
      <Navbar.Brand className="fw-bold">Welcome, Daryl</Navbar.Brand>

      <Nav className="ms-auto d-flex align-items-center">

        <Dropdown align="end">
          <Dropdown.Toggle
            variant="light"
            id="dropdown-basic"
            className="d-flex align-items-center gap-2 border-0"
          >
            <Image
              src="https://ui-avatars.com/api/?name=Daryl"
              roundedCircle
              width="32"
              height="32"
            />
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item className="d-flex align-items-center gap-2">
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
