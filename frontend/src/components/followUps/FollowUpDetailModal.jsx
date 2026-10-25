import { useState } from "react";
import { useSelector } from "react-redux";
import {
  FiX,
  FiCalendar,
  FiCheck,
  FiClock,
  FiUser,
  FiPhone,
  FiMessageSquare,
  FiMail,
} from "react-icons/fi";
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
  const customers = useSelector((state) => state.customers || []);

  if (!followUp) return null;

  const customer = customers.find((c) => c.id === followUp.customerId);
  const customerName = customer ? customer.name : followUp.customerName || "Customer";
  const customerPhone = customer ? customer.phone : followUp.customerPhone || "N/A";
  const customerEmail = customer ? customer.email : followUp.customerEmail || "N/A";

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

  const getChannelIcon = (channel) => {
    switch (channel) {
      case "Phone Call":
        return <FiPhone className="inline text-blue-500" />;
      case "WhatsApp":
        return <FiMessageSquare className="inline text-emerald-500" />;
      case "Email":
        return <FiMail className="inline text-purple-500" />;
      default:
        return <FiMessageSquare className="inline" />;
    }
  };

  const handleCompleteSubmit = (e) => {
    e.preventDefault();
    onMarkCompleted(followUp.id, completeNotes);
    setIsCompleting(false);
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
        <div className="px-6 py-5 border-b border-slate-100 dark:border-[#334155] flex items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant={getStatusBadgeVariant(followUp.status)}>
                {followUp.status}
              </Badge>
              <Badge variant={getPriorityBadgeVariant(followUp.priority)}>
                {followUp.priority} Priority
              </Badge>
              <span className="font-mono text-xs text-slate-400">
                {followUp.id}
              </span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white leading-snug">
              {followUp.subject}
            </h2>
          </div>
          <button
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-lg transition-colors cursor-pointer shrink-0"
            onClick={onClose}
            aria-label="Close"
          >
            <FiX size={18} />
          </button>
        </div>

        <div className="p-6 min-h-0 overflow-y-auto space-y-4">
          {/* Customer & Contact Info Card */}
          <div className="p-4 bg-slate-50 dark:bg-[#111827] rounded-xl border border-slate-100 dark:border-[#334155] grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <span className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                CUSTOMER
              </span>
              <strong className="block text-sm font-semibold text-slate-900 dark:text-white mt-1">
                {customerName}
              </strong>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                ID: {followUp.customerId}
              </div>
            </div>

            <div>
              <span className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                CONTACT & CHANNEL
              </span>
              <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 mt-1">
                {getChannelIcon(followUp.channel)} {customerPhone}
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {customerEmail}
              </div>
            </div>
          </div>

          {/* Schedule & Staff Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="p-4 bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#334155] rounded-xl">
              <span className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                DUE DATE & TIME
              </span>
              <div
                className={`text-sm font-semibold mt-1.5 flex items-center gap-1.5 ${
                  followUp.status === "Overdue"
                    ? "text-rose-600 dark:text-rose-400"
                    : "text-slate-900 dark:text-white"
                }`}
              >
                <FiClock className="inline" /> {followUp.dueDate} · {followUp.dueTime}
              </div>
            </div>

            <div className="p-4 bg-white dark:bg-[#111827] border border-slate-200 dark:border-[#334155] rounded-xl">
              <span className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                ASSIGNED STAFF
              </span>
              <div className="text-sm font-semibold text-slate-900 dark:text-white mt-1.5 flex items-center gap-1.5">
                <FiUser className="inline" /> {followUp.assignedStaff}
              </div>
            </div>
          </div>

          {/* Related Item Context */}
          <div className="p-3.5 bg-blue-50 dark:bg-blue-950/40 rounded-xl border border-blue-100 dark:border-blue-900/50">
            <span className="block text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              LINKED TO {followUp.relatedType?.toUpperCase()} ({followUp.relatedId})
            </span>
            <div className="text-xs font-medium text-slate-900 dark:text-white mt-1">
              {followUp.relatedTitle}
            </div>
          </div>

          {/* Agenda & Notes */}
          <div className="space-y-1.5">
            <span className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              Agenda & Instructions
            </span>
            <p className="text-xs text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-[#111827] border border-slate-100 dark:border-[#334155] p-3.5 rounded-xl whitespace-pre-wrap leading-relaxed">
              {followUp.notes}
            </p>
          </div>

          {/* Completion Info if Completed */}
          {followUp.status === "Completed" && (
            <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-100 dark:border-emerald-900/50 space-y-1">
              <span className="block text-[11px] font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider">
                COMPLETED ON {followUp.completedAt}
              </span>
              <div className="text-xs text-slate-900 dark:text-white">
                {followUp.completionNotes || "Callback completed successfully."}
              </div>
            </div>
          )}

          {/* Inline Complete Box if user clicked complete */}
          {isCompleting && (
            <form onSubmit={handleCompleteSubmit} className="pt-3 border-t border-slate-100 dark:border-[#334155] space-y-2.5">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Outcome / Completion Notes (Optional)
              </label>
              <textarea
                rows={2}
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-[#334155] bg-white dark:bg-[#0f172a] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                placeholder="e.g. Customer approved ₹4,500 quote. Scheduled device delivery on Friday."
                value={completeNotes}
                onChange={(e) => setCompleteNotes(e.target.value)}
              />
              <div className="flex flex-wrap justify-end gap-2">
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

        <div className="shrink-0 px-6 py-4 bg-slate-50 dark:bg-[#111827] border-t border-slate-100 dark:border-[#334155] flex flex-wrap items-center justify-between gap-3">
          <div>
            {followUp.status !== "Completed" && !isCompleting && (
              <Button
                variant="secondary"
                onClick={() => {
                  onClose();
                  onOpenReschedule(followUp);
                }}
              >
                <span className="inline-flex items-center gap-1.5">
                  <FiCalendar size={14} /> Reschedule
                </span>
              </Button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button variant="secondary" onClick={onClose}>
              Close
            </Button>
            {followUp.status !== "Completed" && !isCompleting && (
              <Button variant="primary" onClick={() => setIsCompleting(true)}>
                <span className="inline-flex items-center gap-1.5">
                  <FiCheck size={14} /> Mark as Completed
                </span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FollowUpDetailModal;
