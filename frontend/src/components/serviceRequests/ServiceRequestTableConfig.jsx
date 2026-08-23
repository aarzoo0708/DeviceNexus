import React from "react";
import Badge from "../common/Badge/Badge";

export const getPriorityVariant = (priority) => {
  switch (priority) {
    case "Critical":
      return "danger";
    case "High":
      return "warning";
    case "Medium":
      return "info";
    default:
      return "default";
  }
};

export const getStatusVariant = (status) => {
  switch (status) {
    case "Resolved":
      return "success";
    case "In Progress":
      return "info";
    case "Assigned":
      return "warning";
    case "New":
      return "default";
    case "On Hold":
      return "danger";
    default:
      return "default";
  }
};

export const columns = [
  { key: "requestId", label: "Request ID" },
  { key: "customer", label: "Customer" },
  { key: "device", label: "Device" },
  { key: "issue", label: "Issue" },
  { key: "priority", label: "Priority" },
  { key: "status", label: "Status" },
  { key: "assignedTo", label: "Assigned To" },
  { key: "actions", label: "Actions" },
];

export const getServiceRequestTableData = (
  filteredRequests,
  setSelectedRequest
) => {
  return filteredRequests.map((req) => ({
    id: req.id,
    requestId: <span className="table-req-id">{req.id}</span>,
    customer: (
      <div>
        <div className="table-customer-name">{req.customerName}</div>
        <div className="table-subtext">{req.customerPhone}</div>
      </div>
    ),
    device: (
      <div>
        <div className="table-device-name">{req.deviceName}</div>
        <div className="table-subtext">{req.deviceType}</div>
      </div>
    ),
    issue: (
      <div className="table-issue-text" title={req.issue}>
        {req.issue}
      </div>
    ),
    priority: (
      <Badge variant={getPriorityVariant(req.priority)}>
        {req.priority}
      </Badge>
    ),
    status: (
      <Badge variant={getStatusVariant(req.status)}>{req.status}</Badge>
    ),
    assignedTo: (
      <div className="table-assigned-name">
        {req.assignedTo
          ? req.assignedTo.split(" ")[0] +
            " " +
            (req.assignedTo.split(" ")[1] || "")
          : "Unassigned"}
      </div>
    ),
    actions: (
      <button
        type="button"
        className="table-action-btn"
        onClick={() => setSelectedRequest(req)}
      >
        View Details
      </button>
    ),
  }));
};
