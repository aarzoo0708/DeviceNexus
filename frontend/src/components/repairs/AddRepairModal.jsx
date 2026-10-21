import { useState, useId } from "react";
import Button from "../common/Button/Button";
import { getCustomers, getDevices } from "../../data/mockData";
import "./AddRepairModal.css";

const TECHNICIAN_OPTIONS = [
  "Sameer Verma (Sr. Technician)",
  "Aman Gupta (Display Specialist)",
  "Rohan Mehta (Chip-Level Hardware Tech)",
  "Pooja Nair (Micro-soldering & Diagnostics)",
  "Unassigned",
];

const PRIORITY_OPTIONS = ["Low", "Medium", "High", "Critical"];

let repairIdSeed = 1010;
function generateNextRepairId() {
  repairIdSeed += 1;
  return `REP-${repairIdSeed}`;
}

function AddRepairModal({ onClose, onSubmit }) {
  const customerSelectId = useId();
  const deviceSelectId = useId();
  const modelInputId = useId();
  const prioritySelectId = useId();
  const technicianSelectId = useId();
  const costInputId = useId();
  const dateInputId = useId();
  const issueInputId = useId();
  const notesInputId = useId();
  const partsInputId = useId();

  const customers = getCustomers();
  const allDevices = getDevices();

  const initialCustomerId = customers[0]?.id || "";
  const initialCustomerDevices = allDevices.filter(
    (d) => d.customer === customers[0]?.name || d.customerId === initialCustomerId
  );
  const initialDevice = initialCustomerDevices[0] || allDevices[0];

  const todayStr = new Date().toISOString().split("T")[0];

  const [formData, setFormData] = useState({
    customerId: initialCustomerId,
    deviceId: initialDevice?.id || "",
    deviceModel: initialDevice?.model || "",
    issue: "",
    priority: "Medium",
    assignedTechnician: "Sameer Verma (Sr. Technician)",
    estimatedCost: "",
    dateReceived: todayStr,
    notes: "",
    partsRequired: "",
  });

  const [errors, setErrors] = useState({});

  // Filter devices: show customer devices first, then fallback to all devices
  const customerDevices = allDevices.filter((d) => {
    const cust = customers.find((c) => c.id === formData.customerId);
    return cust && (d.customer === cust.name || d.customerId === cust.id);
  });

  const displayedDevices = customerDevices.length > 0 ? customerDevices : allDevices;

  const handleCustomerChange = (e) => {
    const custId = e.target.value;
    const cust = customers.find((c) => c.id === custId);
    const relatedDevices = allDevices.filter(
      (d) => cust && (d.customer === cust.name || d.customerId === cust.id)
    );
    const selectedDev = relatedDevices[0] || allDevices[0];

    setFormData((prev) => ({
      ...prev,
      customerId: custId,
      deviceId: selectedDev?.id || "",
      deviceModel: selectedDev?.model || prev.deviceModel,
    }));

    if (errors.customerId) {
      setErrors((prev) => ({ ...prev, customerId: "" }));
    }
  };

  const handleDeviceChange = (e) => {
    const devId = e.target.value;
    const dev = allDevices.find((d) => d.id === devId);
    setFormData((prev) => ({
      ...prev,
      deviceId: devId,
      deviceModel: dev?.model || prev.deviceModel,
    }));

    if (errors.deviceId) {
      setErrors((prev) => ({ ...prev, deviceId: "" }));
    }
  };

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

    if (!formData.customerId) newErrors.customerId = "Customer is required.";
    if (!formData.deviceId) newErrors.deviceId = "Device is required.";
    if (!formData.issue.trim()) newErrors.issue = "Reported issue description is required.";
    if (formData.estimatedCost === "" || isNaN(Number(formData.estimatedCost)) || Number(formData.estimatedCost) < 0) {
      newErrors.estimatedCost = "Please enter a valid estimated cost.";
    }
    if (!formData.dateReceived) newErrors.dateReceived = "Date received is required.";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const selectedCustomer = customers.find((c) => c.id === formData.customerId);
    const selectedDevice = allDevices.find((d) => d.id === formData.deviceId);

    const now = new Date();
    const nowFormatted = `${now.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })}, ${now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;

    const initialStatus = formData.assignedTechnician && formData.assignedTechnician !== "Unassigned"
      ? "Assigned"
      : "New";

    const newRepair = {
      id: generateNextRepairId(),
      customerId: formData.customerId,
      customerName: selectedCustomer?.name || "Customer",
      customerPhone: selectedCustomer?.phone || "9999999999",
      customerEmail: selectedCustomer?.email || "customer@example.com",
      deviceId: formData.deviceId,
      deviceName: selectedDevice?.name || "Customer Device",
      deviceModel: formData.deviceModel.trim() || selectedDevice?.model || "Hardware Model",
      deviceType: selectedDevice?.type || "Hardware",
      serialNumber: selectedDevice?.serialNumber || "SN-PENDING",
      issue: formData.issue.trim(),
      priority: formData.priority,
      status: initialStatus,
      assignedTechnician: formData.assignedTechnician,
      estimatedCost: parseFloat(formData.estimatedCost),
      dateReceived: formData.dateReceived,
      notes: formData.notes.trim() || "Intake inspection completed. Waiting for bench queue.",
      partsRequired: formData.partsRequired.trim() || "None specified at intake",
      timeline: [
        {
          status: "New",
          date: nowFormatted,
          note: `Repair logged via CRM portal for ${selectedCustomer?.name || "customer"}`,
        },
        ...(initialStatus === "Assigned"
          ? [
              {
                status: "Assigned",
                date: nowFormatted,
                note: `Assigned directly to ${formData.assignedTechnician}`,
              },
            ]
          : []),
      ],
    };

    onSubmit(newRepair);
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-card modal-card-repair" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2 className="modal-title">Log New Repair</h2>
            <p className="modal-subtitle">
              Register a hardware diagnostic ticket, assign bench staff, and estimate cost
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
          {/* Row 1: Customer & Device */}
          <div className="repair-form-row">
            <div className="form-group">
              <label htmlFor={customerSelectId} className="form-label">
                Select Customer <span className="req-star">*</span>
              </label>
              <select
                id={customerSelectId}
                name="customerId"
                className={`form-control ${errors.customerId ? "input-error" : ""}`}
                value={formData.customerId}
                onChange={handleCustomerChange}
              >
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.id}) {c.phone ? `· ${c.phone}` : ""}
                  </option>
                ))}
              </select>
              {errors.customerId && <span className="error-text">{errors.customerId}</span>}
            </div>

            <div className="form-group">
              <label htmlFor={deviceSelectId} className="form-label">
                Select Device <span className="req-star">*</span>
              </label>
              <select
                id={deviceSelectId}
                name="deviceId"
                className={`form-control ${errors.deviceId ? "input-error" : ""}`}
                value={formData.deviceId}
                onChange={handleDeviceChange}
              >
                {displayedDevices.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} ({d.id}) {d.model ? `· ${d.model}` : ""}
                  </option>
                ))}
              </select>
              {errors.deviceId && <span className="error-text">{errors.deviceId}</span>}
            </div>
          </div>

          {/* Row 2: Device Model & Priority */}
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
                placeholder="e.g. Apple M2 Max 32GB / Intel i9"
                value={formData.deviceModel}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor={prioritySelectId} className="form-label">
                Priority Level <span className="req-star">*</span>
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

          {/* Row 3: Technician & Estimated Cost */}
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
                {TECHNICIAN_OPTIONS.map((tech) => (
                  <option key={tech} value={tech}>
                    {tech}
                  </option>
                ))}
              </select>
            </div>

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
                  placeholder="0.00"
                  value={formData.estimatedCost}
                  onChange={handleChange}
                />
              </div>
              {errors.estimatedCost && <span className="error-text">{errors.estimatedCost}</span>}
            </div>
          </div>

          {/* Row 4: Date Received & Parts Required */}
          <div className="repair-form-row">
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

            <div className="form-group">
              <label htmlFor={partsInputId} className="form-label">
                Anticipated Spare Parts
              </label>
              <input
                id={partsInputId}
                type="text"
                name="partsRequired"
                className="form-control"
                placeholder="e.g. OLED Display Assembly, Battery Pack"
                value={formData.partsRequired}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Row 5: Reported Issue */}
          <div className="form-group">
            <label htmlFor={issueInputId} className="form-label">
              Reported Issue Description <span className="req-star">*</span>
            </label>
            <textarea
              id={issueInputId}
              name="issue"
              rows={3}
              className={`form-control ${errors.issue ? "input-error" : ""}`}
              placeholder="Detailed description of customer complaint, hardware malfunction, or error symptoms..."
              value={formData.issue}
              onChange={handleChange}
            />
            {errors.issue && <span className="error-text">{errors.issue}</span>}
          </div>

          {/* Row 6: Initial Diagnostic Notes */}
          <div className="form-group">
            <label htmlFor={notesInputId} className="form-label">
              Initial Bench Diagnostic / Inspection Notes
            </label>
            <textarea
              id={notesInputId}
              name="notes"
              rows={2}
              className="form-control"
              placeholder="Visual inspection details, preliminary multimeter checks, liquid damage indicators..."
              value={formData.notes}
              onChange={handleChange}
            />
          </div>

          <div className="repair-form-footer">
            <Button variant="secondary" onClick={onClose} type="button">
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Log Repair Ticket
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddRepairModal;
