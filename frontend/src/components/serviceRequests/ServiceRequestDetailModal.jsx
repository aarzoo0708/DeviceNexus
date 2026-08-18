import React from "react";
import Badge from "../common/Badge/Badge";
import Button from "../common/Button/Button";
import "./ServiceRequestDetailModal.css";

function ServiceRequestDetailModal({ request, onClose, onStatusChange }) {
  if (!request) return null;

  const getPriorityVariant = (priority) => {
    switch (priority) {
      case "Critical":
        return "danger";
      case "High":
        return "warning";
      case "Medium":
        return "info";
      default:
        return "default";
    }
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case "Resolved":
        return "success";
      case "In Progress":
        return "info";
      case "Assigned":
        return "warning";
      case "New":
        return "default";
      case "On Hold":
        return "danger";
      default:
        return "default";
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title-group">
            <div className="modal-req-badge">
              <span className="req-id">{request.id}</span>
              <Badge variant={getStatusVariant(request.status)}>
                {request.status}
              </Badge>
              <Badge variant={getPriorityVariant(request.priority)}>
                {request.priority} Priority
              </Badge>
            </div>
            <h2 className="modal-title">{request.issue}</h2>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        {/* Content Body */}
        <div className="modal-body">
          {/* Quick Info Grid */}
          <div className="info-grid">
            <div className="info-box">
              <span className="info-label">Customer</span>
              <span className="info-value">{request.customerName}</span>
              <span className="info-subtext">{request.customerPhone}</span>
            </div>

            <div className="info-box">
              <span className="info-label">Device</span>
              <span className="info-value">{request.deviceName}</span>
              <span className="info-subtext">{request.deviceType} ({request.deviceId})</span>
            </div>

            <div className="info-box">
              <span className="info-label">Assigned Technician</span>
              <span className="info-value">{request.assignedTo || "Unassigned"}</span>
              <span className="info-subtext">Est. Completion: {request.estimatedCompletion || "TBD"}</span>
            </div>

            <div className="info-box">
              <span className="info-label">Created Date</span>
              <span className="info-value">{request.createdDate}</span>
              <span className="info-subtext">Customer ID: {request.customerId}</span>
            </div>
          </div>

          {/* Notes & Diagnostics */}
          <div className="section-block">
            <h4 className="section-heading">Diagnostic Notes</h4>
            <p className="notes-text">
              {request.notes || "No technician notes recorded yet."}
            </p>
          </div>

          {/* Activity Timeline */}
          {request.timeline && request.timeline.length > 0 && (
            <div className="section-block">
              <h4 className="section-heading">Activity Timeline</h4>
              <div className="timeline-list">
                {request.timeline.map((item, idx) => (
                  <div key={idx} className="timeline-item">
                    <div className="timeline-marker" />
                    <div className="timeline-content">
                      <div className="timeline-header">
                        <span className="timeline-step">{item.step}</span>
                        <span className="timeline-date">{item.date}</span>
                      </div>
                      <p className="timeline-note">{item.note}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Status Quick Update */}
          <div className="section-block status-update-bar">
            <span className="status-label">Update Status:</span>
            <div className="status-button-group">
              {["New", "Assigned", "In Progress", "Resolved", "On Hold"].map(
                (statusOption) => (
                  <button
                    key={statusOption}
                    type="button"
                    className={`status-btn ${
                      request.status === statusOption ? "active" : ""
                    }`}
                    onClick={() => onStatusChange(request.id, statusOption)}
                  >
                    {statusOption}
                  </button>
                )
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ServiceRequestDetailModal;
