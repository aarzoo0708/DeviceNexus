import { useState, useEffect } from "react";
import PageHeader from "../components/common/PageHeader/PageHeader";
import Button from "../components/common/Button/Button";
import Card from "../components/common/Card/Card";
import SearchInput from "../components/common/SearchInput/SearchInput";
import DataTable from "../components/common/DataTable/DataTable";
import Badge from "../components/common/Badge/Badge";
import { getDevices, saveDevices, onDataChange } from "../data/mockData";
import "./Devices.css";

function Devices() {
  const [devices, setDevices] = useState(() => getDevices());
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [warrantyFilter, setWarrantyFilter] = useState("All");

  useEffect(() => {
    const updateDevices = () => setDevices(getDevices());
    const unsubscribe = onDataChange(updateDevices);
    return unsubscribe;
  }, []);


  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [viewingDevice, setViewingDevice] = useState(null);
  const [editingDevice, setEditingDevice] = useState(null);

  // Form State for Adding New Device
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

  // Badge Variant Helper Functions
  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case "Active":
        return "success";
      case "In Repair":
        return "warning";
      case "Inactive":
        return "default";
      case "Retired":
        return "danger";
      default:
        return "default";
    }
  };

  const getWarrantyBadgeVariant = (warranty) => {
    switch (warranty) {
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

  // Filter Logic
  const filteredDevices = devices.filter((device) => {
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      device.id.toLowerCase().includes(query) ||
      device.name.toLowerCase().includes(query) ||
      device.model.toLowerCase().includes(query) ||
      device.customer.toLowerCase().includes(query);

    const matchesType =
      typeFilter === "All" || device.type === typeFilter;
    const matchesStatus =
      statusFilter === "All" || device.status === statusFilter;
    const matchesWarranty =
      warrantyFilter === "All" || device.warranty === warrantyFilter;

    return matchesSearch && matchesType && matchesStatus && matchesWarranty;
  });

  // Add Device Handler
  const handleAddDeviceSubmit = (e) => {
    e.preventDefault();
    if (!newDevice.name.trim() || !newDevice.customer.trim()) return;

    const nextIdNumber = 1000 + devices.length + 1;
    const createdDevice = {
      ...newDevice,
      id: `DEV-${nextIdNumber}`,
    };

    const updated = [...devices, createdDevice];
    saveDevices(updated);
    setIsAddModalOpen(false);
    setNewDevice({
      name: "",
      model: "",
      customer: "",
      type: "Laptop",
      status: "Active",
      warranty: "Active",
      serialNumber: "",
      purchaseDate: new Date().toISOString().split("T")[0],
    });
  };

  // Edit Device Handler
  const handleEditDeviceSubmit = (e) => {
    e.preventDefault();
    if (!editingDevice) return;

    const updated = devices.map((device) =>
      device.id === editingDevice.id ? editingDevice : device
    );
    saveDevices(updated);
    setEditingDevice(null);
  };


  // Columns definition for DataTable component
  const columns = [
    { key: "idDisplay", label: "Device ID" },
    { key: "name", label: "Device Name" },
    { key: "model", label: "Model" },
    { key: "customer", label: "Customer" },
    { key: "type", label: "Device Type" },
    { key: "statusBadge", label: "Status" },
    { key: "warrantyBadge", label: "Warranty" },
    { key: "actions", label: "Actions" },
  ];

  // Map filtered devices to table row format compatible with DataTable
  const tableData = filteredDevices.map((device) => ({
    id: device.id,
    idDisplay: <span className="device-id-cell">{device.id}</span>,
    name: device.name,
    model: device.model,
    customer: device.customer,
    type: device.type,
    statusBadge: (
      <Badge variant={getStatusBadgeVariant(device.status)}>
        {device.status}
      </Badge>
    ),
    warrantyBadge: (
      <Badge variant={getWarrantyBadgeVariant(device.warranty)}>
        {device.warranty}
      </Badge>
    ),
    actions: (
      <div className="action-buttons">
        <button
          type="button"
          className="btn-action-view"
          onClick={() => setViewingDevice(device)}
        >
          View
        </button>
        <button
          type="button"
          className="btn-action-edit"
          onClick={() => setEditingDevice({ ...device })}
        >
          Edit
        </button>
      </div>
    ),
  }));

  return (
    <div className="devices-page">
      {/* Page Header */}
      <PageHeader
        title="Devices"
        description="Manage and track customer hardware devices, warranty information, and repair status."
        action={
          <Button onClick={() => setIsAddModalOpen(true)}>
            + Add Device
          </Button>
        }
      />

      {/* Search & Filters Toolbar */}
      <Card>
        <div className="devices-toolbar">
          <div className="devices-search-container">
            <SearchInput
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by ID, name, model, customer..."
            />
          </div>

          <div className="devices-filters">
            <div className="filter-group">
              <span className="filter-label">Type:</span>
              <select
                className="filter-select"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value="All">All Types</option>
                <option value="Laptop">Laptop</option>
                <option value="Smartphone">Smartphone</option>
                <option value="Tablet">Tablet</option>
                <option value="Desktop">Desktop</option>
                <option value="Smartwatch">Smartwatch</option>
                <option value="Printer">Printer</option>
              </select>
            </div>

            <div className="filter-group">
              <span className="filter-label">Status:</span>
              <select
                className="filter-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All Statuses</option>
                <option value="Active">Active</option>
                <option value="In Repair">In Repair</option>
                <option value="Inactive">Inactive</option>
                <option value="Retired">Retired</option>
              </select>
            </div>

            <div className="filter-group">
              <span className="filter-label">Warranty:</span>
              <select
                className="filter-select"
                value={warrantyFilter}
                onChange={(e) => setWarrantyFilter(e.target.value)}
              >
                <option value="All">All Warranties</option>
                <option value="Active">Active</option>
                <option value="Expiring Soon">Expiring Soon</option>
                <option value="Expired">Expired</option>
              </select>
            </div>
          </div>
        </div>
      </Card>

      {/* Devices Data Table */}
      <Card>
        {tableData.length > 0 ? (
          <DataTable columns={columns} data={tableData} />
        ) : (
          <div className="empty-state">
            <h3>No devices found</h3>
            <p>Try adjusting your search criteria or filter options.</p>
          </div>
        )}
      </Card>

      {/* View Device Details Modal */}
      {viewingDevice && (
        <div className="modal-backdrop" onClick={() => setViewingDevice(null)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Device Details — {viewingDevice.id}</h3>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setViewingDevice(null)}
              >
                &times;
              </button>
            </div>

            <div className="modal-body">
              <div className="detail-grid">
                <div className="detail-item">
                  <span className="detail-label">Device Name</span>
                  <span className="detail-value">{viewingDevice.name}</span>
                </div>

                <div className="detail-item">
                  <span className="detail-label">Customer</span>
                  <span className="detail-value">{viewingDevice.customer}</span>
                </div>

                <div className="detail-item">
                  <span className="detail-label">Model</span>
                  <span className="detail-value">{viewingDevice.model}</span>
                </div>

                <div className="detail-item">
                  <span className="detail-label">Device Type</span>
                  <span className="detail-value">{viewingDevice.type}</span>
                </div>

                <div className="detail-item">
                  <span className="detail-label">Serial Number</span>
                  <span className="detail-value">{viewingDevice.serialNumber || "N/A"}</span>
                </div>

                <div className="detail-item">
                  <span className="detail-label">Purchase Date</span>
                  <span className="detail-value">{viewingDevice.purchaseDate || "N/A"}</span>
                </div>

                <div className="detail-item">
                  <span className="detail-label">Status</span>
                  <div>
                    <Badge variant={getStatusBadgeVariant(viewingDevice.status)}>
                      {viewingDevice.status}
                    </Badge>
                  </div>
                </div>

                <div className="detail-item">
                  <span className="detail-label">Warranty Status</span>
                  <div>
                    <Badge variant={getWarrantyBadgeVariant(viewingDevice.warranty)}>
                      {viewingDevice.warranty}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <Button
                variant="secondary"
                onClick={() => setViewingDevice(null)}
              >
                Close
              </Button>
              <Button
                onClick={() => {
                  setEditingDevice({ ...viewingDevice });
                  setViewingDevice(null);
                }}
              >
                Edit Device
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Device Modal */}
      {editingDevice && (
        <div className="modal-backdrop" onClick={() => setEditingDevice(null)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <form onSubmit={handleEditDeviceSubmit}>
              <div className="modal-header">
                <h3>Edit Device — {editingDevice.id}</h3>
                <button
                  type="button"
                  className="modal-close-btn"
                  onClick={() => setEditingDevice(null)}
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
                    required
                    value={editingDevice.name}
                    onChange={(e) =>
                      setEditingDevice({ ...editingDevice, name: e.target.value })
                    }
                  />
                </div>

                <div className="form-group">
                  <label>Customer *</label>
                  <input
                    type="text"
                    className="form-control"
                    required
                    value={editingDevice.customer}
                    onChange={(e) =>
                      setEditingDevice({
                        ...editingDevice,
                        customer: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="form-group">
                  <label>Model Description</label>
                  <input
                    type="text"
                    className="form-control"
                    value={editingDevice.model}
                    onChange={(e) =>
                      setEditingDevice({
                        ...editingDevice,
                        model: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Device Type</label>
                    <select
                      className="form-control"
                      value={editingDevice.type}
                      onChange={(e) =>
                        setEditingDevice({
                          ...editingDevice,
                          type: e.target.value,
                        })
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
                    <label>Status</label>
                    <select
                      className="form-control"
                      value={editingDevice.status}
                      onChange={(e) =>
                        setEditingDevice({
                          ...editingDevice,
                          status: e.target.value,
                        })
                      }
                    >
                      <option value="Active">Active</option>
                      <option value="In Repair">In Repair</option>
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
                      value={editingDevice.warranty}
                      onChange={(e) =>
                        setEditingDevice({
                          ...editingDevice,
                          warranty: e.target.value,
                        })
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
                      value={editingDevice.serialNumber}
                      onChange={(e) =>
                        setEditingDevice({
                          ...editingDevice,
                          serialNumber: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <Button
                  variant="secondary"
                  onClick={() => setEditingDevice(null)}
                >
                  Cancel
                </Button>
                <Button type="submit">Save Changes</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Device Modal */}
      {isAddModalOpen && (
        <div
          className="modal-backdrop"
          onClick={() => setIsAddModalOpen(false)}
        >
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <form onSubmit={handleAddDeviceSubmit}>
              <div className="modal-header">
                <h3>Add New Device</h3>
                <button
                  type="button"
                  className="modal-close-btn"
                  onClick={() => setIsAddModalOpen(false)}
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
                      <option value="In Repair">In Repair</option>
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
                <Button
                  variant="secondary"
                  onClick={() => setIsAddModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Create Device</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Devices;