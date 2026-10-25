import { useState } from "react";
import { useSelector } from "react-redux";
import { FiX } from "react-icons/fi";
import Button from "../common/Button/Button";

function AddDeviceModal({ onClose, onSubmit }) {
  const customers = useSelector((state) => state.customers || []);

  const [newDevice, setNewDevice] = useState({
    name: "",
    model: "",
    customerId: customers[0]?.id || "",
    type: "Laptop",
    status: "Active",
    warranty: "Active",
    serialNumber: "",
    purchaseDate: new Date().toISOString().split("T")[0],
  });

  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!newDevice.name.trim()) newErrors.name = "Device name is required.";
    if (!newDevice.customerId) newErrors.customerId = "Please select a customer.";
    if (!newDevice.serialNumber.trim()) newErrors.serialNumber = "Serial number is required.";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    onSubmit({
      ...newDevice,
      name: newDevice.name.trim(),
      model: newDevice.model.trim() || "Standard Model",
      serialNumber: newDevice.serialNumber.trim(),
    });
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="modal-backdrop"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg max-h-[90dvh] bg-white dark:bg-[#1e293b] rounded-2xl shadow-2xl border border-slate-200 dark:border-[#334155] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <div className="shrink-0 px-6 py-4 border-b border-slate-100 dark:border-[#334155] flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Register New Device
            </h3>
            <button
              type="button"
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-lg transition-colors cursor-pointer"
              onClick={onClose}
              aria-label="Close"
            >
              <FiX size={18} />
            </button>
          </div>

          <div className="p-6 min-h-0 overflow-y-auto space-y-5">
            {/* Select Customer */}
            <div>
              <label className="field-label">
                Assign to Customer *
              </label>
              <select
                className="form-control cursor-pointer"
                value={newDevice.customerId}
                onChange={(e) =>
                  setNewDevice({ ...newDevice, customerId: e.target.value })
                }
                required
              >
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.id})
                  </option>
                ))}
              </select>
              {errors.customerId && (
                <small className="text-xs text-rose-500 mt-1 block">
                  {errors.customerId}
                </small>
              )}
            </div>

            {/* Device Name */}
            <div>
              <label className="field-label">
                Device Name / Make *
              </label>
              <input
                type="text"
                className="form-control"
                placeholder='e.g. MacBook Pro 14", ThinkPad T14, Galaxy S24'
                required
                value={newDevice.name}
                onChange={(e) =>
                  setNewDevice({ ...newDevice, name: e.target.value })
                }
              />
              {errors.name && (
                <small className="text-xs text-rose-500 mt-1 block">
                  {errors.name}
                </small>
              )}
            </div>

            {/* Model & Specifications */}
            <div>
              <label className="field-label">
                Model & Specifications
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. M3 Pro 18GB RAM / 512GB SSD"
                value={newDevice.model}
                onChange={(e) =>
                  setNewDevice({ ...newDevice, model: e.target.value })
                }
              />
            </div>

            {/* Type & Status */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="field-label">
                  Device Type
                </label>
                <select
                  className="form-control cursor-pointer"
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

              <div>
                <label className="field-label">
                  Hardware Status
                </label>
                <select
                  className="form-control cursor-pointer"
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

            {/* Warranty & Serial Number */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="field-label">
                  Warranty Status
                </label>
                <select
                  className="form-control cursor-pointer"
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

              <div>
                <label className="field-label">
                  Serial Number *
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. C02FX390MD6R"
                  required
                  value={newDevice.serialNumber}
                  onChange={(e) =>
                    setNewDevice({
                      ...newDevice,
                      serialNumber: e.target.value,
                    })
                  }
                />
                {errors.serialNumber && (
                  <small className="text-xs text-rose-500 mt-1 block">
                    {errors.serialNumber}
                  </small>
                )}
              </div>
            </div>
          </div>

          <div className="shrink-0 px-6 py-4 bg-slate-50 dark:bg-[#111827] border-t border-slate-100 dark:border-[#334155] flex flex-wrap items-center justify-end gap-3">
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Register Device</Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddDeviceModal;
