import { useState } from "react";
import { useSelector } from "react-redux";
import { FiX } from "react-icons/fi";
import Button from "../common/Button/Button";

function EditDeviceModal({ device, onClose, onSubmit }) {
  const customers = useSelector((state) => state.customers || []);

  const [formData, setFormData] = useState({
    id: device.id,
    name: device.name || "",
    model: device.model || "",
    customerId: device.customerId || (customers[0]?.id || ""),
    type: device.type || "Laptop",
    status: device.status || "Active",
    warranty: device.warranty || "Active",
    serialNumber: device.serialNumber || "",
    purchaseDate: device.purchaseDate || "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Device name is required.";
    if (!formData.customerId) newErrors.customerId = "Customer is required.";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    onSubmit({
      ...formData,
      name: formData.name.trim(),
      model: formData.model.trim() || "Standard Model",
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
              Edit Device — {device.id}
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
            <div>
              <label className="field-label">
                Assign to Customer *
              </label>
              <select
                name="customerId"
                className="form-control cursor-pointer"
                value={formData.customerId}
                onChange={handleChange}
                required
              >
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.id})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="field-label">
                Device Name / Make *
              </label>
              <input
                type="text"
                name="name"
                className="form-control"
                required
                value={formData.name}
                onChange={handleChange}
              />
              {errors.name && (
                <small className="text-xs text-rose-500 mt-1 block">{errors.name}</small>
              )}
            </div>

            <div>
              <label className="field-label">
                Model & Specifications
              </label>
              <input
                type="text"
                name="model"
                className="form-control"
                value={formData.model}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="field-label">
                  Device Type
                </label>
                <select
                  name="type"
                  className="form-control cursor-pointer"
                  value={formData.type}
                  onChange={handleChange}
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
                  name="status"
                  className="form-control cursor-pointer"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Retired">Retired</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="field-label">
                  Warranty Status
                </label>
                <select
                  name="warranty"
                  className="form-control cursor-pointer"
                  value={formData.warranty}
                  onChange={handleChange}
                >
                  <option value="Active">Active</option>
                  <option value="Expiring Soon">Expiring Soon</option>
                  <option value="Expired">Expired</option>
                </select>
              </div>

              <div>
                <label className="field-label">
                  Serial Number
                </label>
                <input
                  type="text"
                  name="serialNumber"
                  className="form-control"
                  value={formData.serialNumber}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="shrink-0 px-6 py-4 bg-slate-50 dark:bg-[#111827] border-t border-slate-100 dark:border-[#334155] flex flex-wrap items-center justify-end gap-3">
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
