import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { FiAlertTriangle, FiShield } from "react-icons/fi";
import { calculateWarrantyStatus } from "../warranty/WarrantyTableConfig";

function WarrantyAlert() {
  const navigate = useNavigate();

  const warranties = useSelector((state) => state.warranties || []);
  const devices = useSelector((state) => state.devices || []);

  const processedWarranties = warranties.map((w) => ({
    ...w,
    ...calculateWarrantyStatus(w.expiryDate),
  }));

  const alertWarranties = processedWarranties
    .filter((w) => w.status === "Expiring Soon" || w.status === "Active")
    .slice(0, 3);

  const activeCount = processedWarranties.filter((w) => w.status === "Active").length;

  const getDeviceInfo = (deviceId) => {
    const dev = devices.find((d) => d.id === deviceId);
    if (dev) {
      return {
        name: dev.name,
        subtitle: `${dev.type || "Device"} · ${dev.serialNumber || dev.id}`,
      };
    }
    return {
      name: "Device Hardware",
      subtitle: deviceId,
    };
  };

  return (
    <section className="panel shadow-sm overflow-hidden flex flex-col justify-between h-full">
      <div>
        <div className="px-6 sm:px-7 py-5 border-b border-slate-100 dark:border-[#334155] flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-blue-500 uppercase tracking-wider">
              DEVICE HEALTH
            </p>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
              Warranty Alerts
            </h2>
          </div>

          <button
            type="button"
            className="text-sm font-semibold text-blue-500 hover:text-blue-400 dark:text-blue-400 flex items-center gap-1.5 transition-colors cursor-pointer"
            onClick={() => navigate("/warranty")}
          >
            View all →
          </button>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-[#334155]">
          {alertWarranties.length > 0 ? (
            alertWarranties.map((w) => {
              const info = getDeviceInfo(w.deviceId);
              const isUrgent = w.status === "Expiring Soon" || w.daysRemaining <= 30;

              return (
                <button type="button"
                  key={w.id}
                  className="ui-clickable w-full text-left px-6 sm:px-7 py-5 flex items-center gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer"
                  onClick={() => navigate(`/warranty?policy=${encodeURIComponent(w.id)}`)}
                  aria-label={`View warranty for ${info.name}`}
                  title="Click to view warranty policy"
                >
                  <div
                    className={`w-11 h-11 shrink-0 flex items-center justify-center rounded-xl ${
                      isUrgent
                        ? "bg-amber-50 text-amber-500 dark:bg-amber-950/60 dark:text-amber-400 dark:border dark:border-amber-800/40"
                        : "bg-blue-50 text-blue-500 dark:bg-slate-800/80 dark:text-blue-400 dark:border dark:border-slate-700/60"
                    }`}
                  >
                    {isUrgent ? (
                      <FiAlertTriangle size={20} />
                    ) : (
                      <FiShield size={20} />
                    )}
                  </div>

                  <div className="flex-1 min-w-0 pr-2">
                    <strong className="block text-sm font-semibold text-slate-900 dark:text-white wrap-break-word">
                      {info.name}
                    </strong>
                    <span className="block text-xs text-slate-500 dark:text-slate-400 break-all mt-1">
                      {info.subtitle}
                    </span>
                  </div>

                  <div className="text-right shrink-0">
                    <strong className="block text-xl font-bold text-amber-500 dark:text-amber-400">
                      {w.daysRemaining}
                    </strong>
                    <span className="block text-[11px] text-slate-400 dark:text-slate-400">
                      days
                    </span>
                    <span className="mt-1 block text-xs text-blue-500">View policy →</span>
                  </div>
                </button>
              );
            })
          ) : (
            <div className="p-6 text-center text-xs text-slate-500 dark:text-slate-400">
              No active warranty alerts.
            </div>
          )}
        </div>
      </div>

      <div className="px-6 sm:px-7 py-4 bg-slate-50/50 dark:bg-[#111827]/40 border-t border-slate-100 dark:border-[#334155] text-xs font-medium text-slate-600 dark:text-slate-400 flex items-center gap-2">
        <span className="text-emerald-500">✓</span> {activeCount} warranties currently active
      </div>
    </section>
  );
}

export default WarrantyAlert;
