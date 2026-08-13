import "./WarrantyAlert.css";

const warrantyDevices = [
  {
    name: "ASUS Vivobook",
    serial: "DV-AS-2048",
    daysLeft: 12,
    type: "Laptop"
  },
  {
    name: "iPhone 15",
    serial: "DV-IP-3812",
    daysLeft: 21,
    type: "Smartphone"
  },
  {
    name: "Dell Inspiron",
    serial: "DV-DE-1194",
    daysLeft: 34,
    type: "Laptop"
  }
];

function WarrantyAlert() {
  return (
    <section className="warranty-card">

      <div className="warranty-header">

        <div>
          <p className="section-label">
            DEVICE HEALTH
          </p>

          <h2>Warranty Alerts</h2>
        </div>

        <button className="view-all-button">
          View all →
        </button>

      </div>

      <div className="warranty-list">

        {warrantyDevices.map((device) => (

          <div
            className="warranty-item"
            key={device.serial}
          >

            <div className="warranty-icon">
              ⚠
            </div>

            <div className="warranty-info">

              <strong>
                {device.name}
              </strong>

              <span>
                {device.type} · {device.serial}
              </span>

            </div>

            <div className="warranty-days">

              <strong>
                {device.daysLeft}
              </strong>

              <span>
                days
              </span>

            </div>

          </div>

        ))}

      </div>

      <div className="warranty-footer">

        <span>
          ✓ 12 warranties currently active
        </span>

      </div>

    </section>
  );
}

export default WarrantyAlert;