import Badge from "../common/Badge/Badge";

export const deviceColumns = [
  { key: "id", label: "Device ID" },
  { key: "name", label: "Device Name" },
  { key: "type", label: "Type" },
  { key: "serialNumber", label: "Serial Number" },
  { key: "status", label: "Status" },
  { key: "warranty", label: "Warranty" },
];

export const getFormattedDevices = (devices) => {
  return devices.map((device) => {
    let warrantyVariant = "default";
    if (device.warranty === "Active" || device.warranty === "Valid") {
      warrantyVariant = "success";
    } else if (device.warranty === "Expiring Soon") {
      warrantyVariant = "warning";
    } else if (device.warranty === "Expired") {
      warrantyVariant = "danger";
    }

    return {
      id: <span className="font-mono font-bold text-blue-600 dark:text-blue-400 text-xs">{device.id}</span>,
      name: (
        <div>
          <div className="font-semibold text-slate-900 dark:text-white text-sm">{device.name}</div>
          <div className="text-xs text-slate-500 dark:text-slate-400">{device.model}</div>
        </div>
      ),
      type: <span className="text-sm text-slate-700 dark:text-slate-300">{device.type}</span>,
      serialNumber: <span className="font-mono text-xs text-slate-600 dark:text-slate-400">{device.serialNumber || "N/A"}</span>,
      status: (
        <Badge variant={device.status === "Active" ? "success" : "default"}>
          {device.status}
        </Badge>
      ),
      warranty: (
        <Badge variant={warrantyVariant}>
          {device.warranty}
        </Badge>
      ),
    };
  });
};

export const serviceColumns = [
  { key: "id", label: "Request ID" },
  { key: "issue", label: "Issue Description" },
  { key: "priority", label: "Priority" },
  { key: "status", label: "Status" },
  { key: "assignedTo", label: "Assigned To" },
  { key: "createdDate", label: "Date" },
];

export const getFormattedServices = (services) => {
  return services.map((req) => {
    let reqStatusVariant = "default";
    if (req.status === "Resolved") reqStatusVariant = "success";
    else if (req.status === "In Progress") reqStatusVariant = "info";
    else if (req.status === "Assigned") reqStatusVariant = "warning";
    else if (req.status === "On Hold") reqStatusVariant = "danger";

    let priorityVariant = "default";
    if (req.priority === "Critical") priorityVariant = "danger";
    else if (req.priority === "High") priorityVariant = "warning";
    else if (req.priority === "Medium") priorityVariant = "info";

    return {
      id: <span className="font-mono font-bold text-blue-600 dark:text-blue-400 text-xs">{req.id}</span>,
      issue: <span className="text-sm text-slate-700 dark:text-slate-300 font-medium">{req.issue}</span>,
      priority: <Badge variant={priorityVariant}>{req.priority || "Normal"}</Badge>,
      status: <Badge variant={reqStatusVariant}>{req.status}</Badge>,
      assignedTo: <span className="text-sm text-slate-700 dark:text-slate-300">{req.assignedTo || "Unassigned"}</span>,
      createdDate: <span className="text-xs text-slate-500 dark:text-slate-400">{req.createdDate || "Recent"}</span>,
    };
  });
};
