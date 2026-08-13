import "./ServicePipeline.css";

const statusCounts = [
  { label: "New", value: 12 },
  { label: "Assigned", value: 8 },
  { label: "In Progress", value: 6 },
  { label: "Resolved", value: 15 }
];

const requests = [
  {
    id: "#1024",
    issue: "Keyboard not working",
    device: "ASUS Vivobook",
    priority: "High",
    status: "In Progress"
  },
  {
    id: "#1023",
    issue: "Screen issue",
    device: "Dell Inspiron",
    priority: "Medium",
    status: "Assigned"
  },
  {
    id: "#1022",
    issue: "Battery replacement",
    device: "iPhone 15",
    priority: "High",
    status: "New"
  },
  {
    id: "#1021",
    issue: "Software issue",
    device: "HP Pavilion",
    priority: "Low",
    status: "Resolved"
  }
];

function ServicePipeline() {
  return (
    <section className="pipeline-card">

      {/* Header */}
      <div className="pipeline-header">

        <div>
          <p className="section-label">
            SERVICE OPERATIONS
          </p>

          <h2>Service Requests</h2>
        </div>

        <button className="view-all-button">
          View all →
        </button>

      </div>

      {/* Status Summary */}
      <div className="status-grid">

        {statusCounts.map((status) => (
          <div
            className="status-item"
            key={status.label}
          >
            <span>{status.label}</span>
            <strong>{status.value}</strong>
          </div>
        ))}

      </div>

      {/* Request List */}
      <div className="request-list">

        {requests.map((request) => (

          <div
            className="request-row"
            key={request.id}
          >

            <div className="request-id">
              {request.id}
            </div>

            <div className="request-info">

              <strong>
                {request.issue}
              </strong>

              <span>
                {request.device}
              </span>

            </div>

            <span
              className={`priority-badge ${request.priority.toLowerCase()}`}
            >
              {request.priority}
            </span>

            <span className="request-status">
              {request.status}
            </span>

          </div>

        ))}

      </div>

    </section>
  );
}

export default ServicePipeline;