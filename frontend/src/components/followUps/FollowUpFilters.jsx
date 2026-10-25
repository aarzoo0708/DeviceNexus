
function FollowUpFilters({
  activeFilter,
  onSelectFilter,
  counts,
  activePriority,
  onSelectPriority,
}) {
  const tabs = [
    { id: "All", label: "All Follow-ups", count: counts.All, color: "default" },
    { id: "Upcoming", label: "Upcoming", count: counts.Upcoming, color: "info" },
    { id: "Overdue", label: "Overdue", count: counts.Overdue, color: "danger" },
    { id: "Completed", label: "Completed", count: counts.Completed, color: "success" },
  ];

  return (
    <div className="flex flex-col xl:flex-row xl:flex-wrap xl:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-[#334155]">
      {/* Status tabs */}
      <div className="flex flex-wrap items-center gap-2 pb-1">
        {tabs.map((tab) => {
          const isActive = activeFilter === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? tab.id === "Overdue"
                    ? "bg-rose-600 text-white shadow-sm"
                    : tab.id === "Completed"
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "bg-blue-600 text-white shadow-sm"
                  : "bg-white dark:bg-[#1e293b] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-[#334155] hover:bg-slate-50 dark:hover:bg-slate-800"
              }`}
              onClick={() => onSelectFilter(tab.id)}
            >
              <span>{tab.label}</span>
              <span
                className={`inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full text-[11px] font-bold ${
                  isActive
                    ? "bg-white/20 text-white"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Priority pills */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="text-xs font-medium text-slate-400 mr-1">Priority:</span>
        {["All", "Critical", "High", "Medium", "Low"].map((p) => {
          const isActive = activePriority === p;
          return (
            <button
              key={p}
              type="button"
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                isActive
                  ? "bg-blue-600 text-white font-semibold shadow-xs"
                  : "bg-white dark:bg-[#1e293b] text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-[#334155] hover:bg-slate-50 dark:hover:bg-slate-800"
              }`}
              onClick={() => onSelectPriority(p)}
            >
              {p}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default FollowUpFilters;
