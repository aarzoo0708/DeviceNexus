
function StatCard({ title, value, change, icon, iconColor = "text-blue-500 dark:text-blue-400", onClick }) {
  const isClickable = typeof onClick === "function";

  const handleKeyDown = (e) => {
    if (isClickable && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      onClick(e);
    }
  };

  return (
    <div
      className={`min-w-0 w-full panel p-6 shadow-sm transition-all duration-200 flex flex-col justify-between min-h-46.25 ${
        isClickable
          ? "cursor-pointer hover:shadow-md hover:-translate-y-0.5 hover:border-blue-500/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          : ""
      }`}
      onClick={onClick}
      role={isClickable ? "button" : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onKeyDown={handleKeyDown}
    >
      <div className="flex min-h-11 items-center justify-between gap-3">
        <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          {title}
        </span>
        <div className={`w-11 h-11 flex items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-500/15 ${iconColor} text-lg shrink-0`}>
          {icon}
        </div>
      </div>

      <div className="my-3 text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
        {value}
      </div>

      <div className="min-h-8 text-sm font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
        {change}
      </div>
    </div>
  );
}

export default StatCard;
