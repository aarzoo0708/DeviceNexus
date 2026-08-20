import React from "react";
import Badge from "../common/Badge/Badge";
import Button from "../common/Button/Button";
import { useNavigate } from "react-router";
import "./WarrantyDetailModal.css";

function WarrantyDetailModal({ warranty, onClose, onExtend }) {
  const navigate = useNavigate();
  if (!warranty) return null;

  const getStatusVariant = (status) => {
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

  const handleClaimViaServiceRequest = () => {
    onClose();
    navigate("/service-requests");
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card warranty-detail-card" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title-group">
            <div className="modal-req-badge">
              <span className="req-id">{warranty.id}</span>
              <Badge variant={getStatusVariant(warranty.status)}>
                {warranty.status}
              </Badge>
              {warranty.status === "Active" && (
                <span className="days-badge">{warranty.daysRemaining} days left</span>
              )}
              {warranty.status === "Expiring Soon" && (
                <span className="days-badge expiring-badge">⚠️ {warranty.daysRemaining} days left</span>
              )}
            </div>
            <h2 className="modal-title">{warranty.deviceName} — {warranty.warrantyType}</h2>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          {/* Info Grid */}
          <div className="info-grid">
            <div className="info-box">
              <span className="info-label">Customer</span>
              <span className="info-value">{warranty.customerName}</span>
              <span className="info-subtext">{warranty.customerPhone} ({warranty.customerId})</span>
            </div>

            <div className="info-box">
              <span className="info-label">Device Serial / ID</span>
              <span className="info-value">{warranty.serialNumber}</span>
              <span className="info-subtext">{warranty.deviceType} • {warranty.deviceId}</span>
            </div>

            <div className="info-box">
              <span className="info-label">Provider</span>
              <span className="info-value">{warranty.provider}</span>
              <span className="info-subtext">Plan: {warranty.warrantyType}</span>
            </div>

            <div className="info-box">
              <span className="info-label">Coverage Period</span>
              <span className="info-value">{warranty.startDate} – {warranty.expiryDate}</span>
              <span className="info-subtext">Purchased: {warranty.purchaseDate}</span>
            </div>
          </div>

          {/* Coverage Summary */}
          <div className="section-block">
            <h4 className="section-heading">Coverage Details & Perks</h4>
            <div className="coverage-box">
              <p className="coverage-text">{warranty.coverage}</p>
              <div className="deductible-info">
                <strong>Deductible / Terms:</strong> {warranty.deductible}
              </div>
            </div>
          </div>

          {/* Claims History */}
          <div className="section-block">
            <div className="claims-header-row">
              <h4 className="section-heading">Claims History ({warranty.claimsCount})</h4>
            </div>

            {warranty.claims && warranty.claims.length > 0 ? (
              <div className="claims-list">
                {warranty.claims.map((claim, idx) => (
                  <div key={idx} className="claim-card">
                    <div className="claim-header">
                      <span className="claim-id">{claim.claimId}</span>
                      <span className="claim-date">{claim.date}</span>
                    </div>
                    <div className="claim-body">
                      <span className="claim-issue">{claim.issue}</span>
                      <Badge variant="success">{claim.amountCovered}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-claims-box">
                <span>No service claims filed yet under this warranty policy.</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="modal-footer warranty-modal-footer">
          <Button variant="secondary" onClick={() => onExtend(warranty.id)}>
            🔄 Extend 1 Year
          </Button>
          <Button variant="primary" onClick={handleClaimViaServiceRequest}>
            ⚡ File Service Claim
          </Button>
        </div>
      </div>
    </div>
  );
}

export default WarrantyDetailModal;
