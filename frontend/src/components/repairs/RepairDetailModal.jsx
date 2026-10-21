import { useState } from "react";
import Badge from "../common/Badge/Badge";
import Button from "../common/Button/Button";
import { getPriorityVariant } from "./RepairTableConfig";
import "./RepairDetailModal.css";

const STATUS_OPTIONS = [
  "New",
  "Assigned",
  "In Progress",
  "Waiting for Parts",
  "Completed",
  "Cancelled",
];

function RepairDetailModal({ repair, onClose, onStatusChange, onEdit }) {
  const [selectedStatus, setSelectedStatus] = useState(repair?.status || "New");
  const [statusNote, setStatusNote] = useState("");
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  if (!repair) return null;

  const handleStatusSubmit = (e) => {
    e.preventDefault();
    if (selectedStatus === repair.status && !statusNote.trim()) return;

    setIsUpdatingStatus(true);
    onStatusChange(repair.id, selectedStatus, statusNote.trim());
    setStatusNote("");
    setTimeout(() => setIsUpdatingStatus(false), 300);
  };

  const formattedCost = typeof repair.estimatedCost === "number"
    ? `$${repair.estimatedCost.toFixed(2)}`
    : repair.estimatedCost
    ? `$${repair.estimatedCost}`
    : "$0.00";

  const formattedDate = repair.dateReceived
    ? new Date(repair.dateReceived).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-card modal-card-detail" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title-group">
            <div className="modal-req-badge">
              <span className="repair-id-badge">{repair.id}</span>
              <span className={`repair-status-pill status-${repair.status.toLowerCase().replace(/\s+/g, "-")}`}>
                <span className="status-dot" />
                {repair.status}
              </span>
              <Badge variant={getPriorityVariant(repair.priority)}>
                {repair.priority} Priority
              </Badge>
            </div>
            <h2 className="modal-title">{repair.deviceName} - {repair.issue}</h2>
          </div>

          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* Modal Content Scrollable Area */}
        <div className="detail-modal-body">
          {/* Top Info Grid: Customer & Device */}
          <div className="detail-grid-2">
            {/* Customer Box */}
            <div className="detail-box">
              <div className="detail-box-header">
                <span className="box-icon">👤</span>
                <h3>Customer Details</h3>
              </div>
              <div className="detail-field-list">
                <div className="detail-field">
                  <span className="field-label">Name</span>
                  <span className="field-value font-semibold">{repair.customerName}</span>
                </div>
                <div className="detail-field">
                  <span className="field-label">Customer ID</span>
                  <span className="field-value font-mono">{repair.customerId}</span>
                </div>
                <div className="detail-field">
                  <span className="field-label">Phone</span>
                  <span className="field-value">{repair.customerPhone || "Not provided"}</span>
                </div>
                <div className="detail-field">
                  <span className="field-label">Email</span>
                  <span className="field-value">{repair.customerEmail || "Not provided"}</span>
                </div>
              </div>
            </div>

            {/* Device Box */}
            <div className="detail-box">
              <div className="detail-box-header">
                <span className="box-icon">💻</span>
                <h3>Device Specification</h3>
              </div>
              <div className="detail-field-list">
                <div className="detail-field">
                  <span className="field-label">Device Name</span>
                  <span className="field-value font-semibold">{repair.deviceName}</span>
                </div>
                <div className="detail-field">
                  <span className="field-label">Model Specs</span>
                  <span className="field-value">{repair.deviceModel || "Standard"}</span>
                </div>
                <div className="detail-field">
                  <span className="field-label">Hardware Type</span>
                  <span className="field-value">{repair.deviceType || "Hardware"}</span>
                </div>
                <div className="detail-field">
                  <span className="field-label">Serial Number</span>
                  <span className="field-value font-mono">{repair.serialNumber || "N/A"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Repair Particulars */}
          <div className="detail-box highlight-box">
            <div className="detail-box-header">
              <span className="box-icon">🔧</span>
              <h3>Repair Information & Diagnostics</h3>
            </div>

            <div className="detail-meta-row">
              <div className="meta-item">
                <span className="meta-label">Assigned Technician</span>
                <span className="meta-value font-semibold text-primary">
                  {repair.assignedTechnician || "Unassigned"}
                </span>
              </div>

              <div className="meta-item">
                <span className="meta-label">Estimated Repair Cost</span>
                <span className="meta-value font-bold text-cost">{formattedCost}</span>
              </div>

              <div className="meta-item">
                <span className="meta-label">Date Received</span>
                <span className="meta-value">{formattedDate}</span>
              </div>

              <div className="meta-item">
                <span className="meta-label">Est. Completion</span>
                <span className="meta-value">
                  {repair.estimatedCompletion || "Subject to parts arrival"}
                </span>
              </div>
            </div>

            <div className="detail-text-block">
              <span className="field-label">Reported Customer Issue</span>
              <p className="detail-description">{repair.issue}</p>
            </div>

            <div className="detail-text-block">
              <span className="field-label">Bench Diagnostics & Technical Notes</span>
              <p className="detail-notes">{repair.notes || "No initial diagnostics recorded yet."}</p>
            </div>

            {repair.partsRequired && (
              <div className="detail-text-block">
                <span className="field-label">Anticipated / Ordered Replacement Parts</span>
                <p className="detail-parts">{repair.partsRequired}</p>
              </div>
            )}
          </div>

          {/* Interactive Status Management Bar */}
          <div className="detail-box status-management-box">
            <div className="detail-box-header">
              <span className="box-icon">⚡</span>
              <h3>Update Repair Status</h3>
            </div>

            <form onSubmit={handleStatusSubmit} className="status-update-form">
              <div className="status-update-row">
                <div className="status-select-wrapper">
                  <label htmlFor="detail-status-select" className="form-label">
                    Transition Status To
                  </label>
                  <select
                    id="detail-status-select"
                    className="form-control"
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                  >
                    {STATUS_OPTIONS.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="status-note-wrapper">
                  <label htmlFor="detail-status-note" className="form-label">
                    Add Status Note / Bench Audit Trail
                  </label>
                  <input
                    id="detail-status-note"
                    type="text"
                    className="form-control"
                    placeholder="e.g. Diagnostic complete, parts received from warehouse..."
                    value={statusNote}
                    onChange={(e) => setStatusNote(e.target.value)}
                  />
                </div>

                <div className="status-btn-wrapper">
                  <Button
                    variant="primary"
                    type="submit"
                    disabled={isUpdatingStatus || (selectedStatus === repair.status && !statusNote.trim())}
                  >
                    {isUpdatingStatus ? "Updating..." : "Update Status"}
                  </Button>
                </div>
              </div>
            </form>
          </div>

          {/* Timeline / Progress Audit Trail */}
          <div className="detail-box">
            <div className="detail-box-header">
              <span className="box-icon">🕒</span>
              <h3>Repair Audit Timeline</h3>
            </div>

            <div className="repair-timeline">
              {repair.timeline && repair.timeline.length > 0 ? (
                repair.timeline.map((event, idx) => (
                  <div key={idx} className="timeline-item">
                    <div className="timeline-marker">
                      <span className="timeline-dot" />
                    </div>
                    <div className="timeline-content">
                      <div className="timeline-header">
                        <span className={`timeline-status-pill status-${(event.status || "").toLowerCase().replace(/\s+/g, "-")}`}>
                          {event.status || "Update"}
                        </span>
                        <span className="timeline-date">{event.date}</span>
                      </div>
                      <p className="timeline-note">{event.note}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="timeline-empty">
                  No previous audit events recorded for this repair.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="modal-footer">
          <Button variant="secondary" onClick={() => onEdit(repair)}>
            Edit Repair Info
          </Button>
          <Button variant="primary" onClick={onClose}>
            Done
          </Button>
        </div>
      </div>
    </div>
  );
}

export default RepairDetailModal;
