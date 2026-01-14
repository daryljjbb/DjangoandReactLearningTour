// src/pages/Profile.jsx

import { useState } from "react";
import { Card, Form, Button, Row, Col, Image } from "react-bootstrap";

export default function Profile() {
  // Later these will come from API or JWT
  const [userName, setUserName] = useState("Daryl");
  const [email, setEmail] = useState("daryl@example.com");

  const [isEditing, setIsEditing] = useState(false);

  // Temporary local edits
  const [editName, setEditName] = useState(userName);
  const [editEmail, setEditEmail] = useState(email);

  const handleSave = () => {
    // Later: send to backend
    setUserName(editName);
    setEmail(editEmail);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditName(userName);
    setEditEmail(email);
    setIsEditing(false);
  };

  return (
    <div className="p-4">
      <h2 className="mb-4">My Profile</h2>

      <Card className="p-4 shadow-sm">
        <Row>
          <Col md={3} className="text-center">
            <Image
              src={`https://ui-avatars.com/api/?name=${userName}&background=0D8ABC&color=fff&size=128`}
              roundedCircle
              className="mb-3"
            />

            <Button variant="outline-primary" size="sm" disabled>
              Change Avatar (coming soon)
            </Button>
          </Col>

          <Col md={9}>
            <Form>
              {/* NAME */}
              <Form.Group className="mb-3">
                <Form.Label>Full Name</Form.Label>
                <Form.Control
                  type="text"
                  value={isEditing ? editName : userName}
                  onChange={(e) => setEditName(e.target.value)}
                  disabled={!isEditing}
                />
              </Form.Group>

              {/* EMAIL */}
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  value={isEditing ? editEmail : email}
                  onChange={(e) => setEditEmail(e.target.value)}
                  disabled={!isEditing}
                />
              </Form.Group>

              {/* PASSWORD */}
              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  value="********"
                  disabled
                />
                <Form.Text className="text-muted">
                  Password changes coming soon
                </Form.Text>
              </Form.Group>

              {/* BUTTONS */}
              {!isEditing ? (
                <Button variant="primary" onClick={() => setIsEditing(true)}>
                  Edit Profile
                </Button>
              ) : (
                <div className="d-flex gap-2">
                  <Button variant="success" onClick={handleSave}>
                    Save Changes
                  </Button>
                  <Button variant="secondary" onClick={handleCancel}>
                    Cancel
                  </Button>
                </div>
              )}
            </Form>
          </Col>
        </Row>
      </Card>
    </div>
  );
}
