import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import PageHeader from "../components/common/PageHeader/PageHeader";
import Button from "../components/common/Button/Button";
import Card from "../components/common/Card/Card";
import SearchInput from "../components/common/SearchInput/SearchInput";
import DataTable from "../components/common/DataTable/DataTable";
import Badge from "../components/common/Badge/Badge";
import ViewDeviceModal from "../components/devices/ViewDeviceModal";
import EditDeviceModal from "../components/devices/EditDeviceModal";
import AddDeviceModal from "../components/devices/AddDeviceModal";
import { getDevices, saveDevices, onDataChange } from "../data/mockData";
import "./Devices.css";

function Devices() {
  const [devices, setDevices] = useState(() => getDevices());
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [warrantyFilter, setWarrantyFilter] = useState("All");

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state?.openAddModal) {
      setIsAddModalOpen(true);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  useEffect(() => {
    const updateDevices = () => setDevices(getDevices());
    const unsubscribe = onDataChange(updateDevices);
    return unsubscribe;
  }, []);


  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [viewingDevice, setViewingDevice] = useState(null);
  const [editingDevice, setEditingDevice] = useState(null);

  // Badge Variant Helper Functions
  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case "Active":
        return "success";

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
  const handleAddDeviceSubmit = (newDeviceData) => {
    const nextIdNumber = 1000 + devices.length + 1;
    const createdDevice = {
      ...newDeviceData,
      id: `DEV-${nextIdNumber}`,
    };

    const updated = [...devices, createdDevice];
    saveDevices(updated);
    setIsAddModalOpen(false);
  };

  // Edit Device Handler
  const handleEditDeviceSubmit = (updatedDeviceData) => {
    const updated = devices.map((device) =>
      device.id === updatedDeviceData.id ? updatedDeviceData : device
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
        description="Manage and track customer hardware devices and warranty information."
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
        <ViewDeviceModal
          device={viewingDevice}
          onClose={() => setViewingDevice(null)}
          onEdit={() => {
            setEditingDevice({ ...viewingDevice });
            setViewingDevice(null);
          }}
          getStatusBadgeVariant={getStatusBadgeVariant}
          getWarrantyBadgeVariant={getWarrantyBadgeVariant}
        />
      )}

      {/* Edit Device Modal */}
      {editingDevice && (
        <EditDeviceModal
          device={editingDevice}
          onClose={() => setEditingDevice(null)}
          onSubmit={handleEditDeviceSubmit}
        />
      )}

      {/* Add Device Modal */}
      {isAddModalOpen && (
        <AddDeviceModal
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={handleAddDeviceSubmit}
        />
      )}
    </div>
  );
}

export default Devices;