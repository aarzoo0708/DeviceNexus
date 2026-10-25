import { useState } from "react";
import { useSelector } from "react-redux";
import { FiX } from "react-icons/fi";
import Button from "../common/Button/Button";

function RegisterWarrantyModal({ onClose, onSubmit }) {
  const customers = useSelector((state) => state.customers || []);
  const devices = useSelector((state) => state.devices || []);

  const [formData, setFormData] = useState(() => {
    const initialCustomerId = customers[0]?.id || "";
    const initialDevices = devices.filter((d) => d.customerId === initialCustomerId);
    return {
      customerId: initialCustomerId,
      deviceId: initialDevices[0]?.id || "",
      warrantyType: "OEM Limited 1-Year",
      provider: "Official Manufacturer Care",
      durationYears: "1",
      coverage: "Manufacturing defect and hardware breakdown support.",
    };
  });
  const [errors, setErrors] = useState({});

  // Filter devices belonging to the selected customer
  const customerDevices = devices.filter((d) => d.customerId === formData.customerId);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "customerId") {
      const newCustDevices = devices.filter((d) => d.customerId === value);
      setFormData((prev) => ({
        ...prev,
        customerId: value,
        deviceId: newCustDevices[0]?.id || "",
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.customerId) {
      newErrors.customerId = "Select a customer.";
    }
    if (!formData.deviceId) {
      newErrors.deviceId = customerDevices.length === 0
        ? "This customer has no devices registered. Register a device first."
        : "Select a device.";
    }
    if (!formData.provider.trim()) {
      newErrors.provider = "Warranty provider is required.";
    }
    if (!formData.coverage.trim()) {
      newErrors.coverage = "Coverage details are required.";
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const selectedCustomer = customers.find((c) => c.id === formData.customerId);
    const selectedDevice = devices.find((d) => d.id === formData.deviceId);

    const startDate = new Date();
    const expiryDate = new Date();
    expiryDate.setFullYear(startDate.getFullYear() + Number(formData.durationYears));

    const newWarranty = {
      id: `WAR-${Math.floor(500 + Math.random() * 500)}`,
      deviceId: formData.deviceId,
      deviceName: selectedDevice?.name || "Customer Device",
      deviceType: selectedDevice?.type || "Hardware",
      serialNumber: selectedDevice?.serialNumber || "SN-UNKNOWN",
      customerId: formData.customerId,
      customerName: selectedCustomer?.name || "Customer",
      customerPhone: selectedCustomer?.phone || "N/A",
      warrantyType: formData.warrantyType,
      provider: formData.provider.trim(),
      purchaseDate: startDate.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      startDate: startDate.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      expiryDate: expiryDate.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      daysRemaining: Number(formData.durationYears) * 365,
      status: "Active",
      coverage: formData.coverage.trim(),
      deductible: "Standard policy terms apply",
      claimsCount: 0,
      claims: [],
    };

    onSubmit(newWarranty);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="modal-backdrop"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl max-h-[90dvh] bg-white dark:bg-[#1e293b] rounded-2xl shadow-2xl border border-slate-200 dark:border-[#334155] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="shrink-0 px-6 py-4 border-b border-slate-100 dark:border-[#334155] flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Register Device Warranty
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Add warranty policy or extended protection coverage
            </p>
          </div>
          <button
            type="button"
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-lg transition-colors cursor-pointer"
            onClick={onClose}
            aria-label="Close"
          >
            <FiX size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <div className="p-6 min-h-0 overflow-y-auto space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="field-label">
                  Select Customer *
                </label>
                <select
                  name="customerId"
                  className="form-control cursor-pointer"
                  value={formData.customerId}
                  onChange={handleChange}
                >
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.id})
                    </option>
                  ))}
                </select>
                {errors.customerId && (
                  <span className="text-xs text-rose-500 mt-1 block">{errors.customerId}</span>
                )}
              </div>

              <div>
                <label className="field-label">
                  Customer's Device *
                </label>
                <select
                  name="deviceId"
                  className="form-control cursor-pointer"
                  value={formData.deviceId}
                  onChange={handleChange}
                  disabled={customerDevices.length === 0}
                >
                  {customerDevices.length === 0 ? (
                    <option value="">No devices registered for this customer</option>
                  ) : (
                    customerDevices.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name} ({d.serialNumber})
                      </option>
                    ))
                  )}
                </select>
                {errors.deviceId && (
                  <span className="text-xs text-rose-500 mt-1 block">{errors.deviceId}</span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="field-label">
                  Warranty Plan Type
                </label>
                <select
                  name="warrantyType"
                  className="form-control cursor-pointer"
                  value={formData.warrantyType}
                  onChange={handleChange}
                >
                  <option value="OEM Limited 1-Year">OEM Limited 1-Year</option>
                  <option value="AppleCare+ Protection">AppleCare+ Protection</option>
                  <option value="Dell ProSupport Plus">Dell ProSupport Plus</option>
                  <option value="Extended Hardware Care">Extended Hardware Care</option>
                  <option value="Accidental Damage Protection">Accidental Damage Protection</option>
                </select>
              </div>

              <div>
                <label className="field-label">
                  Provider Name *
                </label>
                <input
                  type="text"
                  name="provider"
                  className="form-control"
                  value={formData.provider}
                  onChange={handleChange}
                  placeholder="e.g. Official Manufacturer Care"
                />
                {errors.provider && (
                  <span className="text-xs text-rose-500 mt-1 block">{errors.provider}</span>
                )}
              </div>
            </div>

            <div>
              <label className="field-label">
                Duration
              </label>
              <select
                name="durationYears"
                className="form-control cursor-pointer"
                value={formData.durationYears}
                onChange={handleChange}
              >
                <option value="1">1 Year Protection</option>
                <option value="2">2 Years Protection</option>
                <option value="3">3 Years Protection</option>
              </select>
            </div>

            <div>
              <label className="field-label">
                Coverage Details *
              </label>
              <textarea
                name="coverage"
                rows={3}
                className="form-control"
                value={formData.coverage}
                onChange={handleChange}
                placeholder="Describe terms, repair coverage, parts covered..."
              />
              {errors.coverage && (
                <span className="text-xs text-rose-500 mt-1 block">{errors.coverage}</span>
              )}
            </div>
          </div>

          <div className="shrink-0 px-6 py-4 bg-slate-50 dark:bg-[#111827] border-t border-slate-100 dark:border-[#334155] flex flex-wrap items-center justify-end gap-3">
            <Button variant="secondary" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={customerDevices.length === 0}>
              Register Warranty
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RegisterWarrantyModal;
