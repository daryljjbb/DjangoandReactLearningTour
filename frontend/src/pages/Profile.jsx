import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";


const Profile = () => {
  const [profile, setProfile] = useState({
    first_name: "",
    last_name: "",
    email: "",
    avatar_url: null,
  });

  const [loading, setLoading] = useState(true);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [showPasswordModal, setShowPasswordModal] = useState(false);
const [passwordData, setPasswordData] = useState({
  old_password: "",
  new_password: "",
  confirm_password: "",
});
const [passwordError, setPasswordError] = useState("");
const [passwordSuccess, setPasswordSuccess] = useState("");



  const access = localStorage.getItem("access_token");

  // -----------------------------
  // Fetch Profile on Mount
  // -----------------------------
  const fetchProfile = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/user/profile/", {
        headers: {
          Authorization: `Bearer ${access}`,
        },
      });

      const data = await response.json();
      setProfile(data);

      if (data.avatar_url) {
        setAvatarPreview(`http://127.0.0.1:8000${data.avatar_url}`);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching profile:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // -----------------------------
  // Avatar Upload
  // -----------------------------

  

  const handleAvatarUpload = async (file) => {
    toast.loading("Uploading avatar...", { id: "avatar" });

try {
  const formData = new FormData();
  formData.append("avatar", file);

  const response = await fetch("http://127.0.0.1:8000/api/user/avatar/", {
    method: "PATCH",
    headers: { Authorization: `Bearer ${access}` },
    body: formData,
  });

  const data = await response.json();

  if (data.avatar_url) {
    setAvatarPreview(`http://127.0.0.1:8000${data.avatar_url}`);
    setProfile((prev) => ({ ...prev, avatar_url: data.avatar_url }));

    toast.success("Avatar updated!", { id: "avatar" });
  } else {
    toast.error("Failed to update avatar", { id: "avatar" });
  }
} catch (error) {
  toast.error("Upload failed", { id: "avatar" });
}

  };

  // -----------------------------
  // Profile Update (Name/Email)
  // -----------------------------
  const handleProfileUpdate = async () => {
    toast.loading("Saving changes...", { id: "profile" });

try {
  const response = await fetch("http://127.0.0.1:8000/api/user/profile/", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${access}`,
    },
    body: JSON.stringify(profile),
  });

  const data = await response.json();

  setProfile(data);
  setEditMode(false);

  toast.success("Profile updated!", { id: "profile" });
} catch (error) {
  toast.error("Update failed", { id: "profile" });
}

  };

  const handleAvatarDelete = async () => {
  toast.loading("Deleting avatar...", { id: "deleteAvatar" });

  try {
    const response = await fetch("http://127.0.0.1:8000/api/user/avatar/delete/", {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${access}`,
      },
    });

    if (!response.ok) {
      toast.error("Failed to delete avatar", { id: "deleteAvatar" });
      return;
    }

    const data = await response.json();

    if (data.avatar_url === null) {
      setAvatarPreview(null);
      setProfile((prev) => ({
        ...prev,
        avatar_url: null,
      }));

      toast.success("Avatar deleted", { id: "deleteAvatar" });
    } else {
      toast.error("Unexpected response from server", { id: "deleteAvatar" });
    }
  } catch (error) {
    console.error("Avatar delete failed:", error);
    toast.error("Delete failed", { id: "deleteAvatar" });
  }
};


const handlePasswordChange = async () => {
  setPasswordError("");
  setPasswordSuccess("");

  toast.loading("Updating password...", { id: "password" });

if (passwordData.new_password !== passwordData.confirm_password) {
  toast.error("Passwords do not match", { id: "password" });
  return;
}

try {
  const response = await fetch("http://127.0.0.1:8000/api/user/change-password/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${access}`,
    },
    body: JSON.stringify(passwordData),
  });

  const data = await response.json();

  if (data.error) {
    toast.error(data.error, { id: "password" });
    return;
  }

  toast.success("Password updated!", { id: "password" });

  setPasswordData({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });

  setTimeout(() => setShowPasswordModal(false), 1000);
} catch (error) {
  toast.error("Something went wrong", { id: "password" });
}
};


  if (loading) return <p>Loading profile...</p>;

  return (
    <div className="container mt-4">
      <h2>User Profile</h2>

      <div className="card p-4 shadow-sm" style={{ maxWidth: "500px" }}>
        <div className="text-center mb-3">
          <img
            src={
              avatarPreview ||
              "https://ui-avatars.com/api/?name=" +
                profile.first_name +
                "+" +
                profile.last_name
            }
            alt="Avatar"
            className="rounded-circle"
            width="120"
            height="120"
            style={{ objectFit: "cover" }}
          />

          <div className="mt-3">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) handleAvatarUpload(file);
              }}
            />
           <button
              className="btn btn-outline-danger mt-2"
              onClick={() => setShowDeleteModal(true)}
            >
              Delete Avatar
            </button>


          </div>
        </div>

        {/* Profile Fields */}
        <div className="mb-3">
          <label>First Name</label>
          <input
            className="form-control"
            disabled={!editMode}
            value={profile.first_name}
            onChange={(e) =>
              setProfile({ ...profile, first_name: e.target.value })
            }
          />
        </div>

        <div className="mb-3">
          <label>Last Name</label>
          <input
            className="form-control"
            disabled={!editMode}
            value={profile.last_name}
            onChange={(e) =>
              setProfile({ ...profile, last_name: e.target.value })
            }
          />
        </div>

        <div className="mb-3">
          <label>Email</label>
          <input
            className="form-control"
            disabled={!editMode}
            value={profile.email}
            onChange={(e) =>
              setProfile({ ...profile, email: e.target.value })
            }
          />
        </div>

        {/* Buttons */}
        {!editMode ? (
          <button
            className="btn btn-primary w-100"
            onClick={() => setEditMode(true)}
          >
            Edit Profile
          </button>
          
        ) : (
          <button
            className="btn btn-success w-100"
            onClick={handleProfileUpdate}
          >
            Save Changes
          </button>
        )}
        <button
          className="btn btn-warning w-100 mt-3"
          onClick={() => setShowPasswordModal(true)}
        >
          Change Password
        </button>

      </div>
      {showDeleteModal && (
  <div
    className="modal fade show"
    style={{ display: "block", background: "rgba(0,0,0,0.5)" }}
  >
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">Delete Avatar</h5>
          <button
            type="button"
            className="btn-close"
            onClick={() => setShowDeleteModal(false)}
          ></button>
        </div>

        <div className="modal-body">
          <p>Are you sure you want to delete your avatar?</p>
        </div>

        <div className="modal-footer">
          <button
            className="btn btn-secondary"
            onClick={() => setShowDeleteModal(false)}
          >
            Cancel
          </button>

          <button
            className="btn btn-danger"
            onClick={async () => {
              await handleAvatarDelete();
              setShowDeleteModal(false);
            }}
          >
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  </div>
)}

{showPasswordModal && (
  <div
    className="modal fade show"
    style={{ display: "block", background: "rgba(0,0,0,0.5)" }}
  >
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">Change Password</h5>
          <button
            type="button"
            className="btn-close"
            onClick={() => setShowPasswordModal(false)}
          ></button>
        </div>

        <div className="modal-body">
          {passwordError && (
            <div className="alert alert-danger">{passwordError}</div>
          )}
          {passwordSuccess && (
            <div className="alert alert-success">{passwordSuccess}</div>
          )}

          <div className="mb-3">
            <label>Old Password</label>
            <input
              type="password"
              className="form-control"
              value={passwordData.old_password}
              onChange={(e) =>
                setPasswordData({ ...passwordData, old_password: e.target.value })
              }
            />
          </div>

          <div className="mb-3">
            <label>New Password</label>
            <input
              type="password"
              className="form-control"
              value={passwordData.new_password}
              onChange={(e) =>
                setPasswordData({ ...passwordData, new_password: e.target.value })
              }
            />
          </div>

          <div className="mb-3">
            <label>Confirm New Password</label>
            <input
              type="password"
              className="form-control"
              value={passwordData.confirm_password}
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  confirm_password: e.target.value,
                })
              }
            />
          </div>
        </div>

        <div className="modal-footer">
          <button
            className="btn btn-secondary"
            onClick={() => setShowPasswordModal(false)}
          >
            Cancel
          </button>

          <button className="btn btn-primary" onClick={handlePasswordChange}>
            Update Password
          </button>
        </div>
      </div>
    </div>
  </div>
)}


    </div>
  );
};

export default Profile;
