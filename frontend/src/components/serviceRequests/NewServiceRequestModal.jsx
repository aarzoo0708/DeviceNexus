import React, { useState } from "react";
import Button from "../common/Button/Button";
import { getCustomers, getDevices } from "../../data/mockData";
import "./NewServiceRequestModal.css";

function NewServiceRequestModal({ onClose, onSubmit }) {
  const customers = getCustomers();
  const devices = getDevices();

  const [formData, setFormData] = useState({
    customerId: customers[0]?.id || "",
    deviceId: devices[0]?.id || "",
    issue: "",
    priority: "Medium",
    assignedTo: "Sameer Verma (Sr. Technician)",
    notes: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.issue.trim()) return;

    const selectedCustomer = customers.find((c) => c.id === formData.customerId);
    const selectedDevice = devices.find((d) => d.id === formData.deviceId);

    const newRequest = {
      id: `REQ-${Math.floor(1000 + Math.random() * 9000)}`,
      customerId: formData.customerId,
      customerName: selectedCustomer?.name || "Walk-in Customer",
      customerEmail: selectedCustomer?.email || "customer@example.com",
      customerPhone: selectedCustomer?.phone || "9999999999",
      deviceId: formData.deviceId,
      deviceName: selectedDevice?.name || "Customer Device",
      deviceType: selectedDevice?.type || "Hardware",
      issue: formData.issue,
      priority: formData.priority,
      status: "New",
      assignedTo: formData.assignedTo,
      createdDate: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      estimatedCompletion: "In 3 Days",
      notes: formData.notes,
      timeline: [
        {
          step: "Created",
          date: `${new Date().toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}, ${new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`,
          note: "New service request initiated via CRM portal",
        },
      ],
    };

    onSubmit(newRequest);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card modal-card-form" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2 className="modal-title">New Service Request</h2>
            <p className="modal-subtitle">Log a new device issue or service inquiry</p>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body form-body">
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Select Customer</label>
              <select
                name="customerId"
                className="form-control"
                value={formData.customerId}
                onChange={handleChange}
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
              <label className="form-label">Select Device</label>
              <select
                name="deviceId"
                className="form-control"
                value={formData.deviceId}
                onChange={handleChange}
                required
              >
                {devices.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} — {d.type} ({d.id})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Issue Description *</label>
            <input
              type="text"
              name="issue"
              className="form-control"
              placeholder="e.g. Screen cracked, Battery not charging, Keyboard glitch"
              value={formData.issue}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Priority</label>
              <select
                name="priority"
                className="form-control"
                value={formData.priority}
                onChange={handleChange}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Assign Technician</label>
              <select
                name="assignedTo"
                className="form-control"
                value={formData.assignedTo}
                onChange={handleChange}
              >
                <option value="Sameer Verma (Sr. Technician)">Sameer Verma (Sr. Technician)</option>
                <option value="Aman Gupta (Display Specialist)">Aman Gupta (Display Specialist)</option>
                <option value="Unassigned">Unassigned</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Initial Diagnostic Notes</label>
            <textarea
              name="notes"
              rows={3}
              className="form-control"
              placeholder="Add customer symptoms, initial visual inspection..."
              value={formData.notes}
              onChange={handleChange}
            />
          </div>

          <div className="modal-footer form-footer">
            <Button variant="secondary" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Create Request
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NewServiceRequestModal;
