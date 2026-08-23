import React from "react";
import Button from "../common/Button/Button";
import Badge from "../common/Badge/Badge";

function ViewDeviceModal({
  device,
  onClose,
  onEdit,
  getStatusBadgeVariant,
  getWarrantyBadgeVariant,
}) {
  if (!device) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Device Details — {device.id}</h3>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
          >
            &times;
          </button>
        </div>

        <div className="modal-body">
          <div className="detail-grid">
            <div className="detail-item">
              <span className="detail-label">Device Name</span>
              <span className="detail-value">{device.name}</span>
            </div>

            <div className="detail-item">
              <span className="detail-label">Customer</span>
              <span className="detail-value">{device.customer}</span>
            </div>

            <div className="detail-item">
              <span className="detail-label">Model</span>
              <span className="detail-value">{device.model}</span>
            </div>

            <div className="detail-item">
              <span className="detail-label">Device Type</span>
              <span className="detail-value">{device.type}</span>
            </div>

            <div className="detail-item">
              <span className="detail-label">Serial Number</span>
              <span className="detail-value">{device.serialNumber || "N/A"}</span>
            </div>

            <div className="detail-item">
              <span className="detail-label">Purchase Date</span>
              <span className="detail-value">{device.purchaseDate || "N/A"}</span>
            </div>

            <div className="detail-item">
              <span className="detail-label">Status</span>
              <div>
                <Badge variant={getStatusBadgeVariant(device.status)}>
                  {device.status}
                </Badge>
              </div>
            </div>

            <div className="detail-item">
              <span className="detail-label">Warranty Status</span>
              <div>
                <Badge variant={getWarrantyBadgeVariant(device.warranty)}>
                  {device.warranty}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
          <Button onClick={onEdit}>Edit Device</Button>
        </div>
      </div>
    </div>
  );
}

export default ViewDeviceModal;
