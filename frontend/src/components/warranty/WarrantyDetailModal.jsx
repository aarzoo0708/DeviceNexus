import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { FiX, FiRefreshCw, FiTool } from "react-icons/fi";
import Badge from "../common/Badge/Badge";
import Button from "../common/Button/Button";

function WarrantyDetailModal({ warranty, onClose, onExtend }) {
  const navigate = useNavigate();
  const customers = useSelector((state) => state.customers || []);
  const devices = useSelector((state) => state.devices || []);

  if (!warranty) return null;

  const customer = customers.find((c) => c.id === warranty.customerId);
  const device = devices.find((d) => d.id === warranty.deviceId);

  const customerName = customer ? customer.name : warranty.customerName || "Customer";
  const customerPhone = customer ? customer.phone : warranty.customerPhone || "N/A";
  const deviceName = device ? device.name : warranty.deviceName || "Device";
  const deviceType = device ? device.type : warranty.deviceType || "Hardware";
  const serialNumber = device ? device.serialNumber : warranty.serialNumber || "N/A";

  const getStatusVariant = (status) => {
    switch (status) {
      case "Active":
        return "success";
      case "Expiring Soon":
        return "warning";
      case "Expired":
        return "danger";
      default:
        return "default";
    }
  };

  const handleClaimViaServiceRequest = () => {
    onClose();
    navigate("/service-requests", { state: { openCreateModal: true } });
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
                {warranty.id}
              </span>
              <Badge variant={getStatusVariant(warranty.status)}>
                {warranty.status}
              </Badge>
              {warranty.status === "Active" && (
                <span className="text-xs px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800 font-semibold">
                  {warranty.daysRemaining} days left
                </span>
              )}
              {warranty.status === "Expiring Soon" && (
                <span className="text-xs px-2.5 py-1 rounded-lg bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800 font-semibold">
                  {warranty.daysRemaining} days left
                </span>
              )}
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white leading-snug">
              {deviceName} — {warranty.warrantyType}
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

        {/* Modal Body */}
        <div className="p-6 min-h-0 overflow-y-auto space-y-5">
          {/* Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-slate-50 dark:bg-[#111827] p-4 rounded-xl border border-slate-100 dark:border-[#334155]">
              <span className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Customer
              </span>
              <span className="block text-sm font-semibold text-slate-900 dark:text-white mt-1">
                {customerName}
              </span>
              <span className="block text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {customerPhone} ({warranty.customerId})
              </span>
            </div>

            <div className="bg-slate-50 dark:bg-[#111827] p-4 rounded-xl border border-slate-100 dark:border-[#334155]">
              <span className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Device Serial / ID
              </span>
              <span className="block text-sm font-mono font-semibold text-slate-900 dark:text-white mt-1">
                {serialNumber}
              </span>
              <span className="block text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {deviceType} • {warranty.deviceId}
              </span>
            </div>

            <div className="bg-slate-50 dark:bg-[#111827] p-4 rounded-xl border border-slate-100 dark:border-[#334155]">
              <span className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Provider
              </span>
              <span className="block text-sm font-semibold text-slate-900 dark:text-white mt-1">
                {warranty.provider}
              </span>
              <span className="block text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Plan: {warranty.warrantyType}
              </span>
            </div>

            <div className="bg-slate-50 dark:bg-[#111827] p-4 rounded-xl border border-slate-100 dark:border-[#334155]">
              <span className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Coverage Period
              </span>
              <span className="block text-sm font-semibold text-slate-900 dark:text-white mt-1">
                {warranty.startDate} – {warranty.expiryDate}
              </span>
              <span className="block text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Purchased: {warranty.purchaseDate}
              </span>
            </div>
          </div>

          {/* Coverage Summary */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Coverage Details & Perks
            </h4>
            <div className="bg-slate-50 dark:bg-[#111827] p-4 rounded-xl border border-slate-100 dark:border-[#334155]">
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {warranty.coverage}
              </p>
              <div className="text-xs text-slate-500 dark:text-slate-400 pt-3 mt-3 border-t border-slate-200 dark:border-[#334155]">
                <strong className="text-slate-700 dark:text-slate-300">Deductible / Terms:</strong> {warranty.deductible}
              </div>
            </div>
          </div>

          {/* Claims History */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Claims History ({warranty.claimsCount || (warranty.claims ? warranty.claims.length : 0)})
            </h4>

            {warranty.claims && warranty.claims.length > 0 ? (
              <div className="space-y-2.5">
                {warranty.claims.map((claim, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-50 dark:bg-[#111827] p-3.5 rounded-xl border border-slate-100 dark:border-[#334155]"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">
                        {claim.claimId}
                      </span>
                      <span className="text-[11px] text-slate-400">{claim.date}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-slate-800 dark:text-slate-200">
                        {claim.issue}
                      </span>
                      <Badge variant="success">{claim.amountCovered}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs text-slate-500 dark:text-slate-400 py-4 text-center bg-slate-50 dark:bg-[#111827] rounded-xl border border-dashed border-slate-200 dark:border-[#334155]">
                <span>No service claims filed yet under this warranty policy.</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="shrink-0 px-6 py-4 bg-slate-50 dark:bg-[#111827] border-t border-slate-100 dark:border-[#334155] flex flex-wrap items-center justify-between gap-3">
          <Button variant="secondary" onClick={() => onExtend(warranty.id)}>
            <span className="inline-flex items-center gap-1.5">
              <FiRefreshCw size={14} /> Extend 1 Year
            </span>
          </Button>
          <Button variant="primary" onClick={handleClaimViaServiceRequest}>
            <span className="inline-flex items-center gap-1.5">
              <FiTool size={14} /> File Service Claim
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default WarrantyDetailModal;
