import "./Navbar.css";
import { useLocation } from "react-router";

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


        <div className="user-profile">

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

        </div>

      </div>

    </header>
  );
}

export default Navbar;