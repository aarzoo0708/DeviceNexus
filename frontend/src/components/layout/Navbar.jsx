import { useState, useEffect, useRef } from "react";
import "./Navbar.css";
import { useLocation, useNavigate } from "react-router";

const pageTitles = {
  "/": "Dashboard",
  "/customers": "Customers",
  "/devices": "Devices",
  "/service-requests": "Service Requests",
  "/repairs": "Repairs",
  "/warranty": "Warranty",
  "/follow-ups": "Follow-ups",
  "/interactions": "Interactions",
  "/settings": "Settings",
};

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    }
    
    if (isProfileOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isProfileOpen]);

  const currentPage =
    pageTitles[location.pathname] || "Dashboard";

  return (
    <header className="navbar">

      {/* LEFT */}
      <div className="navbar-left">

        <button
          className="menu-button"
          type="button"
          aria-label="Toggle sidebar"
        >
          ☰
        </button>

        <div className="page-title">

          <span className="breadcrumb">
            Workspace
          </span>

          <h2>{currentPage}</h2>

        </div>

      </div>


      {/* CENTER */}
      <div className="navbar-search">

        <span className="search-icon">
          ⌕
        </span>

        <input
          type="text"
          placeholder="Search customers, devices, requests..."
        />

        <span className="search-shortcut">
          Ctrl K
        </span>

      </div>


      {/* RIGHT */}
      <div className="navbar-right">

        <button
          className="icon-button"
          type="button"
          aria-label="Notifications"
        >
          🔔

          <span className="notification-dot"></span>

        </button>


        <div className="profile-menu-container" ref={dropdownRef}>
          <button 
            className="user-profile"
            type="button"
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            aria-expanded={isProfileOpen}
            aria-haspopup="true"
          >

            <div className="user-avatar">
              A
            </div>

            <div className="user-info">

              <span className="user-name">
                Admin
              </span>

              <span className="user-role">
                Service Manager
              </span>

            </div>

            <span className="user-arrow">
              ▾
            </span>

          </button>

          {isProfileOpen && (
            <div className="profile-dropdown">
              <div className="dropdown-header">
                <span className="dropdown-name">Admin</span>
                <span className="dropdown-role">Service Manager</span>
              </div>
              <div className="dropdown-divider"></div>
              <button 
                className="dropdown-item" 
                type="button"
                onClick={() => {
                  navigate("/profile");
                  setIsProfileOpen(false);
                }}
              >
                <span className="dropdown-icon">👤</span> My Profile
              </button>
              <button 
                className="dropdown-item" 
                type="button"
                onClick={() => {
                  navigate("/settings");
                  setIsProfileOpen(false);
                }}
              >
                <span className="dropdown-icon">⚙</span> Account Settings
              </button>
              <div className="dropdown-divider"></div>
              <button 
                className="dropdown-item text-danger" 
                type="button"
                onClick={() => {
                  alert("Sign out will be available with authentication in a future submission.");
                  setIsProfileOpen(false);
                }}
              >
                <span className="dropdown-icon">🚪</span> Sign Out
              </button>
            </div>
          )}
        </div>

      </div>

    </header>
  );
}

export default Navbar;