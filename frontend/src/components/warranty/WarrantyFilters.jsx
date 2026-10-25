
const WARRANTY_FILTERS = [
  "All",
  "Active",
  "Expiring Soon",
  "Expired",
];

function WarrantyFilters({ activeStatus, onSelectStatus, counts }) {
  return (
    <div className="flex flex-wrap items-center gap-2 pb-1 mb-4">
      {WARRANTY_FILTERS.map((status) => {
        const count = counts[status] ?? 0;
        const isActive = activeStatus === status;

        return (
          <button
            key={status}
            type="button"
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              isActive
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700"
            }`}
            onClick={() => onSelectStatus(status)}
          >
            <span>{status}</span>
            <span
              className={`inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full text-[11px] font-bold ${
                isActive
                  ? "bg-white/20 text-white"
                  : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
              }`}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export default WarrantyFilters;
