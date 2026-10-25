import { useSelector } from "react-redux";
import { FiX } from "react-icons/fi";
import Badge from "../common/Badge/Badge";
import Button from "../common/Button/Button";

function ServiceRequestDetailModal({ request, onClose, onStatusChange }) {
  const customers = useSelector((state) => state.customers || []);
  const devices = useSelector((state) => state.devices || []);

  if (!request) return null;

  const customer = customers.find((c) => c.id === request.customerId);
  const device = devices.find((d) => d.id === request.deviceId);

  const customerName = customer ? customer.name : request.customerName || "Unknown Customer";
  const customerPhone = customer ? customer.phone : request.customerPhone || "N/A";
  const deviceName = device ? device.name : request.deviceName || "Unknown Device";
  const deviceType = device ? device.type : request.deviceType || "Device";

  const getPriorityVariant = (priority) => {
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

  const getStatusVariant = (status) => {
    switch (status) {
      case "Resolved":
        return "success";
      case "In Progress":
        return "info";
      case "Assigned":
        return "warning";
      case "New":
        return "default";
      case "On Hold":
        return "danger";
      default:
        return "default";
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="modal-backdrop"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl max-h-[90dvh] bg-white dark:bg-[#1e293b] rounded-2xl shadow-2xl border border-slate-200 dark:border-[#334155] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="shrink-0 px-6 py-4 border-b border-slate-100 dark:border-[#334155] flex items-start justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-1 rounded-md">
                {request.id}
              </span>
              <Badge variant={getStatusVariant(request.status)}>
                {request.status}
              </Badge>
              <Badge variant={getPriorityVariant(request.priority)}>
                {request.priority} Priority
              </Badge>
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white leading-snug">
              {request.issue}
            </h2>
          </div>
          <button
            type="button"
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-lg transition-colors cursor-pointer shrink-0"
            onClick={onClose}
            aria-label="Close"
          >
            <FiX size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 min-h-0 overflow-y-auto space-y-5">
          {/* Quick Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-slate-50 dark:bg-[#111827] p-4 rounded-xl border border-slate-100 dark:border-[#334155]">
              <span className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Customer
              </span>
              <span className="block text-sm font-semibold text-slate-900 dark:text-white mt-1">
                {customerName}
              </span>
              <span className="block text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {customerPhone}
              </span>
            </div>

            <div className="bg-slate-50 dark:bg-[#111827] p-4 rounded-xl border border-slate-100 dark:border-[#334155]">
              <span className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Device
              </span>
              <span className="block text-sm font-semibold text-slate-900 dark:text-white mt-1">
                {deviceName}
              </span>
              <span className="block text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {deviceType} ({request.deviceId})
              </span>
            </div>

            <div className="bg-slate-50 dark:bg-[#111827] p-4 rounded-xl border border-slate-100 dark:border-[#334155]">
              <span className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Assigned Technician
              </span>
              <span className="block text-sm font-semibold text-slate-900 dark:text-white mt-1">
                {request.assignedTo || "Unassigned"}
              </span>
              <span className="block text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Est. Completion: {request.estimatedCompletion || "TBD"}
              </span>
            </div>

            <div className="bg-slate-50 dark:bg-[#111827] p-4 rounded-xl border border-slate-100 dark:border-[#334155]">
              <span className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Created Date
              </span>
              <span className="block text-sm font-semibold text-slate-900 dark:text-white mt-1">
                {request.createdDate}
              </span>
              <span className="block text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Customer ID: {request.customerId}
              </span>
            </div>
          </div>

          {/* Notes & Diagnostics */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Diagnostic Notes
            </h4>
            <p className="text-sm text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-[#111827] p-4 rounded-xl border border-slate-100 dark:border-[#334155] leading-relaxed">
              {request.notes || "No technician notes recorded yet."}
            </p>
          </div>

          {/* Activity Timeline */}
          {request.timeline && request.timeline.length > 0 && (
            <div className="space-y-2.5">
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Activity Timeline
              </h4>
              <div className="space-y-3 pl-2 border-l-2 border-slate-200 dark:border-[#334155] ml-2">
                {request.timeline.map((item, idx) => (
                  <div key={idx} className="relative pl-4">
                    <div className="absolute -left-5.25 top-1.5 w-2.5 h-2.5 rounded-full bg-blue-600 ring-4 ring-white dark:ring-[#334155]" />
                    <div className="bg-slate-50 dark:bg-[#111827] p-3 rounded-xl border border-slate-100 dark:border-[#334155]">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-900 dark:text-white">
                          {item.step}
                        </span>
                        <span className="text-[11px] text-slate-400">{item.date}</span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                        {item.note}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Status Quick Update */}
          <div className="p-4.5 bg-slate-50 dark:bg-[#111827] rounded-xl border border-slate-100 dark:border-[#334155] space-y-3">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
              Update Status:
            </span>
            <div className="flex flex-wrap gap-2.5">
              {["New", "Assigned", "In Progress", "Resolved", "On Hold"].map(
                (statusOption) => (
                  <button
                    key={statusOption}
                    type="button"
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                      request.status === statusOption
                        ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                        : "bg-white dark:bg-[#1e293b] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-[#334155] hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                    onClick={() => onStatusChange(request.id, statusOption)}
                  >
                    {statusOption}
                  </button>
                )
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="shrink-0 px-6 py-4 bg-slate-50 dark:bg-[#111827] border-t border-slate-100 dark:border-[#334155] flex flex-wrap items-center justify-end">
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ServiceRequestDetailModal;
