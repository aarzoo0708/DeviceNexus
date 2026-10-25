import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { FiMenu, FiSearch, FiBell, FiChevronDown, FiX } from "react-icons/fi";
import { useAuth } from "../../contexts/AuthContext";
import LoginModal from "../common/LoginModal/LoginModal";
import NotificationDropdown from "./NotificationDropdown";
import ProfileDropdown from "./ProfileDropdown";
import styles from "./Navbar.module.css";

const pageTitles = {
  "/": "Dashboard",
  "/customers": "Customers",
  "/customers/add": "Add Customer",
  "/devices": "Devices",
  "/service-requests": "Service Requests",
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

  // Read data from Redux store for global omnisearch
  const customers = useSelector((state) => state.customers);
  const devices = useSelector((state) => state.devices);
  const serviceRequests = useSelector((state) => state.serviceRequests);
  const warranties = useSelector((state) => state.warranties);
  const interactions = useSelector((state) => state.interactions);
  const followUps = useSelector((state) => state.followUps);

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

  const currentPage =
    pageTitles[location.pathname] ||
    (location.pathname.startsWith("/customers/")
      ? "Customer Details"
      : "Dashboard");

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

  const handleSignOut = () => {
    logout();
    setIsProfileOpen(false);
  };

  const handleOpenLogin = () => {
    setIsLoginModalOpen(true);
    setIsProfileOpen(false);
  };

  const query = searchQuery.trim().toLowerCase();

  // Search across Redux business entities
  const searchResults = query
    ? [
        ...customers
          .filter((c) =>
            [c.id, c.name, c.email, c.phone].join(" ").toLowerCase().includes(query)
          )
          .map((c) => ({
            id: c.id,
            type: "Customer",
            title: c.name,
            detail: `${c.id} · ${c.email}`,
            path: `/customers/${c.id}`,
          })),

        ...devices
          .filter((d) =>
            [d.id, d.name, d.model, d.serialNumber].join(" ").toLowerCase().includes(query)
          )
          .map((d) => ({
            id: d.id,
            type: "Device",
            title: d.name,
            detail: `${d.id} · ${d.model}`,
            path: "/devices",
          })),

        ...serviceRequests
          .filter((r) =>
            [r.id, r.issue, r.status, r.customerName || ""]
              .join(" ")
              .toLowerCase()
              .includes(query)
          )
          .map((r) => ({
            id: r.id,
            type: "Service Request",
            title: r.id,
            detail: `${r.issue} (${r.status})`,
            path: "/service-requests",
          })),

        ...warranties
          .filter((w) =>
            [w.id, w.warrantyType, w.provider, w.serialNumber]
              .join(" ")
              .toLowerCase()
              .includes(query)
          )
          .map((w) => ({
            id: w.id,
            type: "Warranty",
            title: w.id,
            detail: `${w.warrantyType} · ${w.provider}`,
            path: "/warranty",
          })),

        ...interactions
          .filter((i) =>
            [i.id, i.subject, i.notes, i.staff].join(" ").toLowerCase().includes(query)
          )
          .map((i) => ({
            id: i.id,
            type: "Interaction",
            title: i.subject,
            detail: `${i.channel} · ${i.staff}`,
            path: "/interactions",
          })),

        ...followUps
          .filter((f) =>
            [f.id, f.subject, f.notes, f.assignedStaff]
              .join(" ")
              .toLowerCase()
              .includes(query)
          )
          .map((f) => ({
            id: f.id,
            type: "Follow-up",
            title: f.subject,
            detail: `Due: ${f.dueDate} (${f.status})`,
            path: "/follow-ups",
          })),
      ].slice(0, 8)
    : [];

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : "A";

  return (
    <header className={styles.navbar}>
      {/* LEFT: Mobile toggle & title */}
      <div className={styles.navbarLeft}>
        <button
          className={styles.menuButton}
          type="button"
          aria-label="Toggle sidebar"
          onClick={onToggleSidebar}
        >
          <FiMenu size={20} />
        </button>

        <div className={styles.pageTitle}>
          <span className={styles.breadcrumb}>Workspace</span>
          <h2>{currentPage}</h2>
        </div>
      </div>

      {/* CENTER: Omnisearch */}
      <div className={styles.navbarSearch}>
        <div className={styles.navbarSearchInput}>
          <span aria-hidden="true">
            <FiSearch />
          </span>
          <input
            type="text"
            value={searchQuery}
            placeholder="Search customers, devices, requests..."
            aria-label="Search all records"
            onFocus={() => setIsSearchOpen(true)}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsSearchOpen(true);
            }}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
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
              <FiX />
            </button>
          )}
        </div>

        {isSearchOpen && searchQuery.trim() && (
          <div className={styles.navbarSearchResults}>
            {searchResults.length > 0 ? (
              searchResults.map((result) => (
                <button
                  type="button"
                  className={styles.navbarSearchResult}
                  key={`${result.type}-${result.id}`}
                  onClick={() => {
                    navigate(result.path);
                    setSearchQuery("");
                    setIsSearchOpen(false);
                  }}
                >
                  <span className={styles.navbarSearchResultType}>{result.type}</span>
                  <strong>{result.title}</strong>
                  <small>{result.detail}</small>
                </button>
              ))
            ) : (
              <p className={styles.navbarSearchEmpty}>No matching records found.</p>
            )}
          </div>
        )}
      </div>

      {/* RIGHT: Notifications & User profile */}
      <div className={styles.navbarRight}>
        {/* Notification Icon */}
        <div className={styles.notificationMenuContainer} ref={notificationRef}>
          <button
            className={`${styles.iconButton} ${
              isNotificationOpen ? styles.active : ""
            }`}
            type="button"
            aria-label="Notifications"
            onClick={handleToggleNotifications}
          >
            <FiBell size={18} />
            {unreadCount > 0 && <span className={styles.notificationDot} />}
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

        {/* Profile Dropdown */}
        <div className={styles.profileMenuContainer} ref={dropdownRef}>
          <button
            className={styles.userProfile}
            type="button"
            onClick={handleToggleProfile}
          >
            <div className={styles.userAvatar}>{userInitial}</div>
            <div className={styles.userInfo}>
              <span className={styles.userName}>{user?.name || "Admin"}</span>
              <span className={styles.userRole}>
                {user?.role || "Service Manager"}
              </span>
            </div>
            <span className={styles.userArrow}>
              <FiChevronDown size={14} />
            </span>
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

      {/* Demo User Switch Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </header>
  );
}

export default Navbar;
