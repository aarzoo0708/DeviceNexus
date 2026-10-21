import Badge from "../common/Badge/Badge";

export const getPriorityVariant = (priority) => {
  switch (priority) {
    case "Critical":
      return "danger";
    case "High":
      return "warning";
    case "Medium":
      return "info";
    case "Low":
    default:
      return "default";
  }
};

export const getStatusVariant = (status) => {
  switch (status) {
    case "Completed":
      return "success";
    case "In Progress":
      return "info";
    case "Assigned":
      return "warning";
    case "Waiting for Parts":
      return "warning";
    case "Cancelled":
      return "danger";
    case "New":
    default:
      return "default";
  }
};

export const columns = [
  { key: "repairId", label: "Repair ID" },
  { key: "customer", label: "Customer" },
  { key: "device", label: "Device" },
  { key: "model", label: "Model" },
  { key: "issue", label: "Reported Issue" },
  { key: "technician", label: "Technician" },
  { key: "priority", label: "Priority" },
  { key: "status", label: "Status" },
  { key: "cost", label: "Est. Cost" },
  { key: "dateReceived", label: "Date Received" },
  { key: "actions", label: "Actions" },
];

export const getRepairTableData = (
  filteredRepairs,
  { onSelectRepair, onEditRepair, onDeleteRepair, onQuickStatusChange }
) => {
  return filteredRepairs.map((rep) => {
    const formattedCost = typeof rep.estimatedCost === "number"
      ? `$${rep.estimatedCost.toFixed(2)}`
      : rep.estimatedCost
      ? `$${rep.estimatedCost}`
      : "$0.00";

    const formattedDate = rep.dateReceived
      ? new Date(rep.dateReceived).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "—";

    return {
      id: rep.id,
      repairId: (
        <button
          type="button"
          className="table-repair-id-btn"
          onClick={() => onSelectRepair(rep)}
          title="Click to view repair details"
        >
          {rep.id}
        </button>
      ),
      customer: (
        <div>
          <div className="table-customer-name">{rep.customerName}</div>
          <div className="table-subtext">{rep.customerPhone || rep.customerEmail}</div>
        </div>
      ),
      device: (
        <div>
          <div className="table-device-name">{rep.deviceName}</div>
          <div className="table-subtext">{rep.deviceType || "Hardware"}</div>
        </div>
      ),
      model: (
        <div className="table-model-text" title={rep.deviceModel}>
          {rep.deviceModel || "Standard Model"}
        </div>
      ),
      issue: (
        <div className="table-issue-text" title={rep.issue}>
          {rep.issue}
        </div>
      ),
      technician: (
        <div className="table-assigned-name">
          {rep.assignedTechnician && rep.assignedTechnician !== "Unassigned" ? (
            <span className="technician-chip">
              <span className="tech-dot" />
              {rep.assignedTechnician.split(" ")[0]} {rep.assignedTechnician.split(" ")[1] || ""}
            </span>
          ) : (
            <span className="technician-unassigned">Unassigned</span>
          )}
        </div>
      ),
      priority: (
        <Badge variant={getPriorityVariant(rep.priority)}>
          {rep.priority}
        </Badge>
      ),
      status: (
        <div className="status-cell-wrapper">
          <span className={`repair-status-pill status-${rep.status.toLowerCase().replace(/\s+/g, "-")}`}>
            <span className="status-dot" />
            {rep.status}
          </span>
        </div>
      ),
      cost: <span className="table-cost-value">{formattedCost}</span>,
      dateReceived: <span className="table-date-value">{formattedDate}</span>,
      actions: (
        <div className="table-actions-group">
          <button
            type="button"
            className="table-action-btn action-view"
            onClick={() => onSelectRepair(rep)}
            title="View Details"
          >
            View
          </button>

          <button
            type="button"
            className="table-action-btn action-edit"
            onClick={() => onEditRepair(rep)}
            title="Edit Repair"
          >
            Edit
          </button>

          <select
            className="table-quick-status-select"
            value={rep.status}
            onChange={(e) => onQuickStatusChange(rep.id, e.target.value)}
            title="Quick update status"
          >
            <option value="New">New</option>
            <option value="Assigned">Assigned</option>
            <option value="In Progress">In Progress</option>
            <option value="Waiting for Parts">Waiting for Parts</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          <button
            type="button"
            className="table-action-btn action-delete"
            onClick={() => onDeleteRepair(rep)}
            title="Delete Repair"
          >
            ✕
          </button>
        </div>
      ),
    };
  });
};
