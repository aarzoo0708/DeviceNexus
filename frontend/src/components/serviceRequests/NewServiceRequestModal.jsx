import { validateText } from "../../utils/validation";
import { useState } from "react";
import { useSelector } from "react-redux";
import { FiX } from "react-icons/fi";
import Button from "../common/Button/Button";

function NewServiceRequestModal({ onClose, onSubmit }) {
  const customers = useSelector((state) => state.customers || []);
  const devices = useSelector((state) => state.devices || []);

  const initialCustomerId = customers[0]?.id || "";
  const initialCustomerDevices = devices.filter(
    (d) => d.customerId === initialCustomerId
  );

  const [formData, setFormData] = useState({
    customerId: initialCustomerId,
    deviceId: initialCustomerDevices[0]?.id || "",
    issue: "",
    priority: "Medium",
    assignedTo: "Sameer Verma",
    notes: "",
  });

  const [errors, setErrors] = useState({});

  const availableDevices = devices.filter(
    (d) => d.customerId === formData.customerId
  );

  const handleCustomerChange = (e) => {
    const newCustId = e.target.value;
    const matchingDevices = devices.filter((d) => d.customerId === newCustId);
    setFormData((prev) => ({
      ...prev,
      customerId: newCustId,
      deviceId: matchingDevices[0]?.id || "",
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.customerId) newErrors.customerId = "Please select a customer.";
    if (!formData.deviceId) newErrors.deviceId = "Please select a device for this customer.";
    const issueError = validateText(formData.issue, "Issue description", 3, 300);
    if (issueError) newErrors.issue = issueError;

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const nextRandom = Math.floor(1000 + Math.random() * 9000);
    const now = new Date();
    const dateStr = now.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    const newRequest = {
      id: `REQ-${nextRandom}`,
      customerId: formData.customerId,
      deviceId: formData.deviceId,
      issue: formData.issue.trim(),
      priority: formData.priority,
      status: "New",
      assignedTo: formData.assignedTo || "Unassigned",
      createdDate: dateStr,
      estimatedCompletion: "In 3 Days",
      notes: formData.notes.trim(),
      timeline: [
        {
          step: "New",
          date: `${dateStr}, ${now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`,
          note: "New service request logged in CRM",
        },
      ],
    };

    onSubmit(newRequest);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="modal-backdrop"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl max-h-[90dvh] bg-white dark:bg-[#1e293b] rounded-2xl shadow-2xl border border-slate-200 dark:border-[#334155] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="shrink-0 px-6 py-4 border-b border-slate-100 dark:border-[#334155] flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              New Service Request
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Log a device issue or repair ticket for a customer
            </p>
          </div>
          <button
            type="button"
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-lg transition-colors cursor-pointer"
            onClick={onClose}
            aria-label="Close"
          >
            <FiX size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <div className="p-6 min-h-0 overflow-y-auto space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="field-label">
                  Select Customer *
                </label>
                <select
                  name="customerId"
                  className="form-control cursor-pointer"
                  value={formData.customerId}
                  onChange={handleCustomerChange}
                  required
                >
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.id})
                    </option>
                  ))}
                </select>
                {errors.customerId && (
                  <small className="text-xs text-rose-500 mt-1 block">
                    {errors.customerId}
                  </small>
                )}
              </div>

              <div>
                <label className="field-label">
                  Select Customer's Device *
                </label>
                <select
                  name="deviceId"
                  className="form-control cursor-pointer"
                  value={formData.deviceId}
                  onChange={handleChange}
                  required
                >
                  {availableDevices.length > 0 ? (
                    availableDevices.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name} ({d.id})
                      </option>
                    ))
                  ) : (
                    <option value="">No devices registered for this customer</option>
                  )}
                </select>
                {errors.deviceId && (
                  <small className="text-xs text-rose-500 mt-1 block">
                    {errors.deviceId}
                  </small>
                )}
              </div>
            </div>

            <div>
              <label className="field-label">
                Issue Description *
              </label>
              <input
                type="text"
                name="issue"
                className="form-control"
                placeholder="e.g. Battery drains rapidly, Screen cracked, Keyboard keys sticking"
                value={formData.issue}
                onChange={handleChange}
                required
              />
              {errors.issue && (
                <small className="text-xs text-rose-500 mt-1 block">
                  {errors.issue}
                </small>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="field-label">
                  Priority
                </label>
                <select
                  name="priority"
                  className="form-control cursor-pointer"
                  value={formData.priority}
                  onChange={handleChange}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>

              <div>
                <label className="field-label">
                  Assigned Technician
                </label>
                <select
                  name="assignedTo"
                  className="form-control cursor-pointer"
                  value={formData.assignedTo}
                  onChange={handleChange}
                >
                  <option value="Sameer Verma">Sameer Verma (Sr. Technician)</option>
                  <option value="Aman Gupta">Aman Gupta (Display Specialist)</option>
                  <option value="Unassigned">Unassigned / Front Desk</option>
                </select>
              </div>
            </div>

            <div>
              <label className="field-label">
                Initial Diagnosis Notes
              </label>
              <textarea
                name="notes"
                rows={3}
                className="form-control"
                placeholder="Describe physical condition, customer statements, or diagnostic steps taken..."
                value={formData.notes}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="shrink-0 px-6 py-4 bg-slate-50 dark:bg-[#111827] border-t border-slate-100 dark:border-[#334155] flex flex-wrap items-center justify-end gap-3">
            <Button variant="secondary" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Create Ticket</Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NewServiceRequestModal;
