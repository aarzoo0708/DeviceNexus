import React from "react";
import { useNavigate } from "react-router";

function ProfileDropdown({ user, onClose, onOpenLogin, onSignOut }) {
  const navigate = useNavigate();

  return (
    <div className="profile-dropdown">
      <div className="dropdown-header">
        <span className="dropdown-name">{user?.name || "Admin"}</span>
        <span className="dropdown-role">{user?.role || "Service Manager"}</span>
      </div>
      <div className="dropdown-divider"></div>

      <button
        className="dropdown-item"
        type="button"
        onClick={onOpenLogin}
      >
        <span className="dropdown-icon">🔑</span> Switch User / Sign In
      </button>

      <button
        className="dropdown-item"
        type="button"
        onClick={() => {
          navigate("/profile");
          onClose();
        }}
      >
        <span className="dropdown-icon">👤</span> My Profile
      </button>

      <button
        className="dropdown-item"
        type="button"
        onClick={() => {
          navigate("/settings");
          onClose();
        }}
      >
        <span className="dropdown-icon">⚙</span> Account Settings
      </button>

      <div className="dropdown-divider"></div>

      <button
        className="dropdown-item text-danger"
        type="button"
        onClick={onSignOut}
      >
        <span className="dropdown-icon">🚪</span> Sign Out
      </button>
    </div>
  );
}

export default ProfileDropdown;
