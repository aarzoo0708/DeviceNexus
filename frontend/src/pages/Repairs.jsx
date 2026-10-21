import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import PageHeader from "../components/common/PageHeader/PageHeader";
import Button from "../components/common/Button/Button";
import SearchInput from "../components/common/SearchInput/SearchInput";
import DataTable from "../components/common/DataTable/DataTable";
import RepairFilters from "../components/repairs/RepairFilters";
import AddRepairModal from "../components/repairs/AddRepairModal";
import RepairDetailModal from "../components/repairs/RepairDetailModal";
import EditRepairModal from "../components/repairs/EditRepairModal";
import DeleteRepairModal from "../components/repairs/DeleteRepairModal";
import {
  columns,
  getRepairTableData,
} from "../components/repairs/RepairTableConfig";
import {
  getRepairs,
  addRepair,
  updateRepair,
  updateRepairStatus,
  deleteRepair,
  onDataChange,
} from "../data/mockData";
import "./Repairs.css";

function Repairs() {
  const location = useLocation();
  const navigate = useNavigate();

  // Initialize with location state if navigated via shortcut
  const [isAddModalOpen, setIsAddModalOpen] = useState(
    () => Boolean(location.state?.openAddModal)
  );
  const [repairs, setRepairs] = useState(() => getRepairs());
  const [searchQuery, setSearchQuery] = useState("");
  const [activeStatus, setActiveStatus] = useState("All");
  const [activePriority, setActivePriority] = useState("All");

  // Modals state
  const [selectedRepair, setSelectedRepair] = useState(null);
  const [editingRepair, setEditingRepair] = useState(null);
  const [deletingRepair, setDeletingRepair] = useState(null);

  // User feedback toast/alert
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification((prev) => (prev?.message === message ? null : prev));
    }, 4000);
  };

  // Clean location state if it had openAddModal
  useEffect(() => {
    if (location.state?.openAddModal) {
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  // Subscribe to central data changes (including cross-tab and localStorage)
  useEffect(() => {
    const refreshData = () => {
      const latest = getRepairs();
      setRepairs(latest);
      // Keep selectedRepair in sync if open
      setSelectedRepair((prev) =>
        prev ? latest.find((r) => r.id === prev.id) || null : null
      );
    };

    const unsubscribe = onDataChange(refreshData);
    return unsubscribe;
  }, []);

  // Summary counts for KPI cards & status chips
  const counts = {
    All: repairs.length,
    New: 0,
    Assigned: 0,
    "In Progress": 0,
    "Waiting for Parts": 0,
    Completed: 0,
    Cancelled: 0,
  };

  repairs.forEach((rep) => {
    if (counts[rep.status] !== undefined) {
      counts[rep.status]++;
    }
  });

  const totalRepairsCount = repairs.length;
  const newPendingCount = (counts.New || 0) + (counts.Assigned || 0);
  const inProgressCount =
    (counts["In Progress"] || 0) + (counts["Waiting for Parts"] || 0);
  const completedCount = counts.Completed || 0;

  // Filter repairs by search query, status chip, and priority filter
  const filteredRepairs = repairs.filter((rep) => {
    const matchesStatus =
      activeStatus === "All" || rep.status === activeStatus;

    const matchesPriority =
      activePriority === "All" || rep.priority === activePriority;

    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      rep.id.toLowerCase().includes(query) ||
      rep.customerName.toLowerCase().includes(query) ||
      rep.deviceName.toLowerCase().includes(query) ||
      (rep.deviceModel && rep.deviceModel.toLowerCase().includes(query)) ||
      rep.issue.toLowerCase().includes(query) ||
      (rep.assignedTechnician &&
        rep.assignedTechnician.toLowerCase().includes(query));

    return matchesStatus && matchesPriority && matchesSearch;
  });

  // Action handlers
  const handleAddRepair = (newRepair) => {
    addRepair(newRepair);
    setIsAddModalOpen(false);
    showNotification(`New repair ticket ${newRepair.id} registered successfully.`);
  };

  const handleQuickStatusChange = (id, newStatus) => {
    updateRepairStatus(id, newStatus, `Quick-updated to ${newStatus} from table`);
    showNotification(`Repair ${id} status transitioned to "${newStatus}".`);
  };

  const handleModalStatusChange = (id, newStatus, note) => {
    updateRepairStatus(id, newStatus, note);
    showNotification(`Repair ${id} updated to "${newStatus}".`);
  };

  const handleSaveEdit = (updatedRepair) => {
    updateRepair(updatedRepair);
    setEditingRepair(null);
    if (selectedRepair && selectedRepair.id === updatedRepair.id) {
      setSelectedRepair(updatedRepair);
    }
    showNotification(`Repair ticket ${updatedRepair.id} updated successfully.`);
  };

  const handleConfirmDelete = (id) => {
    deleteRepair(id);
    setDeletingRepair(null);
    if (selectedRepair && selectedRepair.id === id) {
      setSelectedRepair(null);
    }
    showNotification(`Repair ticket ${id} has been deleted.`, "warning");
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setActiveStatus("All");
    setActivePriority("All");
  };

  const hasActiveFilters =
    searchQuery.trim() !== "" ||
    activeStatus !== "All" ||
    activePriority !== "All";

  const tableData = getRepairTableData(filteredRepairs, {
    onSelectRepair: (rep) => setSelectedRepair(rep),
    onEditRepair: (rep) => setEditingRepair(rep),
    onDeleteRepair: (rep) => setDeletingRepair(rep),
    onQuickStatusChange: handleQuickStatusChange,
  });

  return (
    <div className="page-container repairs-page">
      {/* Toast Notification Banner */}
      {notification && (
        <div className={`repair-alert-banner alert-${notification.type}`}>
          <span className="alert-icon">
            {notification.type === "success" ? "✓" : "ℹ"}
          </span>
          <span className="alert-message">{notification.message}</span>
          <button
            type="button"
            className="alert-close"
            onClick={() => setNotification(null)}
            aria-label="Dismiss alert"
          >
            ✕
          </button>
        </div>
      )}

      {/* Page Header */}
      <PageHeader
        title="Repairs"
        description="Track hardware diagnostics, parts procurement, bench workload, and technician assignments."
        action={
          <Button onClick={() => setIsAddModalOpen(true)}>
            + Add Repair
          </Button>
        }
      />

      {/* 4 Interactive Dashboard Summary Cards */}
      <div className="repairs-dashboard-grid">
        <button
          type="button"
          className={`repair-stat-card ${activeStatus === "All" ? "stat-card-active" : ""}`}
          onClick={() => {
            setActiveStatus("All");
            setActivePriority("All");
          }}
          title="Click to view all repairs"
        >
          <div className="stat-card-header">
            <span className="stat-card-label">Total Repairs</span>
            <span className="stat-card-icon icon-total">🔧</span>
          </div>
          <div className="stat-card-value">{totalRepairsCount}</div>
          <div className="stat-card-subtext">All active &amp; archived tickets</div>
        </button>

        <button
          type="button"
          className={`repair-stat-card ${activeStatus === "New" || activeStatus === "Assigned" ? "stat-card-active" : ""}`}
          onClick={() => setActiveStatus(activeStatus === "New" ? "Assigned" : "New")}
          title="Click to view pending intake & assigned tickets"
        >
          <div className="stat-card-header">
            <span className="stat-card-label">New / Pending</span>
            <span className="stat-card-icon icon-pending">⏳</span>
          </div>
          <div className="stat-card-value text-warning">{newPendingCount}</div>
          <div className="stat-card-subtext">
            {counts.New || 0} New · {counts.Assigned || 0} Assigned to bench
          </div>
        </button>

        <button
          type="button"
          className={`repair-stat-card ${activeStatus === "In Progress" || activeStatus === "Waiting for Parts" ? "stat-card-active" : ""}`}
          onClick={() =>
            setActiveStatus(activeStatus === "In Progress" ? "Waiting for Parts" : "In Progress")
          }
          title="Click to view repairs under active benchwork"
        >
          <div className="stat-card-header">
            <span className="stat-card-label">Repairs In Progress</span>
            <span className="stat-card-icon icon-progress">⚡</span>
          </div>
          <div className="stat-card-value text-info">{inProgressCount}</div>
          <div className="stat-card-subtext">
            {counts["In Progress"] || 0} Active · {counts["Waiting for Parts"] || 0} Awaiting parts
          </div>
        </button>

        <button
          type="button"
          className={`repair-stat-card ${activeStatus === "Completed" ? "stat-card-active" : ""}`}
          onClick={() => setActiveStatus("Completed")}
          title="Click to view completed repairs"
        >
          <div className="stat-card-header">
            <span className="stat-card-label">Completed Repairs</span>
            <span className="stat-card-icon icon-completed">✓</span>
          </div>
          <div className="stat-card-value text-success">{completedCount}</div>
          <div className="stat-card-subtext">Passed QC · Ready for pickup</div>
        </button>
      </div>

      {/* Search Bar */}
      <div className="repair-controls-row">
        <div className="repair-search-box">
          <SearchInput
            placeholder="Search by ID, customer, device, model, issue, or tech..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Filter Chips & Priority Dropdown Bar */}
      <RepairFilters
        activeStatus={activeStatus}
        onSelectStatus={setActiveStatus}
        counts={counts}
        activePriority={activePriority}
        onSelectPriority={setActivePriority}
        onClearFilters={handleClearFilters}
        hasActiveFilters={hasActiveFilters}
      />

      {/* Main Repair Table */}
      {tableData.length > 0 ? (
        <DataTable columns={columns} data={tableData} />
      ) : (
        <div className="repair-empty-state">
          <div className="empty-icon">🔧</div>
          <h3>No Repair Tickets Found</h3>
          <p>
            {hasActiveFilters
              ? "No repair tickets matched your active search query or filter selection."
              : "No repair tickets recorded in the system yet."}
          </p>
          <div className="empty-actions">
            {hasActiveFilters && (
              <Button variant="secondary" onClick={handleClearFilters}>
                Clear Filters
              </Button>
            )}
            <Button variant="primary" onClick={() => setIsAddModalOpen(true)}>
              + Add First Repair
            </Button>
          </div>
        </div>
      )}

      {/* Add Repair Modal */}
      {isAddModalOpen && (
        <AddRepairModal
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={handleAddRepair}
        />
      )}

      {/* Repair Detail Modal */}
      {selectedRepair && (
        <RepairDetailModal
          repair={selectedRepair}
          onClose={() => setSelectedRepair(null)}
          onStatusChange={handleModalStatusChange}
          onEdit={(rep) => {
            setSelectedRepair(null);
            setEditingRepair(rep);
          }}
        />
      )}

      {/* Edit Repair Modal */}
      {editingRepair && (
        <EditRepairModal
          repair={editingRepair}
          onClose={() => setEditingRepair(null)}
          onSave={handleSaveEdit}
        />
      )}

      {/* Delete Repair Confirmation Modal */}
      {deletingRepair && (
        <DeleteRepairModal
          repair={deletingRepair}
          onClose={() => setDeletingRepair(null)}
          onConfirm={handleConfirmDelete}
        />
      )}
    </div>
  );
}

export default Repairs;
