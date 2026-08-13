import "./StatCard.css";

function StatCard({ title, value, change, icon, trend }) {
  return (
    <div className="stat-card">

      <div className="stat-card-top">
        <span className="stat-title">
          {title}
        </span>

        <div className="stat-icon">
          {icon}
        </div>
      </div>

      <div className="stat-value">
        {value}
      </div>

      <div className={`stat-change ${trend}`}>
        {change}
      </div>

    </div>
  );
}

export default StatCard;