import Button from "../common/Button/Button";
import "./DeleteRepairModal.css";

function DeleteRepairModal({ repair, onClose, onConfirm }) {
  if (!repair) return null;

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-card modal-card-delete" onClick={(e) => e.stopPropagation()}>
        <div className="delete-modal-body">
          <div className="delete-warning-icon">⚠️</div>

          <h2 className="delete-title">Delete Repair Ticket?</h2>

          <p className="delete-desc">
            Are you sure you want to delete repair ticket{" "}
            <strong className="delete-highlight">{repair.id}</strong> for{" "}
            <strong>{repair.customerName}</strong> ({repair.deviceName})?
          </p>

          <div className="delete-item-preview">
            <div className="preview-row">
              <span className="preview-label">Device:</span>
              <span className="preview-val">{repair.deviceName} - {repair.deviceModel}</span>
            </div>
            <div className="preview-row">
              <span className="preview-label">Issue:</span>
              <span className="preview-val">{repair.issue}</span>
            </div>
            <div className="preview-row">
              <span className="preview-label">Status:</span>
              <span className="preview-val">{repair.status}</span>
            </div>
          </div>

          <p className="delete-subtext">
            This action will permanently remove this repair record from the system.
          </p>

          <div className="delete-actions">
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="danger" onClick={() => onConfirm(repair.id)}>
              Delete Ticket
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeleteRepairModal;
