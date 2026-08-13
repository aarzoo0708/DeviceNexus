import "./QuickActions.css";

const actions = [
  {
    label: "Add Customer",
    description: "Create a new customer profile",
    icon: "+",
    type: "customer"
  },
  {
    label: "Register Device",
    description: "Add a device to a customer",
    icon: "▣",
    type: "device"
  },
  {
    label: "Create Service Request",
    description: "Open a new service request",
    icon: "⚡",
    type: "request"
  },
  {
    label: "Schedule Follow-up",
    description: "Create a customer follow-up",
    icon: "✓",
    type: "followup"
  }
];

function QuickActions() {
  return (
    <section className="quick-actions-card">

      <div className="quick-actions-header">

        <div>
          <p className="section-label">
            SHORTCUTS
          </p>

          <h2>Quick Actions</h2>
        </div>

      </div>

      <div className="actions-list">

        {actions.map((action) => (

          <button
            className="action-item"
            key={action.label}
          >

            <div className={`action-icon ${action.type}`}>
              {action.icon}
            </div>

            <div className="action-content">

              <strong>
                {action.label}
              </strong>

              <span>
                {action.description}
              </span>

            </div>

            <span className="action-arrow">
              →
            </span>

          </button>

        ))}

      </div>

    </section>
  );
}

export default QuickActions;