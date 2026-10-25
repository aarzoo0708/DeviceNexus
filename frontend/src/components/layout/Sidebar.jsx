import { NavLink } from "react-router";
import {
  FiHome,
  FiUsers,
  FiCpu,
  FiZap,
  FiShield,
  FiMessageSquare,
  FiClock,
  FiSettings,
} from "react-icons/fi";
import styles from "./Sidebar.module.css";

const menuSections = [
  {
    title: "MAIN",
    items: [
      {
        label: "Overview",
        icon: <FiHome />,
        path: "/",
      },
    ],
  },
  {
    title: "CUSTOMER MANAGEMENT",
    items: [
      {
        label: "Customers",
        icon: <FiUsers />,
        path: "/customers",
      },
      {
        label: "Devices",
        icon: <FiCpu />,
        path: "/devices",
      },
    ],
  },
  {
    title: "SERVICE OPERATIONS",
    items: [
      {
        label: "Service Requests",
        icon: <FiZap />,
        path: "/service-requests",
      },
      {
        label: "Warranty",
        icon: <FiShield />,
        path: "/warranty",
      },
    ],
  },
  {
    title: "RELATIONSHIP",
    items: [
      {
        label: "Interactions",
        icon: <FiMessageSquare />,
        path: "/interactions",
      },
      {
        label: "Follow-ups",
        icon: <FiClock />,
        path: "/follow-ups",
      },
    ],
  },
];

function Sidebar({ isCollapsed }) {
  return (
    <aside className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ""}`}>
      {/* BRAND */}
      <div className={styles.sidebarBrand}>
        <div className={styles.brandMark}>D</div>
        <div className={styles.brandDetails}>
          <h2 className={styles.brandTitle}>DeviceNexus</h2>
          <span className={styles.brandSub}>CRM PLATFORM</span>
        </div>
      </div>

      {/* NAVIGATION */}
      <nav className={styles.sidebarNavigation}>
        {menuSections.map((section) => (
          <div className={styles.menuSection} key={section.title}>
            <p className={styles.menuSectionTitle}>{section.title}</p>

            {section.items.map((item) => (
              <NavLink
                key={item.label}
                to={item.path}
                end={item.path === "/"}
                title={isCollapsed ? item.label : undefined}
                className={({ isActive }) =>
                  `${styles.menuItem} ${isActive ? styles.active : ""}`
                }
              >
                <span className={styles.menuIcon}>{item.icon}</span>
                <span className={styles.menuLabel}>{item.label}</span>
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      {/* BOTTOM */}
      <div className={styles.sidebarBottom}>
        <NavLink
          to="/settings"
          title={isCollapsed ? "Settings" : undefined}
          className={({ isActive }) =>
            `${styles.menuItem} ${isActive ? styles.active : ""}`
          }
        >
          <span className={styles.menuIcon}>
            <FiSettings />
          </span>
          <span className={styles.menuLabel}>Settings</span>
        </NavLink>

        <div className={styles.sidebarVersion}>DeviceNexus v1.0</div>
      </div>
    </aside>
  );
}

export default Sidebar;
