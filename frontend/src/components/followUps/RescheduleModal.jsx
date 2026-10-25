import { validateTime } from "../../utils/validation";
import { useState } from "react";
import { FiX, FiCalendar } from "react-icons/fi";
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
    if (newTime.trim()) {
      const timeError = validateTime(newTime);
      if (timeError) {
        setError(timeError);
        return;
      }
    }
    onReschedule(followUp.id, newDate, newTime, reason);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="modal-backdrop"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg max-h-[90dvh] bg-white dark:bg-[#1e293b] rounded-2xl shadow-2xl border border-slate-200 dark:border-[#334155] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="shrink-0 px-6 py-4 border-b border-slate-100 dark:border-[#334155] flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Reschedule Follow-up
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Reschedule callback for {followUp?.customerName} ({followUp?.id})
            </p>
          </div>
          <button
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-lg transition-colors cursor-pointer"
            onClick={onClose}
            aria-label="Close"
          >
            <FiX size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <div className="p-6 min-h-0 overflow-y-auto space-y-4">
            <div className="flex items-center gap-3 p-3.5 bg-slate-50 dark:bg-[#111827] rounded-xl border border-slate-100 dark:border-[#334155]">
              <FiCalendar className="text-blue-500 text-xl shrink-0" />
              <div>
                <div className="text-sm font-semibold text-slate-900 dark:text-white">
                  Current: {followUp?.dueDate} at {followUp?.dueTime}
                </div>
                <div className="text-xs text-slate-500 truncate">
                  Subject: {followUp?.subject}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="field-label">
                  New Date *
                </label>
                <input
                  type="date"
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-[#334155] bg-white dark:bg-[#0f172a] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  value={newDate}
                  onChange={(e) => {
                    setNewDate(e.target.value);
                    setError("");
                  }}
                  required
                />
              </div>

              <div>
                <label className="field-label">
                  New Time
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-[#334155] bg-white dark:bg-[#0f172a] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value)}
                  placeholder="e.g. 03:30 PM"
                />
              </div>
            </div>

            <div>
              <label className="field-label">
                Reason for Rescheduling
              </label>
              <div className="flex gap-2 flex-wrap mb-2.5">
                {QUICK_REASONS.map((r) => (
                  <button
                    type="button"
                    key={r}
                    className={`text-xs px-3 py-1.5 rounded-xl border transition-colors cursor-pointer ${
                      reason === r
                        ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                        : "bg-white dark:bg-[#111827] text-slate-700 dark:text-slate-300 border-slate-300 dark:border-[#334155] hover:bg-slate-50 dark:hover:bg-[#334155]"
                    }`}
                    onClick={() => setReason(r)}
                  >
                    {r}
                  </button>
                ))}
              </div>
              <textarea
                rows={2}
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-[#334155] bg-white dark:bg-[#0f172a] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                placeholder="Provide context on why this follow-up was rescheduled..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </div>

            {error && (
              <span className="text-xs text-rose-500 mt-1 block">{error}</span>
            )}
          </div>

          <div className="shrink-0 px-6 py-4 bg-slate-50 dark:bg-[#111827] border-t border-slate-100 dark:border-[#334155] flex flex-wrap items-center justify-end gap-2.5">
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
