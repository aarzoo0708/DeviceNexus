import React from "react";

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
    <div className="followup-filters-container">
      <div className="followup-status-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`followup-tab-btn ${activeFilter === tab.id ? "active" : ""} tab-${tab.color}`}
            onClick={() => onSelectFilter(tab.id)}
          >
            <span className="tab-label">{tab.label}</span>
            <span className={`tab-count count-${tab.color}`}>{tab.count}</span>
          </button>
        ))}
      </div>

      <div className="followup-secondary-filters">
        <span className="filter-label">Priority:</span>
        {["All", "Critical", "High", "Medium", "Low"].map((p) => (
          <button
            key={p}
            type="button"
            className={`filter-pill-btn ${activePriority === p ? "active" : ""}`}
            onClick={() => onSelectPriority(p)}
          >
            {p}
          </button>
        ))}
      </div>
    </div>
  );
}

export default FollowUpFilters;
