import React from "react";
import Badge from "../common/Badge/Badge";

export const deviceColumns = [
  { key: "name", label: "Device Name" },
  { key: "type", label: "Type" },
  { key: "status", label: "Status" },
  { key: "warranty", label: "Warranty" },
];

export const getFormattedDevices = (devices) => {
  return devices.map((device) => ({
    ...device,
    status: (
      <Badge variant={device.status === "Active" ? "success" : "default"}>
        {device.status}
      </Badge>
    ),
    warranty: (
      <Badge variant={device.warranty === "Valid" ? "success" : "warning"}>
        {device.warranty}
      </Badge>
    ),
  }));
};

export const serviceColumns = [
  { key: "id", label: "Request ID" },
  { key: "issue", label: "Issue" },
  { key: "device", label: "Device" },
  { key: "priority", label: "Priority" },
  { key: "status", label: "Status" },
];

export const getFormattedServices = (services) => {
  return services.map((req) => {
    let reqStatusVariant = "default";
    if (req.status === "Resolved") reqStatusVariant = "success";
    if (req.status === "In Progress") reqStatusVariant = "warning";

    let priorityVariant = "default";
    if (req.priority === "High") priorityVariant = "danger";
    if (req.priority === "Medium") priorityVariant = "warning";

    return {
      ...req,
      status: <Badge variant={reqStatusVariant}>{req.status}</Badge>,
      priority: <Badge variant={priorityVariant}>{req.priority}</Badge>,
    };
  });
};
