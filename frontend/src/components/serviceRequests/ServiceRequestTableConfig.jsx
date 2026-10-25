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
  setSelectedRequest,
  customers = [],
  devices = []
) => {
  return filteredRequests.map((req) => {
    const customer = customers.find((c) => c.id === req.customerId);
    const device = devices.find((d) => d.id === req.deviceId);

    const customerName = customer ? customer.name : req.customerName || "Customer";
    const customerPhone = customer ? customer.phone : req.customerPhone || "";
    const deviceName = device ? device.name : req.deviceName || "Device";
    const deviceType = device ? device.type : req.deviceType || "";

    return {
      id: req.id,
      requestId: (
        <span className="font-mono font-bold text-blue-600 dark:text-blue-400 text-xs">
          {req.id}
        </span>
      ),
      customer: (
        <div>
          <div className="font-semibold text-slate-900 dark:text-white text-sm">
            {customerName}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400">{customerPhone}</div>
        </div>
      ),
      device: (
        <div>
          <div className="font-semibold text-slate-900 dark:text-white text-sm">
            {deviceName}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400">{deviceType}</div>
        </div>
      ),
      issue: (
        <div
          className="w-64 whitespace-normal break-words leading-relaxed text-sm text-slate-700 dark:text-slate-300"
          title={req.issue}
        >
          {req.issue}
        </div>
      ),
      priority: (
        <Badge variant={getPriorityVariant(req.priority)}>
          {req.priority || "Medium"}
        </Badge>
      ),
      status: (
        <Badge variant={getStatusVariant(req.status)}>{req.status}</Badge>
      ),
      assignedTo: (
        <div className="text-sm text-slate-700 dark:text-slate-300">
          {req.assignedTo || "Unassigned"}
        </div>
      ),
      actions: (
        <button
          type="button"
          className="px-2.5 py-1 text-xs font-semibold rounded bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/60 dark:hover:bg-blue-900/60 text-blue-600 dark:text-blue-400 transition-colors cursor-pointer"
          onClick={() => setSelectedRequest(req)}
        >
          View Ticket
        </button>
      ),
    };
  });
};
