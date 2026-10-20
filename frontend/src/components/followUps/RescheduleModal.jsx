import React, { useState } from "react";
import Button from "../common/Button/Button";

const QUICK_REASONS = [
  "Customer requested callback later",
  "Customer unreachable / line busy",
  "Awaiting parts delivery",
  "Technical diagnosis in progress",
  "Scheduled for post-service check",
];

function RescheduleModal({ followUp, onClose, onReschedule }) {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultDateStr = tomorrow.toISOString().split("T")[0];

  const [newDate, setNewDate] = useState(defaultDateStr);
  const [newTime, setNewTime] = useState(followUp?.dueTime || "11:30 AM");
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newDate) {
      setError("Please pick a new date.");
      return;
    }
    onReschedule(followUp.id, newDate, newTime, reason);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-card modal-card-form"
        style={{ maxWidth: "520px" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div>
            <h2 className="modal-title">Reschedule Follow-up</h2>
            <p className="modal-subtitle">
              Reschedule callback for {followUp?.customerName} ({followUp?.id})
            </p>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body form-body">
          <div className="related-preview-box">
            <span className="related-preview-icon">📅</span>
            <div>
              <strong>Current Schedule:</strong> {followUp?.dueDate} at {followUp?.dueTime}
              <div style={{ color: "var(--text-muted)", fontSize: "11px" }}>
                Subject: {followUp?.subject}
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">New Date *</label>
              <input
                type="date"
                className="form-control"
                value={newDate}
                onChange={(e) => {
                  setNewDate(e.target.value);
                  setError("");
                }}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">New Time</label>
              <input
                type="text"
                className="form-control"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                placeholder="e.g. 03:30 PM"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Reason for Rescheduling</label>
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "8px" }}>
              {QUICK_REASONS.map((r) => (
                <button
                  type="button"
                  key={r}
                  className={`picker-chip ${reason === r ? "active" : ""}`}
                  style={{ fontSize: "11px", padding: "4px 8px" }}
                  onClick={() => setReason(r)}
                >
                  {r}
                </button>
              ))}
            </div>
            <textarea
              rows={2}
              className="form-control"
              placeholder="Provide context on why this follow-up was rescheduled..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>

          {error && (
            <small style={{ color: "red", fontSize: "12px" }}>{error}</small>
          )}

          <div className="modal-footer form-footer">
            <Button variant="secondary" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Confirm Reschedule
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RescheduleModal;
