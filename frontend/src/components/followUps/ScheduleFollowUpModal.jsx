import { validateText, validateTime } from "../../utils/validation";
import { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { FiX } from "react-icons/fi";
import Button from "../common/Button/Button";

const CHANNELS = [
  { id: "Phone Call", label: "Phone Call" },
  { id: "WhatsApp", label: "WhatsApp" },
  { id: "Email", label: "Email" },
  { id: "Service Visit", label: "In-Person Visit" },
];

const PRIORITIES = ["Low", "Medium", "High", "Critical"];

function ScheduleFollowUpModal({ onClose, onSubmit }) {
  const customers = useSelector((state) => state.customers || []);
  const allServiceRequests = useSelector((state) => state.serviceRequests || []);
  const allInteractions = useSelector((state) => state.interactions || []);

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
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
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
    const subjectError = validateText(formData.subject, "Subject / Purpose", 3, 120);
    if (subjectError) newErrors.subject = subjectError;
    if (!formData.dueDate) newErrors.dueDate = "Due date is required.";
    const timeError = validateTime(formData.dueTime);
    if (timeError) newErrors.dueTime = timeError;
    const notesError = validateText(formData.notes, "Agenda or notes", 3, 2000);
    if (notesError) newErrors.notes = notesError;

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
              Schedule Customer Follow-up
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Set reminders for phone callbacks, quote follow-ups, and service updates
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
            {/* Customer & Related Module */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="field-label">
                  Customer *
                </label>
                <select
                  name="customerId"
                  className="form-control cursor-pointer"
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
                  <span className="text-xs text-rose-500 mt-1 block">{errors.customerId}</span>
                )}
              </div>

              <div>
                <label className="field-label">
                  Related Module
                </label>
                <select
                  name="relatedType"
                  className="form-control cursor-pointer"
                  value={formData.relatedType}
                  onChange={handleChange}
                >
                  <option value="Service Request">Service Request</option>
                  <option value="Interaction">Interaction Log</option>
                  <option value="General">General Reminder</option>
                </select>
              </div>
            </div>

            {/* Contextual Link Dropdown */}
            {formData.relatedType === "Service Request" && (
              <div>
                <label className="field-label">
                  Select Service Request
                </label>
                <select
                  name="relatedId"
                  className="form-control cursor-pointer"
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
              <div>
                <label className="field-label">
                  Select Recent Interaction
                </label>
                <select
                  name="relatedId"
                  className="form-control cursor-pointer"
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
            <div>
              <label className="field-label">
                Follow-up Subject / Purpose *
              </label>
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
                <span className="text-xs text-rose-500 mt-1 block">{errors.subject}</span>
              )}
            </div>

            {/* Channel selector */}
            <div>
              <label className="field-label">
                Preferred Contact Channel
              </label>
              <div className="flex gap-2.5 flex-wrap">
                {CHANNELS.map((ch) => (
                  <button
                    type="button"
                    key={ch.id}
                    className={`px-3.5 py-2 text-xs rounded-xl border font-semibold cursor-pointer transition-colors ${
                      formData.channel === ch.id
                        ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                        : "bg-white dark:bg-[#0f172a] text-slate-700 dark:text-slate-300 border-slate-300 dark:border-[#334155] hover:bg-slate-50 dark:hover:bg-slate-800"
                    }`}
                    onClick={() => handleChannelSelect(ch.id)}
                  >
                    <span>{ch.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Due Date & Time */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="field-label">
                  Due Date *
                </label>
                <input
                  type="date"
                  name="dueDate"
                  className="form-control"
                  value={formData.dueDate}
                  onChange={handleChange}
                  required
                />
                {errors.dueDate && (
                  <span className="text-xs text-rose-500 mt-1 block">{errors.dueDate}</span>
                )}
              </div>

              <div>
                <label className="field-label">
                  Due Time *
                </label>
                <input
                  type="text"
                  name="dueTime"
                  className="form-control"
                  value={formData.dueTime}
                  onChange={handleChange}
                  placeholder="e.g. 11:30 AM"
                  required
                />
                {errors.dueTime && (
                  <span className="text-xs text-rose-500 mt-1 block">{errors.dueTime}</span>
                )}
              </div>
            </div>

            {/* Priority & Staff */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="field-label">
                  Priority
                </label>
                <div className="flex gap-2 flex-wrap">
                  {PRIORITIES.map((p) => (
                    <button
                      type="button"
                      key={p}
                      className={`px-3 py-1.5 text-xs rounded-xl border font-semibold cursor-pointer transition-colors ${
                        formData.priority === p
                          ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                          : "bg-white dark:bg-[#0f172a] text-slate-700 dark:text-slate-300 border-slate-300 dark:border-[#334155] hover:bg-slate-50 dark:hover:bg-slate-800"
                      }`}
                      onClick={() => handlePrioritySelect(p)}
                    >
                      <span>{p}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="field-label">
                  Assign To Staff
                </label>
                <select
                  name="assignedStaff"
                  className="form-control cursor-pointer"
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
            <div>
              <label className="field-label">
                Discussion Agenda / Notes *
              </label>
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
                <span className="text-xs text-rose-500 mt-1 block">{errors.notes}</span>
              )}
            </div>
          </div>

          <div className="shrink-0 px-6 py-4 bg-slate-50 dark:bg-[#111827] border-t border-slate-100 dark:border-[#334155] flex flex-wrap items-center justify-end gap-3">
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
