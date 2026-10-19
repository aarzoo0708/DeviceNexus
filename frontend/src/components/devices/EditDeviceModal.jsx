import React, { useState, useEffect } from "react";
import Button from "../common/Button/Button";

function EditDeviceModal({ device, onClose, onSubmit }) {
  const [editingDevice, setEditingDevice] = useState(device);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setEditingDevice(device);
  }, [device]);

  if (!editingDevice) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!editingDevice.name.trim()) newErrors.name = "Device name is required.";
    if (!editingDevice.customer.trim()) newErrors.customer = "Customer name is required.";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    onSubmit({ ...editingDevice, name: editingDevice.name.trim(), customer: editingDevice.customer.trim() });
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <div className="modal-header">
            <h3>Edit Device — {editingDevice.id}</h3>
            <button
              type="button"
              className="modal-close-btn"
              onClick={onClose}
            >
              &times;
            </button>
          </div>

          <div className="modal-body">
            <div className="form-group">
              <label>Device Name *</label>
              <input
                type="text"
                className="form-control"
                required
                value={editingDevice.name}
                onChange={(e) =>
                  setEditingDevice({ ...editingDevice, name: e.target.value })
                }
              />
              {errors.name && <small style={{ color: "red", fontSize: "12px", display: "block", marginTop: "4px" }}>{errors.name}</small>}
            </div>

            <div className="form-group">
              <label>Customer *</label>
              <input
                type="text"
                className="form-control"
                required
                value={editingDevice.customer}
                onChange={(e) =>
                  setEditingDevice({
                    ...editingDevice,
                    customer: e.target.value,
                  })
                }
              />
              {errors.customer && <small style={{ color: "red", fontSize: "12px", display: "block", marginTop: "4px" }}>{errors.customer}</small>}
            </div>

            <div className="form-group">
              <label>Model Description</label>
              <input
                type="text"
                className="form-control"
                value={editingDevice.model}
                onChange={(e) =>
                  setEditingDevice({
                    ...editingDevice,
                    model: e.target.value,
                  })
                }
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Device Type</label>
                <select
                  className="form-control"
                  value={editingDevice.type}
                  onChange={(e) =>
                    setEditingDevice({
                      ...editingDevice,
                      type: e.target.value,
                    })
                  }
                >
                  <option value="Laptop">Laptop</option>
                  <option value="Smartphone">Smartphone</option>
                  <option value="Tablet">Tablet</option>
                  <option value="Desktop">Desktop</option>
                  <option value="Smartwatch">Smartwatch</option>
                  <option value="Printer">Printer</option>
                </select>
              </div>

              <div className="form-group">
                <label>Status</label>
                <select
                  className="form-control"
                  value={editingDevice.status}
                  onChange={(e) =>
                    setEditingDevice({
                      ...editingDevice,
                      status: e.target.value,
                    })
                  }
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Retired">Retired</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Warranty Status</label>
                <select
                  className="form-control"
                  value={editingDevice.warranty}
                  onChange={(e) =>
                    setEditingDevice({
                      ...editingDevice,
                      warranty: e.target.value,
                    })
                  }
                >
                  <option value="Active">Active</option>
                  <option value="Expiring Soon">Expiring Soon</option>
                  <option value="Expired">Expired</option>
                </select>
              </div>

              <div className="form-group">
                <label>Serial Number</label>
                <input
                  type="text"
                  className="form-control"
                  value={editingDevice.serialNumber}
                  onChange={(e) =>
                    setEditingDevice({
                      ...editingDevice,
                      serialNumber: e.target.value,
                    })
                  }
                />
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditDeviceModal;
