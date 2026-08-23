import React from "react";
import Button from "../common/Button/Button";

function LogInteractionModal({
  customers,
  formData,
  onClose,
  onChange,
  onSubmit,
}) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-card log-modal-card"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div>
            <h2 className="modal-title">Log Customer Interaction</h2>
            <p className="modal-subtitle">
              Record a phone call, WhatsApp, or store visit note
            </p>
          </div>
          <button
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <form onSubmit={onSubmit} className="modal-body form-body">
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Customer</label>
              <select
                name="customerId"
                className="form-control"
                value={formData.customerId}
                onChange={onChange}
                required
              >
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.id})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Communication Channel</label>
              <select
                name="channel"
                className="form-control"
                value={formData.channel}
                onChange={onChange}
              >
                <option value="Phone Call">📞 Phone Call</option>
                <option value="WhatsApp">💬 WhatsApp</option>
                <option value="Email">📧 Email</option>
                <option value="Service Visit">🏢 Service Visit</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Subject / Purpose *</label>
            <input
              type="text"
              name="subject"
              className="form-control"
              placeholder="e.g. Repair status update, Quote discussion, Follow-up call"
              value={formData.subject}
              onChange={onChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Discussion Notes *</label>
            <textarea
              name="notes"
              rows={3}
              className="form-control"
              placeholder="Summarize what the customer said, agreed cost, next steps..."
              value={formData.notes}
              onChange={onChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Staff Member</label>
            <input
              type="text"
              name="staff"
              className="form-control"
              value={formData.staff}
              onChange={onChange}
              required
            />
          </div>

          <div className="modal-footer form-footer">
            <Button variant="secondary" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save Log
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LogInteractionModal;
