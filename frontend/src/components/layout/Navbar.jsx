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

const INITIAL_NOTIFICATIONS = [
  {
    id: "notif-1",
    title: "New Customer Added",
    message: "Rahul Sharma created a new customer profile.",
    time: "10m ago",
    unread: true,
    type: "customer",
  },
  {
    id: "notif-2",
    title: "New Device Registered",
    message: "MacBook Pro M2 was assigned to Priya Kapoor.",
    time: "25m ago",
    unread: true,
    type: "device",
  },
  {
    id: "notif-3",
    title: "Device Warranty Expiring",
    message: "Warranty for Dell XPS 15 (CUST-001) expires in 5 days.",
    time: "1h ago",
    unread: true,
    type: "warranty",
  },
  {
    id: "notif-4",
    title: "Device Sent for Repair",
    message: "Samsung Galaxy S23 was routed to hardware diagnostics.",
    time: "3h ago",
    unread: false,
    type: "repair",
  },
  {
    id: "notif-5",
    title: "Service Request Update",
    message: "Request #REQ-1024 status updated to 'In Progress'.",
    time: "5h ago",
    unread: false,
    type: "request",
  },
];

function Navbar({ onToggleSidebar }) {
  const location = useLocation();
  const navigate = useNavigate();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  const dropdownRef = useRef(null);
  const notificationRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setIsNotificationOpen(false);
      }
    }

    if (isProfileOpen || isNotificationOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isProfileOpen, isNotificationOpen]);

  const currentPage = pageTitles[location.pathname] || "Dashboard";
  const unreadCount = notifications.filter((n) => n.unread).length;

  const handleToggleNotifications = () => {
    setIsNotificationOpen((prev) => !prev);
    setIsProfileOpen(false);
  };

  const handleToggleProfile = () => {
    setIsProfileOpen((prev) => !prev);
    setIsNotificationOpen(false);
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  const handleDismissNotification = (id, e) => {
    e.stopPropagation();
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handleNotificationClick = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n))
    );
  };

  return (
    <header className="navbar">
      {/* LEFT */}
      <div className="navbar-left">
        <button
          className="menu-button"
          type="button"
          aria-label="Toggle sidebar"
          aria-expanded={true}
          onClick={onToggleSidebar}
        >
          ☰
        </button>

        <div className="page-title">
          <span className="breadcrumb">Workspace</span>

          <h2>{currentPage}</h2>
        </div>
      </div>

      {/* CENTER */}
      <div className="navbar-search">
        <span className="search-icon">⌕</span>

        <input
          type="text"
          placeholder="Search customers, devices, requests..."
        />

        <span className="search-shortcut">Ctrl K</span>
      </div>

      {/* RIGHT */}
      <div className="navbar-right">
        {/* NOTIFICATION MENU */}
        <div className="notification-menu-container" ref={notificationRef}>
          <button
            className={`icon-button ${isNotificationOpen ? "active" : ""}`}
            type="button"
            aria-label="Notifications"
            aria-expanded={isNotificationOpen}
            aria-haspopup="true"
            onClick={handleToggleNotifications}
          >
            🔔
            {unreadCount > 0 && <span className="notification-dot"></span>}
          </button>

          {isNotificationOpen && (
            <div className="notification-dropdown">
              <div className="notification-header">
                <div className="notification-title-area">
                  <h3>Notifications</h3>
                  {unreadCount > 0 && (
                    <span className="unread-count-pill">{unreadCount} new</span>
                  )}
                </div>

                <div className="notification-header-actions">
                  {unreadCount > 0 && (
                    <button
                      type="button"
                      className="notif-action-btn"
                      onClick={handleMarkAllAsRead}
                    >
                      Mark read
                    </button>
                  )}
                  {notifications.length > 0 && (
                    <button
                      type="button"
                      className="notif-action-btn danger"
                      onClick={handleClearAll}
                    >
                      Clear all
                    </button>
                  )}
                </div>
              </div>

              <div className="notification-list">
                {notifications.length > 0 ? (
                  notifications.map((item) => (
                    <div
                      key={item.id}
                      className={`notification-item ${
                        item.unread ? "unread" : ""
                      }`}
                      onClick={() => handleNotificationClick(item.id)}
                    >
                      <div className={`notification-icon-badge ${item.type}`}>
                        {item.type === "customer" && "👥"}
                        {item.type === "device" && "💻"}
                        {item.type === "warranty" && "⚠️"}
                        {item.type === "repair" && "🔧"}
                        {item.type === "request" && "⚡"}
                      </div>

                      <div className="notification-body">
                        <div className="notification-item-header">
                          <span className="notification-item-title">
                            {item.title}
                          </span>
                          <span className="notification-item-time">
                            {item.time}
                          </span>
                        </div>
                        <p className="notification-item-message">
                          {item.message}
                        </p>
                      </div>

                      <button
                        type="button"
                        className="notif-dismiss-btn"
                        aria-label="Dismiss notification"
                        onClick={(e) => handleDismissNotification(item.id, e)}
                      >
                        &times;
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="notification-empty-state">
                    <span className="empty-bell-icon">🔔</span>
                    <p className="empty-title">No notifications</p>
                    <p className="empty-desc">
                      You're all caught up! Check back later for updates.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* PROFILE MENU */}
        <div className="profile-menu-container" ref={dropdownRef}>
          <button
            className="user-profile"
            type="button"
            onClick={handleToggleProfile}
            aria-expanded={isProfileOpen}
            aria-haspopup="true"
          >
            <div className="user-avatar">A</div>

            <div className="user-info">
              <span className="user-name">Admin</span>

              <span className="user-role">Service Manager</span>
            </div>

            <span className="user-arrow">▾</span>
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
                  alert(
                    "Sign out will be available with authentication in a future submission."
                  );
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