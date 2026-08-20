import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { getServiceRequests, onDataChange } from "../../data/mockData";
import "./ServicePipeline.css";

function ServicePipeline() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState(() => getServiceRequests());

  useEffect(() => {
    const updateRequests = () => setRequests(getServiceRequests());
    const unsubscribe = onDataChange(updateRequests);
    return unsubscribe;
  }, []);

  // Compute dynamic counts from real data
  const statusCounts = [
    {
      label: "New",
      value: requests.filter((r) => r.status === "New").length,
    },
    {
      label: "Assigned",
      value: requests.filter((r) => r.status === "Assigned").length,
    },
    {
      label: "In Progress",
      value: requests.filter((r) => r.status === "In Progress").length,
    },
    {
      label: "Resolved",
      value: requests.filter((r) => r.status === "Resolved").length,
    },
  ];

  // Take the most recent 4 requests
  const recentRequests = requests.slice(0, 4);

  return (
    <section className="pipeline-card">
      {/* Header */}
      <div className="pipeline-header">
        <div>
          <p className="section-label">SERVICE OPERATIONS</p>
          <h2>Service Requests</h2>
        </div>

        <button
          type="button"
          className="view-all-button"
          onClick={() => navigate("/service-requests")}
        >
          View all →
        </button>
      </div>

      {/* Status Summary Chips */}
      <div className="status-grid">
        {statusCounts.map((status) => (
          <div
            className="status-item"
            key={status.label}
            onClick={() => navigate("/service-requests")}
            style={{ cursor: "pointer" }}
            title={`View ${status.label} requests`}
          >
            <span>{status.label}</span>
            <strong>{status.value}</strong>
          </div>
        ))}
      </div>

      {/* Request List */}
      <div className="request-list">
        {recentRequests.length > 0 ? (
          recentRequests.map((request) => (
            <div
              className="request-row"
              key={request.id}
              onClick={() => navigate("/service-requests")}
              style={{ cursor: "pointer" }}
              title="Click to view in Service Requests"
            >
              <div className="request-id">{request.id}</div>

              <div className="request-info">
                <strong>{request.issue}</strong>
                <span>
                  {request.deviceName} · {request.customerName}
                </span>
              </div>

              <span
                className={`priority-badge ${request.priority?.toLowerCase() || "medium"}`}
              >
                {request.priority || "Medium"}
              </span>

              <span className="request-status">{request.status}</span>
            </div>
          ))
        ) : (
          <div style={{ padding: "16px", textAlign: "center", color: "var(--text-muted)", fontSize: "13px" }}>
            No service requests found.
          </div>
        )}
      </div>
    </section>
  );
}

export default ServicePipeline;