import React, { useState } from "react";
import Button from "../common/Button/Button";
import { getCustomers, getDevices } from "../../data/mockData";
import "./RegisterWarrantyModal.css";

function RegisterWarrantyModal({ onClose, onSubmit }) {
  const customers = getCustomers();
  const devices = getDevices();

  const [formData, setFormData] = useState({
    customerId: customers[0]?.id || "",
    deviceId: devices[0]?.id || "",
    warrantyType: "OEM Limited 1-Year",
    provider: "Official Manufacturer Care",
    durationYears: 1,
    coverage: "Manufacturing defect and hardware breakdown support.",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

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
      serialNumber: selectedDevice?.serialNumber || `SN-${Math.floor(100000 + Math.random() * 900000)}`,
      customerId: formData.customerId,
      customerName: selectedCustomer?.name || "Customer",
      customerPhone: selectedCustomer?.phone || "9999999999",
      warrantyType: formData.warrantyType,
      provider: formData.provider,
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
      coverage: formData.coverage,
      deductible: "Standard policy terms apply",
      claimsCount: 0,
      claims: [],
    };

    onSubmit(newWarranty);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card register-warranty-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2 className="modal-title">Register Device Warranty</h2>
            <p className="modal-subtitle">Add warranty policy or extended protection coverage</p>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body form-body">
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Select Customer</label>
              <select
                name="customerId"
                className="form-control"
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

            <div className="form-group">
              <label className="form-label">Select Device</label>
              <select
                name="deviceId"
                className="form-control"
                value={formData.deviceId}
                onChange={handleChange}
                required
              >
                {devices.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name} — {d.type} ({d.id})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Warranty Plan / Type</label>
              <select
                name="warrantyType"
                className="form-control"
                value={formData.warrantyType}
                onChange={handleChange}
              >
                <option value="OEM Limited 1-Year">OEM Limited 1-Year</option>
                <option value="AppleCare+ Protection">AppleCare+ Protection</option>
                <option value="Extended Hardware Shield (2-Year)">Extended Hardware Shield (2-Year)</option>
                <option value="Premier On-Site Support">Premier On-Site Support</option>
                <option value="Complete Accidental & Liquid Cover">Complete Accidental & Liquid Cover</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Coverage Duration</label>
              <select
                name="durationYears"
                className="form-control"
                value={formData.durationYears}
                onChange={handleChange}
              >
                <option value={1}>1 Year</option>
                <option value={2}>2 Years</option>
                <option value={3}>3 Years</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Warranty Provider</label>
            <input
              type="text"
              name="provider"
              className="form-control"
              placeholder="e.g. AppleCare, Dell Direct, Samsung Care+, SquareTrade"
              value={formData.provider}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Coverage Terms & Inclusions</label>
            <textarea
              name="coverage"
              rows={3}
              className="form-control"
              placeholder="Details about hardware, accidental drop, liquid or screen replacement..."
              value={formData.coverage}
              onChange={handleChange}
            />
          </div>

          <div className="modal-footer form-footer">
            <Button variant="secondary" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Register Warranty
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RegisterWarrantyModal;
