import { useSelector } from "react-redux";
import { FiX, FiEdit2 } from "react-icons/fi";
import Button from "../common/Button/Button";
import Badge from "../common/Badge/Badge";

function ViewDeviceModal({
  device,
  onClose,
  onEdit,
  getStatusBadgeVariant,
  getWarrantyBadgeVariant,
}) {
  const customers = useSelector((state) => state.customers || []);

  if (!device) return null;

  const customer = customers.find((c) => c.id === device.customerId);
  const customerDisplay = customer
    ? `${customer.name} (${customer.id})`
    : device.customer || "Unassigned";

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
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Device Details — {device.id}
          </h3>
          <button
            type="button"
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-lg transition-colors cursor-pointer"
            onClick={onClose}
            aria-label="Close"
          >
            <FiX size={18} />
          </button>
        </div>

        <div className="p-6 min-h-0 overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <span className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Device Name
              </span>
              <span className="block text-sm font-semibold text-slate-900 dark:text-white mt-1">
                {device.name}
              </span>
            </div>

            <div>
              <span className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Assigned Customer
              </span>
              <span className="block text-sm text-slate-800 dark:text-slate-200 mt-1">
                {customerDisplay}
              </span>
            </div>

            <div>
              <span className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Model / Specs
              </span>
              <span className="block text-sm text-slate-800 dark:text-slate-200 mt-1">
                {device.model || "Standard"}
              </span>
            </div>

            <div>
              <span className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Device Type
              </span>
              <span className="block text-sm text-slate-800 dark:text-slate-200 mt-1">
                {device.type}
              </span>
            </div>

            <div>
              <span className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Serial Number
              </span>
              <span className="block text-sm font-mono text-slate-800 dark:text-slate-200 mt-1">
                {device.serialNumber || "N/A"}
              </span>
            </div>

            <div>
              <span className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Purchase Date
              </span>
              <span className="block text-sm text-slate-800 dark:text-slate-200 mt-1">
                {device.purchaseDate || "N/A"}
              </span>
            </div>

            <div>
              <span className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Hardware Status
              </span>
              <div>
                <Badge variant={getStatusBadgeVariant(device.status)}>
                  {device.status}
                </Badge>
              </div>
            </div>

            <div>
              <span className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                Warranty Status
              </span>
              <div>
                <Badge variant={getWarrantyBadgeVariant(device.warranty)}>
                  {device.warranty}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <div className="shrink-0 px-6 py-4 bg-slate-50 dark:bg-[#111827] border-t border-slate-100 dark:border-[#334155] flex flex-wrap items-center justify-end gap-3">
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
          <Button onClick={onEdit}>
            <span className="inline-flex items-center gap-1.5">
              <FiEdit2 size={14} /> Edit Device
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ViewDeviceModal;
