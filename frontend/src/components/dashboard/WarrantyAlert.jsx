import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { getWarranties, onDataChange } from "../../data/mockData";
import "./WarrantyAlert.css";

function WarrantyAlert() {
  const navigate = useNavigate();
  const [warranties, setWarranties] = useState(() => getWarranties());

  useEffect(() => {
    const updateWarranties = () => setWarranties(getWarranties());
    const unsubscribe = onDataChange(updateWarranties);
    return unsubscribe;
  }, []);

  // Filter alerts: expiring soon or top active devices
  const alertWarranties = warranties
    .filter((w) => w.status === "Expiring Soon" || w.status === "Active")
    .slice(0, 3);

  const activeCount = warranties.filter((w) => w.status === "Active").length;

  return (
    <section className="warranty-card">
      <div className="warranty-header">
        <div>
          <p className="section-label">DEVICE HEALTH</p>
          <h2>Warranty Alerts</h2>
        </div>

        <button
          type="button"
          className="view-all-button"
          onClick={() => navigate("/warranty")}
        >
          View all →
        </button>
      </div>

      <div className="warranty-list">
        {alertWarranties.length > 0 ? (
          alertWarranties.map((w) => (
            <div
              className="warranty-item"
              key={w.id}
              onClick={() => navigate("/warranty")}
              style={{ cursor: "pointer" }}
              title="Click to view warranty policy"
            >
              <div className="warranty-icon">
                {w.status === "Expiring Soon" ? "⚠️" : "🛡️"}
              </div>

              <div className="warranty-info">
                <strong>{w.deviceName}</strong>
                <span>
                  {w.deviceType} · {w.serialNumber}
                </span>
              </div>

              <div className="warranty-days">
                <strong>{w.daysRemaining}</strong>
                <span>days</span>
              </div>
            </div>
          ))
        ) : (
          <div style={{ padding: "16px", textAlign: "center", color: "var(--text-muted)", fontSize: "13px" }}>
            No active warranty alerts.
          </div>
        )}
      </div>

      <div className="warranty-footer">
        <span>✓ {activeCount} warranties currently active</span>
      </div>
    </section>
  );
}

export default WarrantyAlert;