import React from "react";
import "./ServiceRequestFilters.css";

const STATUS_FILTERS = [
  "All",
  "New",
  "Assigned",
  "In Progress",
  "Resolved",
  "On Hold",
];

function ServiceRequestFilters({ activeStatus, onSelectStatus, counts }) {
  return (
    <div className="service-filters-bar">
      <div className="filter-chips-container">
        {STATUS_FILTERS.map((status) => {
          const count = counts[status] ?? 0;
          const isActive = activeStatus === status;

          return (
            <button
              key={status}
              type="button"
              className={`filter-chip ${isActive ? "active" : ""}`}
              onClick={() => onSelectStatus(status)}
            >
              <span>{status}</span>
              <span className="chip-count">{count}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default ServiceRequestFilters;
