import { NavLink } from "react-router";

import "./Sidebar.css";

const menuSections = [
  {
    title: "MAIN",
    items: [
      {
        label: "Overview",
        icon: "⌂",
        path: "/",
      },
    ],
  },

  {
    title: "CUSTOMER MANAGEMENT",
    items: [
      {
        label: "Customers",
        icon: "♙",
        path: "/customers",
      },
      {
        label: "Devices",
        icon: "▣",
        path: "/devices",
      },
    ],
  },

  {
    title: "SERVICE OPERATIONS",
    items: [
      {
        label: "Service Requests",
        icon: "⚡",
        path: "/service-requests",
      },

      {
        label: "Warranty",
        icon: "◷",
        path: "/warranty",
      },
    ],
  },

  {
    title: "RELATIONSHIP",
    items: [

      {
        label: "Interactions",
        icon: "💬",
        path: "/interactions",
      },
    ],
  },
];

function Sidebar({ isCollapsed }) {
  return (
    <aside className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>

      {/* BRAND */}

      <div className="sidebar-brand">
        <div className="brand-mark">
          D
        </div>

        <div>
          <h2>DeviceNexus</h2>
          <span>CRM PLATFORM</span>
        </div>
      </div>


      {/* NAVIGATION */}

      <nav className="sidebar-navigation">

        {menuSections.map((section) => (

          <div
            className="menu-section"
            key={section.title}
          >

            <p className="menu-section-title">
              {section.title}
            </p>

            {section.items.map((item) => (

              <NavLink
                key={item.label}
                to={item.path}
                end={item.path === "/"}
                title={isCollapsed ? item.label : undefined}
                className={({ isActive }) =>
                  `menu-item ${isActive ? "active" : ""}`
                }
              >

                <span className="menu-icon">
                  {item.icon}
                </span>

                <span className="menu-label">
                  {item.label}
                </span>

              </NavLink>

            ))}

          </div>

        ))}

      </nav>


      {/* BOTTOM */}

      <div className="sidebar-bottom">

        <NavLink
          to="/settings"
          title={isCollapsed ? "Settings" : undefined}
          className={({ isActive }) =>
            `menu-item ${isActive ? "active" : ""}`
          }
        >
          <span className="menu-icon">
            ⚙
          </span>

          <span className="menu-label">
            Settings
          </span>
        </NavLink>

        <div className="sidebar-version">
          DeviceNexus v1.0
        </div>

      </div>

    </aside>
  );
}

export default Sidebar;