import React from "react";
import Badge from "../common/Badge/Badge";

export const getStatusVariant = (status) => {
  switch (status) {
    case "Active":
      return "success";
    case "Expiring Soon":
      return "warning";
    case "Expired":
      return "danger";
    default:
      return "default";
  }
};

export const columns = [
  { key: "warrantyId", label: "Policy ID" },
  { key: "device", label: "Device & Serial" },
  { key: "customer", label: "Customer" },
  { key: "coverageType", label: "Coverage / Provider" },
  { key: "expiry", label: "Expiry Date" },
  { key: "status", label: "Status" },
  { key: "actions", label: "Actions" },
];

export const getWarrantyTableData = (filteredWarranties, setSelectedWarranty) => {
  return filteredWarranties.map((w) => ({
    id: w.id,
    warrantyId: <span className="table-warranty-id">{w.id}</span>,
    device: (
      <div>
        <div className="table-device-name">{w.deviceName}</div>
        <div className="table-subtext">
          {w.serialNumber} • {w.deviceType}
        </div>
      </div>
    ),
    customer: (
      <div>
        <div className="table-customer-name">{w.customerName}</div>
        <div className="table-subtext">{w.customerPhone}</div>
      </div>
    ),
    coverageType: (
      <div>
        <div className="table-plan-name">{w.warrantyType}</div>
        <div className="table-subtext">{w.provider}</div>
      </div>
    ),
    expiry: (
      <div>
        <div className="table-expiry-date">{w.expiryDate}</div>
        {w.status === "Active" && (
          <div className="table-subtext text-success">
            {w.daysRemaining} days left
          </div>
        )}
        {w.status === "Expiring Soon" && (
          <div className="table-subtext text-warning">
            ⚠️ {w.daysRemaining} days left
          </div>
        )}
        {w.status === "Expired" && (
          <div className="table-subtext text-danger">Expired</div>
        )}
      </div>
    ),
    status: (
      <Badge variant={getStatusVariant(w.status)}>{w.status}</Badge>
    ),
    actions: (
      <button
        type="button"
        className="table-action-btn"
        onClick={() => setSelectedWarranty(w)}
      >
        View Policy
      </button>
    ),
  }));
};
