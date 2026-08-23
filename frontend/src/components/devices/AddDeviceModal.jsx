import React, { useState } from "react";
import Button from "../common/Button/Button";

function AddDeviceModal({ onClose, onSubmit }) {
  const [newDevice, setNewDevice] = useState({
    name: "",
    model: "",
    customer: "",
    type: "Laptop",
    status: "Active",
    warranty: "Active",
    serialNumber: "",
    purchaseDate: new Date().toISOString().split("T")[0],
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newDevice.name.trim() || !newDevice.customer.trim()) return;
    onSubmit(newDevice);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <div className="modal-header">
            <h3>Add New Device</h3>
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
                placeholder='e.g. MacBook Pro 14"'
                required
                value={newDevice.name}
                onChange={(e) =>
                  setNewDevice({ ...newDevice, name: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label>Customer Name *</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Acme Corp"
                required
                value={newDevice.customer}
                onChange={(e) =>
                  setNewDevice({ ...newDevice, customer: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label>Model & Specifications</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. M3 Pro 18GB RAM"
                value={newDevice.model}
                onChange={(e) =>
                  setNewDevice({ ...newDevice, model: e.target.value })
                }
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Device Type</label>
                <select
                  className="form-control"
                  value={newDevice.type}
                  onChange={(e) =>
                    setNewDevice({ ...newDevice, type: e.target.value })
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
                <label>Initial Status</label>
                <select
                  className="form-control"
                  value={newDevice.status}
                  onChange={(e) =>
                    setNewDevice({ ...newDevice, status: e.target.value })
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
                  value={newDevice.warranty}
                  onChange={(e) =>
                    setNewDevice({ ...newDevice, warranty: e.target.value })
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
                  placeholder="e.g. C02FX390MD6R"
                  value={newDevice.serialNumber}
                  onChange={(e) =>
                    setNewDevice({
                      ...newDevice,
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
            <Button type="submit">Create Device</Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddDeviceModal;
