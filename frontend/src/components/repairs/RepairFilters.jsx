import "./RepairFilters.css";

const STATUS_FILTERS = [
  "All",
  "New",
  "Assigned",
  "In Progress",
  "Waiting for Parts",
  "Completed",
  "Cancelled",
];

const PRIORITY_OPTIONS = [
  { value: "All", label: "All Priorities" },
  { value: "Critical", label: "Critical Priority" },
  { value: "High", label: "High Priority" },
  { value: "Medium", label: "Medium Priority" },
  { value: "Low", label: "Low Priority" },
];

function RepairFilters({
  activeStatus,
  onSelectStatus,
  counts,
  activePriority,
  onSelectPriority,
  onClearFilters,
  hasActiveFilters,
}) {
  return (
    <div className="repair-filters-wrapper">
      <div className="repair-filters-top">
        {/* Status Chips */}
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

        {/* Priority Filter and Reset */}
        <div className="repair-secondary-filters">
          <select
            className="filter-select"
            value={activePriority}
            onChange={(e) => onSelectPriority(e.target.value)}
            aria-label="Filter by priority"
          >
            {PRIORITY_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          {hasActiveFilters && (
            <button
              type="button"
              className="clear-filters-btn"
              onClick={onClearFilters}
              title="Reset all search and filter conditions"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default RepairFilters;
