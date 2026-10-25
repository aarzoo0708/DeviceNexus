import { FiX } from "react-icons/fi";
import Button from "../common/Button/Button";

function LogInteractionModal({
  customers,
  formData,
  errors,
  onClose,
  onChange,
  onSubmit,
}) {
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
              Log Customer Interaction
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Record a phone call, WhatsApp, email, or store visit note
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

        <form onSubmit={onSubmit} className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <div className="p-6 min-h-0 overflow-y-auto space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Customer *</label>
                <select
                  name="customerId"
                  className={`w-full px-4 py-2.5 text-sm rounded-xl border ${
                    errors.customerId ? "border-rose-500" : "border-slate-300 dark:border-[#334155]"
                  } bg-white dark:bg-[#0f172a] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors cursor-pointer`}
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
                {errors.customerId && (
                  <span className="text-xs text-rose-500 mt-1">{errors.customerId}</span>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Communication Channel</label>
                <select
                  name="channel"
                  className="form-control cursor-pointer"
                  value={formData.channel}
                  onChange={onChange}
                >
                  <option value="Phone Call">Phone Call</option>
                  <option value="WhatsApp">WhatsApp</option>
                  <option value="Email">Email</option>
                  <option value="Service Visit">Service Visit</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Subject / Purpose *</label>
              <input
                type="text"
                name="subject"
                className={`w-full px-4 py-2.5 text-sm rounded-xl border ${
                  errors.subject ? "border-rose-500" : "border-slate-300 dark:border-[#334155]"
                } bg-white dark:bg-[#0f172a] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors`}
                placeholder="e.g. Repair status update, Quote discussion, Follow-up call"
                value={formData.subject}
                onChange={onChange}
                required
              />
              {errors.subject && (
                <span className="text-xs text-rose-500 mt-1">{errors.subject}</span>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Discussion Notes *</label>
              <textarea
                name="notes"
                rows={3}
                className={`w-full px-4 py-2.5 text-sm rounded-xl border ${
                  errors.notes ? "border-rose-500" : "border-slate-300 dark:border-[#334155]"
                } bg-white dark:bg-[#0f172a] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors`}
                placeholder="Summarize what the customer said, agreed cost, next steps..."
                value={formData.notes}
                onChange={onChange}
                required
              />
              {errors.notes && (
                <span className="text-xs text-rose-500 mt-1">{errors.notes}</span>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Staff Member *</label>
              <input
                type="text"
                name="staff"
                className={`w-full px-4 py-2.5 text-sm rounded-xl border ${
                  errors.staff ? "border-rose-500" : "border-slate-300 dark:border-[#334155]"
                } bg-white dark:bg-[#0f172a] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors`}
                value={formData.staff}
                onChange={onChange}
                placeholder="Your name"
                required
              />
              {errors.staff && (
                <span className="text-xs text-rose-500 mt-1">{errors.staff}</span>
              )}
            </div>
          </div>

          <div className="shrink-0 px-6 py-4 bg-slate-50 dark:bg-[#111827] border-t border-slate-100 dark:border-[#334155] flex flex-wrap items-center justify-end gap-3">
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
