import React, { useState, useMemo } from "react";
import Button from "../common/Button/Button";
import { getCustomers, getServiceRequests, getInteractions } from "../../data/mockData";
import "./ScheduleFollowUpModal.css";

const CHANNELS = [
  { id: "Phone Call", label: "Phone Call", icon: "📞" },
  { id: "WhatsApp", label: "WhatsApp", icon: "💬" },
  { id: "Email", label: "Email", icon: "📧" },
  { id: "Service Visit", label: "In-Person Visit", icon: "🏢" },
];

const PRIORITIES = ["Low", "Medium", "High", "Critical"];

function ScheduleFollowUpModal({ onClose, onSubmit }) {
  const customers = getCustomers();
  const allServiceRequests = getServiceRequests();
  const allInteractions = getInteractions();

  // Tomorrow as default date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultDateStr = tomorrow.toISOString().split("T")[0];

  const [formData, setFormData] = useState({
    customerId: customers[0]?.id || "",
    relatedType: "Service Request",
    relatedId: "",
    subject: "",
    notes: "",
    channel: "Phone Call",
    dueDate: defaultDateStr,
    dueTime: "11:00 AM",
    priority: "Medium",
    assignedStaff: "Sameer Verma",
  });

  const [errors, setErrors] = useState({});

  // Filter requests & interactions by selected customer
  const customerRequests = useMemo(() => {
    return allServiceRequests.filter((r) => r.customerId === formData.customerId);
  }, [allServiceRequests, formData.customerId]);

  const customerInteractions = useMemo(() => {
    return allInteractions.filter((i) => i.customerId === formData.customerId);
  }, [allInteractions, formData.customerId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const next = { ...prev, [name]: value };
      if (name === "customerId") {
        next.relatedId = "";
      }
      return next;
    });
  };

  const handleChannelSelect = (channelId) => {
    setFormData((prev) => ({ ...prev, channel: channelId }));
  };

  const handlePrioritySelect = (priority) => {
    setFormData((prev) => ({ ...prev, priority }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.customerId) newErrors.customerId = "Please select a customer.";
    if (!formData.subject.trim()) newErrors.subject = "Subject / Purpose is required.";
    if (!formData.dueDate) newErrors.dueDate = "Due date is required.";
    if (!formData.dueTime) newErrors.dueTime = "Due time is required.";
    if (!formData.notes.trim()) newErrors.notes = "Agenda or notes are required.";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const selectedCustomer = customers.find((c) => c.id === formData.customerId);
    let relatedTitle = "";

    if (formData.relatedType === "Service Request" && formData.relatedId) {
      const req = allServiceRequests.find((r) => r.id === formData.relatedId);
      relatedTitle = req ? `${req.deviceName} - ${req.issue}` : formData.relatedId;
    } else if (formData.relatedType === "Interaction" && formData.relatedId) {
      const interaction = allInteractions.find((i) => i.id === formData.relatedId);
      relatedTitle = interaction ? interaction.subject : formData.relatedId;
    } else if (formData.relatedType === "General") {
      relatedTitle = "General customer reminder";
    }

    const newFollowUp = {
      id: `FLP-${Math.floor(200 + Math.random() * 800)}`,
      customerId: formData.customerId,
      customerName: selectedCustomer?.name || "Customer",
      customerPhone: selectedCustomer?.phone || "9999999999",
      customerEmail: selectedCustomer?.email || "customer@example.com",
      relatedType: formData.relatedType,
      relatedId: formData.relatedId || (formData.relatedType === "General" ? "GENERAL" : "N/A"),
      relatedTitle: relatedTitle || "Callback reminder",
      subject: formData.subject.trim(),
      notes: formData.notes.trim(),
      channel: formData.channel,
      dueDate: formData.dueDate,
      dueTime: formData.dueTime,
      priority: formData.priority,
      status: "Upcoming",
      assignedStaff: formData.assignedStaff || "Support Team",
      createdAt: new Date().toISOString().split("T")[0],
      completedAt: null,
      completionNotes: "",
    };

    onSubmit(newFollowUp);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-card modal-card-form followup-modal-card"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div>
            <h2 className="modal-title">Schedule Customer Follow-up</h2>
            <p className="modal-subtitle">
              Set reminders for phone callbacks, quote follow-ups, and service updates
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

        <form onSubmit={handleSubmit} className="modal-body form-body">
          {/* Customer Selection */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Customer *</label>
              <select
                name="customerId"
                className="form-control"
                value={formData.customerId}
                onChange={handleChange}
                required
              >
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.id}) · {c.phone}
                  </option>
                ))}
              </select>
              {errors.customerId && (
                <small style={{ color: "red", fontSize: "12px" }}>
                  {errors.customerId}
                </small>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Related Module</label>
              <select
                name="relatedType"
                className="form-control"
                value={formData.relatedType}
                onChange={handleChange}
              >
                <option value="Service Request">⚡ Service Request</option>
                <option value="Interaction">💬 Interaction Log</option>
                <option value="General">📋 General Reminder</option>
              </select>
            </div>
          </div>

          {/* Contextual Link Dropdown */}
          {formData.relatedType === "Service Request" && (
            <div className="form-group">
              <label className="form-label">Select Service Request</label>
              <select
                name="relatedId"
                className="form-control"
                value={formData.relatedId}
                onChange={handleChange}
              >
                <option value="">-- Choose relevant service request --</option>
                {customerRequests.length > 0 ? (
                  customerRequests.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.id}: {r.deviceName} - {r.issue} ({r.status})
                    </option>
                  ))
                ) : (
                  allServiceRequests.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.id} ({r.customerName}): {r.deviceName} - {r.issue}
                    </option>
                  ))
                )}
              </select>
            </div>
          )}

          {formData.relatedType === "Interaction" && (
            <div className="form-group">
              <label className="form-label">Select Recent Interaction</label>
              <select
                name="relatedId"
                className="form-control"
                value={formData.relatedId}
                onChange={handleChange}
              >
                <option value="">-- Choose logged interaction --</option>
                {customerInteractions.length > 0 ? (
                  customerInteractions.map((i) => (
                    <option key={i.id} value={i.id}>
                      {i.id}: {i.subject} ({i.channel} · {i.date})
                    </option>
                  ))
                ) : (
                  allInteractions.map((i) => (
                    <option key={i.id} value={i.id}>
                      {i.id} ({i.customerName}): {i.subject}
                    </option>
                  ))
                )}
              </select>
            </div>
          )}

          {/* Subject */}
          <div className="form-group">
            <label className="form-label">Follow-up Subject / Purpose *</label>
            <input
              type="text"
              name="subject"
              className="form-control"
              placeholder="e.g. Discuss battery replacement quote, Warranty renewal callback..."
              value={formData.subject}
              onChange={handleChange}
              required
            />
            {errors.subject && (
              <small style={{ color: "red", fontSize: "12px" }}>
                {errors.subject}
              </small>
            )}
          </div>

          {/* Channel Picker */}
          <div className="form-group">
            <label className="form-label">Contact Channel</label>
            <div className="modal-badge-picker">
              {CHANNELS.map((ch) => (
                <button
                  type="button"
                  key={ch.id}
                  className={`picker-chip ${formData.channel === ch.id ? "active" : ""}`}
                  onClick={() => handleChannelSelect(ch.id)}
                >
                  <span>{ch.icon}</span>
                  <span>{ch.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Date & Time */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Due Date *</label>
              <input
                type="date"
                name="dueDate"
                className="form-control"
                value={formData.dueDate}
                onChange={handleChange}
                required
              />
              {errors.dueDate && (
                <small style={{ color: "red", fontSize: "12px" }}>
                  {errors.dueDate}
                </small>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Due Time *</label>
              <input
                type="text"
                name="dueTime"
                className="form-control"
                placeholder="e.g. 11:30 AM, 04:00 PM"
                value={formData.dueTime}
                onChange={handleChange}
                required
              />
              {errors.dueTime && (
                <small style={{ color: "red", fontSize: "12px" }}>
                  {errors.dueTime}
                </small>
              )}
            </div>
          </div>

          {/* Priority & Staff */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Priority</label>
              <div className="modal-badge-picker">
                {PRIORITIES.map((p) => (
                  <button
                    type="button"
                    key={p}
                    className={`picker-chip ${formData.priority === p ? "active" : ""}`}
                    onClick={() => handlePrioritySelect(p)}
                  >
                    <span>{p}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Assign To Staff</label>
              <select
                name="assignedStaff"
                className="form-control"
                value={formData.assignedStaff}
                onChange={handleChange}
              >
                <option value="Sameer Verma">Sameer Verma (Sr. Tech)</option>
                <option value="Aman Gupta">Aman Gupta (Support Lead)</option>
                <option value="Support Team">General Support Desk</option>
              </select>
            </div>
          </div>

          {/* Notes */}
          <div className="form-group">
            <label className="form-label">Discussion Agenda / Notes *</label>
            <textarea
              name="notes"
              rows={3}
              className="form-control"
              placeholder="What needs to be discussed or confirmed during this follow-up?"
              value={formData.notes}
              onChange={handleChange}
              required
            />
            {errors.notes && (
              <small style={{ color: "red", fontSize: "12px" }}>
                {errors.notes}
              </small>
            )}
          </div>

          <div className="modal-footer form-footer">
            <Button variant="secondary" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Schedule Follow-up
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ScheduleFollowUpModal;
