import { useState, useEffect, useRef } from "react";
import "./Navbar.css";
import { useLocation, useNavigate } from "react-router";
import { useAuth } from "../../contexts/AuthContext";
import LoginModal from "../common/LoginModal/LoginModal";
import NotificationDropdown from "./NotificationDropdown";
import ProfileDropdown from "./ProfileDropdown";
import {
  getCustomers,
  getDevices,
  getServiceRequests,
  getRepairs,
  getWarranties,
  getInteractions,
  getFollowUps,
} from "../../data/mockData";

const pageTitles = {
  "/": "Dashboard",
  "/customers": "Customers",
  "/devices": "Devices",
  "/service-requests": "Service Requests",
  "/repairs": "Repairs",
  "/warranty": "Warranty",
  "/interactions": "Interactions",
  "/follow-ups": "Follow-ups",
  "/settings": "Settings",
  "/profile": "Profile",
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

  const { user, logout } = useAuth();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [searchQuery, setSearchQuery] = useState("");
const [isSearchOpen, setIsSearchOpen] = useState(false);

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
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n)),
    );
  };

  const handleSignOut = () => {
    logout();
    setIsProfileOpen(false);
  };

  const handleOpenLogin = () => {
    setIsLoginModalOpen(true);
    setIsProfileOpen(false);
  };

  const query = searchQuery.trim().toLowerCase();

const searchResults = query
  ? [
      ...getCustomers()
        .filter((customer) =>
          [customer.id, customer.name, customer.email, customer.phone]
            .join(" ")
            .toLowerCase()
            .includes(query)
        )
        .map((customer) => ({
          id: customer.id,
          type: "Customer",
          title: customer.name,
          detail: customer.email,
          path: `/customers/${customer.id}`,
        })),

      ...getDevices()
        .filter((device) =>
          [
            device.id,
            device.name,
            device.model,
            device.customer,
            device.serialNumber,
          ]
            .join(" ")
            .toLowerCase()
            .includes(query)
        )
        .map((device) => ({
          id: device.id,
          type: "Device",
          title: device.name,
          detail: device.id,
          path: "/devices",
        })),

      ...getServiceRequests()
        .filter((request) =>
          [
            request.id,
            request.customerName,
            request.deviceName,
            request.issue,
            request.status,
          ]
            .join(" ")
            .toLowerCase()
            .includes(query)
        )
        .map((request) => ({
          id: request.id,
          type: "Service Request",
          title: request.id,
          detail: `${request.customerName} · ${request.issue}`,
          path: "/service-requests",
        })),

      ...getRepairs()
        .filter((repair) =>
          [
            repair.id,
            repair.customerName,
            repair.deviceName,
            repair.deviceModel,
            repair.issue,
            repair.status,
            repair.assignedTechnician,
          ]
            .join(" ")
            .toLowerCase()
            .includes(query)
        )
        .map((repair) => ({
          id: repair.id,
          type: "Repair",
          title: repair.id,
          detail: `${repair.customerName} · ${repair.deviceName} (${repair.status})`,
          path: "/repairs",
        })),

      ...getWarranties()
        .filter((warranty) =>
          [
            warranty.id,
            warranty.deviceName,
            warranty.customerName,
            warranty.serialNumber,
            warranty.provider,
            warranty.status,
          ]
            .join(" ")
            .toLowerCase()
            .includes(query)
        )
        .map((warranty) => ({
          id: warranty.id,
          type: "Warranty",
          title: warranty.deviceName,
          detail: warranty.id,
          path: "/warranty",
        })),

      ...getInteractions()
        .filter((interaction) =>
          [
            interaction.id,
            interaction.customerName,
            interaction.subject,
            interaction.notes,
            interaction.staff,
          ]
            .join(" ")
            .toLowerCase()
            .includes(query)
        )
        .map((interaction) => ({
          id: interaction.id,
          type: "Interaction",
          title: interaction.subject,
          detail: interaction.customerName,
          path: "/interactions",
        })),

      ...getFollowUps()
        .filter((followUp) =>
          [
            followUp.id,
            followUp.customerName,
            followUp.subject,
            followUp.notes,
            followUp.assignedStaff,
            followUp.relatedId,
          ]
            .join(" ")
            .toLowerCase()
            .includes(query)
        )
        .map((followUp) => ({
          id: followUp.id,
          type: "Follow-up",
          title: followUp.subject,
          detail: `${followUp.customerName} · ${followUp.dueDate} (${followUp.status})`,
          path: "/follow-ups",
        })),
    ].slice(0, 8)
  : [];

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : "A";

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

      <div className="navbar-search">
  <div className="navbar-search-input">
    <span aria-hidden="true">⌕</span>
    <input
      type="text"
      value={searchQuery}
      placeholder="Search customers, devices, requests..."
      aria-label="Search all records"
      aria-expanded={isSearchOpen}
      onFocus={() => setIsSearchOpen(true)}
      onChange={(event) => {
        setSearchQuery(event.target.value);
        setIsSearchOpen(true);
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          setSearchQuery("");
          setIsSearchOpen(false);
        }
      }}
    />
    {searchQuery && (
      <button
        type="button"
        aria-label="Clear search"
        onClick={() => {
          setSearchQuery("");
          setIsSearchOpen(false);
        }}
      >
        ×
      </button>
    )}
  </div>

  {isSearchOpen && searchQuery.trim() && (
    <div className="navbar-search-results">
      {searchResults.length > 0 ? (
        searchResults.map((result) => (
          <button
            type="button"
            className="navbar-search-result"
            key={`${result.type}-${result.id}`}
            onClick={() => {
              navigate(result.path);
              setSearchQuery("");
              setIsSearchOpen(false);
            }}
          >
            <span className="navbar-search-result-type">{result.type}</span>
            <strong>{result.title}</strong>
            <small>{result.detail}</small>
          </button>
        ))
      ) : (
        <p className="navbar-search-empty">No matching records found.</p>
      )}
    </div>
  )}
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
            <NotificationDropdown
              notifications={notifications}
              unreadCount={unreadCount}
              onMarkAllAsRead={handleMarkAllAsRead}
              onClearAll={handleClearAll}
              onNotificationClick={handleNotificationClick}
              onDismissNotification={handleDismissNotification}
            />
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
            <div className="user-avatar">{userInitial}</div>

            <div className="user-info">
              <span className="user-name">{user?.name || "Admin"}</span>
              <span className="user-role">
                {user?.role || "Service Manager"}
              </span>
            </div>

            <span className="user-arrow">▾</span>
          </button>

          {isProfileOpen && (
            <ProfileDropdown
              user={user}
              onClose={() => setIsProfileOpen(false)}
              onOpenLogin={handleOpenLogin}
              onSignOut={handleSignOut}
            />
          )}
        </div>
      </div>

      {/* Login / Sign In Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </header>
  );
}

export default Navbar;
