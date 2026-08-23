import React from "react";
import Badge from "../common/Badge/Badge";

export const columns = [
  { key: "customer", label: "Customer" },
  { key: "contact", label: "Contact" },
  { key: "devices", label: "Devices" },
  { key: "status", label: "Status" },
  { key: "joined", label: "Joined" },
  { key: "actions", label: "Actions" },
];

export const getCustomerTableData = (filteredCustomers, navigate) => {
  return filteredCustomers.map((customer) => {
    let badgeVariant = "default";
    if (customer.status === "Active") badgeVariant = "success";
    if (customer.status === "Pending") badgeVariant = "warning";
    if (customer.status === "Inactive") badgeVariant = "danger";

    return {
      id: customer.id,
      customer: (
        <div>
          <div style={{ fontWeight: 500 }}>{customer.name}</div>
          <div style={{ fontSize: "0.85em", color: "#666" }}>{customer.id}</div>
        </div>
      ),
      contact: (
        <div>
          <div>{customer.email}</div>
          <div style={{ fontSize: "0.85em", color: "#666" }}>
            {customer.phone}
          </div>
        </div>
      ),
      devices: customer.devices,
      status: <Badge variant={badgeVariant}>{customer.status}</Badge>,
      joined: customer.joinedDate,
      actions: (
        <span
          style={{ color: "#0066cc", cursor: "pointer", fontWeight: 500 }}
          onClick={() => navigate(`/customers/${customer.id}`)}
        >
          View
        </span>
      ),
    };
  });
};
