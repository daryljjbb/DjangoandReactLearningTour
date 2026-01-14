// src/pages/Profile.jsx
import { useState, useEffect } from "react";
import { Card, Form, Button, Row, Col, Image, Modal } from "react-bootstrap";
import { refreshToken } from "../utils/auth";

export default function Profile() {
  // Profile data
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");

  // Edit mode
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");

  // Avatar
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [profileAvatarUrl, setProfileAvatarUrl] = useState(null);

  // Password modal
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // -----------------------------
  // LOAD PROFILE FROM BACKEND
  // -----------------------------
  useEffect(() => {
    async function loadProfile() {
      let access = localStorage.getItem("access_token");

      let response = await fetch("http://127.0.0.1:8000/api/user/profile/", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access}`,
        },
      });

      if (response.status === 401) {
        access = await refreshToken();
        if (!access) return;

        response = await fetch("http://127.0.0.1:8000/api/user/profile/", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access}`,
          },
        });
      }

      const data = await response.json();

      const fullName = `${data.first_name} ${data.last_name}`.trim();

      setUserName(fullName);
      setEmail(data.email);

      setEditName(fullName);
      setEditEmail(data.email);

      if (data.avatar_url) {
        setProfileAvatarUrl(data.avatar_url);
      }
    }

    loadProfile();
  }, []);

  // -----------------------------
  // SAVE PROFILE (PATCH)
  // -----------------------------
  const handleSave = async () => {
    let access = localStorage.getItem("access_token");

    const [first, last] = editName.split(" ");

    let response = await fetch("http://127.0.0.1:8000/api/user/profile/", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access}`,
      },
      body: JSON.stringify({
        first_name: first,
        last_name: last || "",
        email: editEmail,
      }),
    });

    if (response.status === 401) {
      access = await refreshToken();
      if (!access) return;

      response = await fetch("http://127.0.0.1:8000/api/user/profile/", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access}`,
        },
        body: JSON.stringify({
          first_name: first,
          last_name: last || "",
          email: editEmail,
        }),
      });
    }

    if (!response.ok) {
      console.error("Profile update failed");
      return;
    }

    const data = await response.json();
    const fullName = `${data.first_name} ${data.last_name}`.trim();

    setUserName(fullName);
    setEmail(data.email);
    setIsEditing(false);

    // Upload avatar if selected
    await uploadAvatar();
  };

  // -----------------------------
  // CANCEL EDIT
  // -----------------------------
  const handleCancel = () => {
    setEditName(userName);
    setEditEmail(email);
    setIsEditing(false);
  };

  // -----------------------------
  // UPLOAD AVATAR
  // -----------------------------
  const uploadAvatar = async () => {
    if (!avatarFile) return;

    const formData = new FormData();
    formData.append("avatar", avatarFile);

    let access = localStorage.getItem("access_token");

    let response = await fetch("http://127.0.0.1:8000/api/user/avatar/", {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${access}`,
      },
      body: formData,
    });

    if (response.status === 401) {
      access = await refreshToken();
      if (!access) return;

      response = await fetch("http://127.0.0.1:8000/api/user/avatar/", {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${access}`,
        },
        body: formData,
      });
    }

    const data = await response.json();
    setProfileAvatarUrl(data.avatar_url);
    setAvatarFile(null);
  };

  // -----------------------------
  // PASSWORD SAVE (FRONTEND ONLY)
  // -----------------------------
  const handlePasswordSave = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("All fields are required");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }

    // Later: send to backend
    console.log("Password changed!");

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setPasswordError("");
    setShowPasswordModal(false);
  };

  // -----------------------------
  // RENDER
  // -----------------------------
  return (
    <div className="p-4">
      <h2 className="mb-4">My Profile</h2>

      <Card className="p-4 shadow-sm">
        <Row>
          {/* AVATAR */}
          <Col md={3} className="text-center">
            <Image
              src={
                avatarPreview ||
                (profileAvatarUrl
                  ? `http://127.0.0.1:8000${profileAvatarUrl}`
                  : `https://ui-avatars.com/api/?name=${userName}`)
              }
              roundedCircle
              width="128"
              height="128"
            />

            <input
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              id="avatarInput"
              onChange={(e) => {
                const file = e.target.files[0];
                setAvatarFile(file);
                setAvatarPreview(URL.createObjectURL(file));
              }}
            />

            <Button
              variant="outline-primary"
              size="sm"
              className="mt-2"
              onClick={() => document.getElementById("avatarInput").click()}
            >
              Change Avatar
            </Button>
          </Col>

          {/* PROFILE FORM */}
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
                <Form.Control type="password" value="********" disabled />

                <Button
                  variant="outline-secondary"
                  size="sm"
                  className="mt-2"
                  onClick={() => setShowPasswordModal(true)}
                >
                  Change Password
                </Button>
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

      {/* PASSWORD MODAL */}
      <Modal
        show={showPasswordModal}
        onHide={() => setShowPasswordModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Change Password</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Current Password</Form.Label>
              <Form.Control
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>New Password</Form.Label>
              <Form.Control
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Confirm New Password</Form.Label>
              <Form.Control
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </Form.Group>

            {passwordError && (
              <div className="text-danger mb-2">{passwordError}</div>
            )}
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPasswordModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handlePasswordSave}>
            Save Password
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
