import React, { useEffect, useState } from "react";

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
    try {
      const formData = new FormData();
      formData.append("avatar", file);

      const response = await fetch("http://127.0.0.1:8000/api/user/avatar/", {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${access}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (data.avatar_url) {
        const fullUrl = `http://127.0.0.1:8000${data.avatar_url}`;
        setAvatarPreview(fullUrl);

        // Update profile state
        setProfile((prev) => ({
          ...prev,
          avatar_url: data.avatar_url,
        }));
      }
    } catch (error) {
      console.error("Avatar upload failed:", error);
    }
  };

  // -----------------------------
  // Profile Update (Name/Email)
  // -----------------------------
  const handleProfileUpdate = async () => {
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
    } catch (error) {
      console.error("Profile update failed:", error);
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
      </div>
    </div>
  );
};

export default Profile;
