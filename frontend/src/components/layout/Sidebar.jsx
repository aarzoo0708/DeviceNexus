import "./Sidebar.css";

const menuSections = [
  {
    title: "MAIN",
    items: [
      { label: "Overview", icon: "⌂" }
    ]
  },

  {
    title: "CUSTOMER MANAGEMENT",
    items: [
      { label: "Customers", icon: "♙" },
      { label: "Devices", icon: "▣" }
    ]
  },

  {
    title: "SERVICE OPERATIONS",
    items: [
      { label: "Service Requests", icon: "⚡" },
      { label: "Repairs", icon: "🔧" },
      { label: "Warranty", icon: "◷" }
    ]
  },

  {
    title: "RELATIONSHIP",
    items: [
      { label: "Follow-ups", icon: "✓" },
      { label: "Interactions", icon: "💬" }
    ]
  }
];

function Sidebar() {
  return (
    <aside className="sidebar">

      <div className="brand">

        <div className="brand-icon">
          ◈
        </div>

        <div>
          <h1>DeviceNexus</h1>
          <span>Service CRM</span>
        </div>

      </div>

      <nav className="sidebar-navigation">

        {menuSections.map((section) => (

          <div
            className="menu-section"
            key={section.title}
          >

            <p className="section-title">
              {section.title}
            </p>

            {section.items.map((item) => (

              <button
                className={`menu-item ${
                  item.label === "Overview"
                    ? "active"
                    : ""
                }`}
                key={item.label}
              >

                <span className="menu-icon">
                  {item.icon}
                </span>

                <span>
                  {item.label}
                </span>

              </button>

            ))}

          </div>

        ))}

      </nav>

      <div className="sidebar-footer">

        <button className="menu-item">
          <span className="menu-icon">
            ⚙
          </span>

          Settings
        </button>

      </div>

    </aside>
  );
}

export default Sidebar;