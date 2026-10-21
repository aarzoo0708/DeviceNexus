import { useState, useId } from "react";
import Button from "../common/Button/Button";
import "./AddRepairModal.css";

const TECHNICIAN_OPTIONS = [
  "Sameer Verma (Sr. Technician)",
  "Aman Gupta (Display Specialist)",
  "Rohan Mehta (Chip-Level Hardware Tech)",
  "Pooja Nair (Micro-soldering & Diagnostics)",
  "Unassigned",
];

const PRIORITY_OPTIONS = ["Low", "Medium", "High", "Critical"];

const STATUS_OPTIONS = [
  "New",
  "Assigned",
  "In Progress",
  "Waiting for Parts",
  "Completed",
  "Cancelled",
];

function EditRepairModal({ repair, onClose, onSave }) {
  const modelInputId = useId();
  const prioritySelectId = useId();
  const technicianSelectId = useId();
  const statusSelectId = useId();
  const costInputId = useId();
  const dateInputId = useId();
  const completionInputId = useId();
  const partsInputId = useId();
  const issueInputId = useId();
  const notesInputId = useId();

  const [formData, setFormData] = useState({
    deviceModel: repair?.deviceModel || "",
    issue: repair?.issue || "",
    priority: repair?.priority || "Medium",
    assignedTechnician: repair?.assignedTechnician || "Unassigned",
    status: repair?.status || "New",
    estimatedCost: repair?.estimatedCost !== undefined ? String(repair.estimatedCost) : "",
    dateReceived: repair?.dateReceived || "",
    estimatedCompletion: repair?.estimatedCompletion || "",
    notes: repair?.notes || "",
    partsRequired: repair?.partsRequired || "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.issue.trim()) newErrors.issue = "Issue description is required.";
    if (formData.estimatedCost === "" || isNaN(Number(formData.estimatedCost)) || Number(formData.estimatedCost) < 0) {
      newErrors.estimatedCost = "Please enter a valid estimated cost.";
    }
    if (!formData.dateReceived) newErrors.dateReceived = "Date received is required.";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const statusChanged = formData.status !== repair.status;
    let updatedTimeline = repair.timeline ? [...repair.timeline] : [];

    if (statusChanged) {
      const now = new Date();
      const nowStr = `${now.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })}, ${now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;

      updatedTimeline = [
        {
          status: formData.status,
          date: nowStr,
          note: `Status updated to ${formData.status} during record edit`,
        },
        ...updatedTimeline,
      ];
    }

    const updatedRepair = {
      ...repair,
      deviceModel: formData.deviceModel.trim(),
      issue: formData.issue.trim(),
      priority: formData.priority,
      assignedTechnician: formData.assignedTechnician,
      status: formData.status,
      estimatedCost: parseFloat(formData.estimatedCost),
      dateReceived: formData.dateReceived,
      estimatedCompletion: formData.estimatedCompletion.trim(),
      notes: formData.notes.trim(),
      partsRequired: formData.partsRequired.trim(),
      timeline: updatedTimeline,
    };

    onSave(updatedRepair);
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-card modal-card-repair" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2 className="modal-title">Edit Repair - {repair.id}</h2>
            <p className="modal-subtitle">
              Modify device diagnostic notes, technician assignment, and estimated costs
            </p>
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

        <form onSubmit={handleSubmit} className="repair-form-body">
          {/* Readonly info header banner */}
          <div className="repair-form-row">
            <div className="form-group">
              <span className="form-label">Customer</span>
              <div className="form-control" style={{ background: "var(--surface-hover)", cursor: "not-allowed" }}>
                <strong>{repair.customerName}</strong> ({repair.customerId})
              </div>
            </div>

            <div className="form-group">
              <span className="form-label">Registered Device</span>
              <div className="form-control" style={{ background: "var(--surface-hover)", cursor: "not-allowed" }}>
                <strong>{repair.deviceName}</strong> ({repair.deviceId})
              </div>
            </div>
          </div>

          {/* Row 2: Model & Priority */}
          <div className="repair-form-row">
            <div className="form-group">
              <label htmlFor={modelInputId} className="form-label">
                Device Model Specification
              </label>
              <input
                id={modelInputId}
                type="text"
                name="deviceModel"
                className="form-control"
                value={formData.deviceModel}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor={prioritySelectId} className="form-label">
                Priority Level
              </label>
              <select
                id={prioritySelectId}
                name="priority"
                className="form-control"
                value={formData.priority}
                onChange={handleChange}
              >
                {PRIORITY_OPTIONS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 3: Technician & Status */}
          <div className="repair-form-row">
            <div className="form-group">
              <label htmlFor={technicianSelectId} className="form-label">
                Assigned Technician
              </label>
              <select
                id={technicianSelectId}
                name="assignedTechnician"
                className="form-control"
                value={formData.assignedTechnician}
                onChange={handleChange}
              >
                {TECHNICIAN_OPTIONS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor={statusSelectId} className="form-label">
                Repair Status
              </label>
              <select
                id={statusSelectId}
                name="status"
                className="form-control"
                value={formData.status}
                onChange={handleChange}
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 4: Cost & Date */}
          <div className="repair-form-row">
            <div className="form-group">
              <label htmlFor={costInputId} className="form-label">
                Estimated Cost ($ USD) <span className="req-star">*</span>
              </label>
              <div className="input-currency-wrapper">
                <span className="currency-prefix">$</span>
                <input
                  id={costInputId}
                  type="number"
                  step="0.01"
                  min="0"
                  name="estimatedCost"
                  className={`form-control with-prefix ${errors.estimatedCost ? "input-error" : ""}`}
                  value={formData.estimatedCost}
                  onChange={handleChange}
                />
              </div>
              {errors.estimatedCost && <span className="error-text">{errors.estimatedCost}</span>}
            </div>

            <div className="form-group">
              <label htmlFor={dateInputId} className="form-label">
                Date Received <span className="req-star">*</span>
              </label>
              <input
                id={dateInputId}
                type="date"
                name="dateReceived"
                className={`form-control ${errors.dateReceived ? "input-error" : ""}`}
                value={formData.dateReceived}
                onChange={handleChange}
              />
              {errors.dateReceived && <span className="error-text">{errors.dateReceived}</span>}
            </div>
          </div>

          {/* Row 5: Est Completion & Spare Parts */}
          <div className="repair-form-row">
            <div className="form-group">
              <label htmlFor={completionInputId} className="form-label">
                Estimated Completion Target
              </label>
              <input
                id={completionInputId}
                type="text"
                name="estimatedCompletion"
                className="form-control"
                placeholder="e.g. 2026-10-25 or In 3 Days"
                value={formData.estimatedCompletion}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor={partsInputId} className="form-label">
                Anticipated Spare Parts
              </label>
              <input
                id={partsInputId}
                type="text"
                name="partsRequired"
                className="form-control"
                value={formData.partsRequired}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Row 6: Issue Description */}
          <div className="form-group">
            <label htmlFor={issueInputId} className="form-label">
              Reported Issue Description <span className="req-star">*</span>
            </label>
            <textarea
              id={issueInputId}
              name="issue"
              rows={3}
              className={`form-control ${errors.issue ? "input-error" : ""}`}
              value={formData.issue}
              onChange={handleChange}
            />
            {errors.issue && <span className="error-text">{errors.issue}</span>}
          </div>

          {/* Row 7: Diagnostic Notes */}
          <div className="form-group">
            <label htmlFor={notesInputId} className="form-label">
              Technician Bench Diagnostics & Repair Notes
            </label>
            <textarea
              id={notesInputId}
              name="notes"
              rows={3}
              className="form-control"
              value={formData.notes}
              onChange={handleChange}
            />
          </div>

          <div className="repair-form-footer">
            <Button variant="secondary" onClick={onClose} type="button">
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditRepairModal;
