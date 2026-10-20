import React, { useState } from "react";
import Button from "../common/Button/Button";
import Badge from "../common/Badge/Badge";

function FollowUpDetailModal({
  followUp,
  onClose,
  onMarkCompleted,
  onOpenReschedule,
}) {
  const [completeNotes, setCompleteNotes] = useState("");
  const [isCompleting, setIsCompleting] = useState(false);

  if (!followUp) return null;

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case "Completed":
        return "success";
      case "Overdue":
        return "danger";
      case "Upcoming":
      default:
        return "info";
    }
  };

  const getPriorityBadgeVariant = (priority) => {
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

  const handleCompleteSubmit = (e) => {
    e.preventDefault();
    onMarkCompleted(followUp.id, completeNotes);
    setIsCompleting(false);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-card"
        style={{ maxWidth: "600px" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
              <Badge variant={getStatusBadgeVariant(followUp.status)}>
                {followUp.status}
              </Badge>
              <Badge variant={getPriorityBadgeVariant(followUp.priority)}>
                {followUp.priority} Priority
              </Badge>
              <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                {followUp.id}
              </span>
            </div>
            <h2 className="modal-title">{followUp.subject}</h2>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        <div className="modal-body" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Customer & Contact Info Card */}
          <div
            style={{
              padding: "14px",
              background: "var(--surface-hover)",
              borderRadius: "var(--radius-md)",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "12px",
            }}
          >
            <div>
              <span style={{ fontSize: "11px", color: "var(--text-muted)", display: "block" }}>
                CUSTOMER
              </span>
              <strong style={{ fontSize: "14px", color: "var(--text-primary)" }}>
                {followUp.customerName}
              </strong>
              <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginTop: "2px" }}>
                ID: {followUp.customerId}
              </div>
            </div>

            <div>
              <span style={{ fontSize: "11px", color: "var(--text-muted)", display: "block" }}>
                CONTACT & CHANNEL
              </span>
              <div style={{ display: "flex", gap: "8px", alignItems: "center", marginTop: "2px" }}>
                <span style={{ fontSize: "13px", fontWeight: "600" }}>
                  {followUp.channel === "Phone Call" ? "📞" : followUp.channel === "WhatsApp" ? "💬" : "📧"} {followUp.customerPhone}
                </span>
              </div>
              <div style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                {followUp.customerEmail}
              </div>
            </div>
          </div>

          {/* Schedule & Staff Info */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div
              style={{
                padding: "12px",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-md)",
              }}
            >
              <span style={{ fontSize: "11px", color: "var(--text-muted)", display: "block" }}>
                DUE DATE & TIME
              </span>
              <div style={{ fontSize: "14px", fontWeight: "600", marginTop: "4px", color: followUp.status === "Overdue" ? "var(--danger)" : "var(--text-primary)" }}>
                ⏰ {followUp.dueDate} · {followUp.dueTime}
              </div>
            </div>

            <div
              style={{
                padding: "12px",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-md)",
              }}
            >
              <span style={{ fontSize: "11px", color: "var(--text-muted)", display: "block" }}>
                ASSIGNED STAFF
              </span>
              <div style={{ fontSize: "14px", fontWeight: "600", marginTop: "4px" }}>
                👤 {followUp.assignedStaff}
              </div>
            </div>
          </div>

          {/* Related Item Context */}
          <div
            style={{
              padding: "12px",
              background: "var(--primary-light)",
              borderRadius: "var(--radius-md)",
              border: "1px solid rgba(37, 99, 235, 0.15)",
            }}
          >
            <span style={{ fontSize: "11px", fontWeight: "600", color: "var(--primary)", display: "block" }}>
              LINKED TO {followUp.relatedType?.toUpperCase()} ({followUp.relatedId})
            </span>
            <div style={{ fontSize: "13px", fontWeight: "500", marginTop: "2px", color: "var(--text-primary)" }}>
              {followUp.relatedTitle}
            </div>
          </div>

          {/* Agenda & Notes */}
          <div>
            <span style={{ fontSize: "12px", fontWeight: "600", color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>
              Agenda & Instructions
            </span>
            <p
              style={{
                fontSize: "13px",
                lineHeight: "1.6",
                color: "var(--text-primary)",
                background: "var(--surface)",
                border: "1px solid var(--border)",
                padding: "10px 12px",
                borderRadius: "var(--radius-md)",
                whiteSpace: "pre-wrap",
                margin: 0,
              }}
            >
              {followUp.notes}
            </p>
          </div>

          {/* Completion Info if Completed */}
          {followUp.status === "Completed" && (
            <div
              style={{
                padding: "12px",
                background: "var(--success-light)",
                borderRadius: "var(--radius-md)",
                border: "1px solid rgba(22, 163, 74, 0.2)",
              }}
            >
              <span style={{ fontSize: "11px", fontWeight: "600", color: "var(--success-text)", display: "block" }}>
                ✓ COMPLETED ON {followUp.completedAt}
              </span>
              <div style={{ fontSize: "13px", marginTop: "4px", color: "var(--text-primary)" }}>
                {followUp.completionNotes || "Callback completed successfully."}
              </div>
            </div>
          )}

          {/* Inline Complete Box if user clicked complete */}
          {isCompleting && (
            <form onSubmit={handleCompleteSubmit} style={{ borderTop: "1px solid var(--border)", paddingTop: "12px" }}>
              <label style={{ fontSize: "12px", fontWeight: "600", display: "block", marginBottom: "6px" }}>
                Outcome / Completion Notes (Optional)
              </label>
              <textarea
                rows={2}
                className="form-control"
                placeholder="e.g. Customer approved ₹4,500 quote. Scheduled device delivery on Friday."
                value={completeNotes}
                onChange={(e) => setCompleteNotes(e.target.value)}
              />
              <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end", marginTop: "8px" }}>
                <Button variant="secondary" onClick={() => setIsCompleting(false)}>
                  Cancel
                </Button>
                <Button variant="primary" type="submit">
                  Confirm Completed
                </Button>
              </div>
            </form>
          )}
        </div>

        <div className="modal-footer" style={{ display: "flex", justifyContent: "space-between" }}>
          <div>
            {followUp.status !== "Completed" && !isCompleting && (
              <Button
                variant="secondary"
                onClick={() => {
                  onClose();
                  onOpenReschedule(followUp);
                }}
              >
                📅 Reschedule
              </Button>
            )}
          </div>

          <div style={{ display: "flex", gap: "8px" }}>
            <Button variant="secondary" onClick={onClose}>
              Close
            </Button>
            {followUp.status !== "Completed" && !isCompleting && (
              <Button variant="primary" onClick={() => setIsCompleting(true)}>
                ✓ Mark as Completed
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FollowUpDetailModal;
