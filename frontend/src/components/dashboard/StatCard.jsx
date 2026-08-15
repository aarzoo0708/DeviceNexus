import "./StatCard.css";

function StatCard({ title, value, change, icon, trend, onClick }) {
  const isClickable = typeof onClick === "function";

  const handleKeyDown = (e) => {
    if (isClickable && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      onClick(e);
    }
  };

  return (
    <div
      className={`stat-card ${isClickable ? "clickable" : ""}`}
      onClick={onClick}
      role={isClickable ? "button" : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onKeyDown={handleKeyDown}
    >
      <div className="stat-card-top">
        <span className="stat-title">{title}</span>

        <div className="stat-icon">{icon}</div>
      </div>

      <div className="stat-value">{value}</div>

      <div className={`stat-change ${trend}`}>{change}</div>
    </div>
  );
}

export default StatCard;