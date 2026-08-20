import React from "react";
import "./WarrantyFilters.css";

const WARRANTY_FILTERS = [
  "All",
  "Active",
  "Expiring Soon",
  "Expired",
];

function WarrantyFilters({ activeStatus, onSelectStatus, counts }) {
  return (
    <div className="warranty-filters-bar">
      <div className="warranty-chips-container">
        {WARRANTY_FILTERS.map((status) => {
          const count = counts[status] ?? 0;
          const isActive = activeStatus === status;

          return (
            <button
              key={status}
              type="button"
              className={`warranty-filter-chip ${isActive ? "active" : ""}`}
              onClick={() => onSelectStatus(status)}
            >
              <span>{status}</span>
              <span className="warranty-chip-count">{count}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default WarrantyFilters;
