import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { FiPlus, FiEye, FiEdit2, FiTrash2, FiAlertCircle } from "react-icons/fi";
import PageHeader from "../components/common/PageHeader/PageHeader";
import Button from "../components/common/Button/Button";
import Card from "../components/common/Card/Card";
import SearchInput from "../components/common/SearchInput/SearchInput";
import DataTable from "../components/common/DataTable/DataTable";
import Badge from "../components/common/Badge/Badge";
import ViewDeviceModal from "../components/devices/ViewDeviceModal";
import EditDeviceModal from "../components/devices/EditDeviceModal";
import AddDeviceModal from "../components/devices/AddDeviceModal";
import {
  addDevice,
  updateDevice,
  deleteDevice,
  retireDevice,
} from "../store/slices/devicesSlice";

function Devices() {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  // Redux store state
  const devices = useSelector((state) => state.devices || []);
  const customers = useSelector((state) => state.customers || []);
  const serviceRequests = useSelector((state) => state.serviceRequests || []);

  // Local filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [warrantyFilter, setWarrantyFilter] = useState("All");

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(
    () => Boolean(location.state?.openAddModal)
  );
  const [viewingDevice, setViewingDevice] = useState(null);
  const [editingDevice, setEditingDevice] = useState(null);
  const [notificationMsg, setNotificationMsg] = useState("");

  useEffect(() => {
    if (location.state?.openAddModal) {
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  const showNotification = (msg) => {
    setNotificationMsg(msg);
    setTimeout(() => setNotificationMsg(""), 4000);
  };

  // Helper to find customer name
  const getCustomerName = (customerId) => {
    const cust = customers.find((c) => c.id === customerId);
    return cust ? cust.name : "Unassigned";
  };

  // Badge Variant Helpers
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
    const customerName = getCustomerName(device.customerId).toLowerCase();

    const matchesSearch =
      !query ||
      device.id.toLowerCase().includes(query) ||
      device.name.toLowerCase().includes(query) ||
      (device.model && device.model.toLowerCase().includes(query)) ||
      (device.serialNumber && device.serialNumber.toLowerCase().includes(query)) ||
      customerName.includes(query);

    const matchesType = typeFilter === "All" || device.type === typeFilter;
    const matchesStatus = statusFilter === "All" || device.status === statusFilter;
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

    dispatch(addDevice(createdDevice));
    setIsAddModalOpen(false);
    showNotification(`Device ${createdDevice.id} registered successfully.`);
  };

  // Edit Device Handler
  const handleEditDeviceSubmit = (updatedDeviceData) => {
    dispatch(updateDevice(updatedDeviceData));
    setEditingDevice(null);
    showNotification(`Device ${updatedDeviceData.id} updated successfully.`);
  };

  // Delete / Retire Device Handler
  const handleDeleteOrRetire = (device) => {
    const hasActiveRequests = serviceRequests.some(
      (r) => r.deviceId === device.id && r.status !== "Resolved"
    );

    if (hasActiveRequests) {
      if (
        window.confirm(
          `Device ${device.id} has active service requests pending resolution. Mark device as 'Retired' instead of permanently deleting?`
        )
      ) {
        dispatch(retireDevice(device.id));
        showNotification(`Device ${device.id} has been marked as Retired.`);
      }
    } else {
      if (window.confirm(`Are you sure you want to remove device ${device.id}?`)) {
        dispatch(deleteDevice(device.id));
        showNotification(`Device ${device.id} deleted successfully.`);
      }
    }
  };

  // Columns definition for DataTable component
  const columns = [
    { key: "idDisplay", label: "Device ID" },
    { key: "name", label: "Device Name" },
    { key: "model", label: "Model / Specs" },
    { key: "customer", label: "Assigned Customer" },
    { key: "type", label: "Type" },
    { key: "statusBadge", label: "Status" },
    { key: "warrantyBadge", label: "Warranty" },
    { key: "actions", label: "Actions" },
  ];

  const tableData = filteredDevices.map((device) => ({
    id: device.id,
    idDisplay: <span className="font-mono font-bold text-blue-600 dark:text-blue-400">{device.id}</span>,
    name: <strong className="text-slate-900 dark:text-white">{device.name}</strong>,
    model: <span className="text-xs text-slate-500 dark:text-slate-400">{device.model}</span>,
    customer: (
      <span
        className="text-blue-600 hover:text-blue-700 dark:text-blue-400 cursor-pointer font-medium"
        onClick={() => navigate(`/customers/${device.customerId}`)}
        title="View customer profile"
      >
        {getCustomerName(device.customerId)}
      </span>
    ),
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
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 dark:border-[#334155] bg-slate-50 dark:bg-[#111827] hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
          title="View Details"
          onClick={() => setViewingDevice(device)}
        >
          <FiEye size={13} /> View
        </button>
        <button
          type="button"
          className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-blue-200 dark:border-blue-800/50 bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 text-blue-600 dark:text-blue-400 transition-colors cursor-pointer"
          title="Edit Device"
          onClick={() => setEditingDevice({ ...device })}
        >
          <FiEdit2 size={13} /> Edit
        </button>
        <button
          type="button"
          className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-rose-200 dark:border-rose-900/50 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 text-rose-600 dark:text-rose-400 transition-colors cursor-pointer"
          title="Delete or Retire Device"
          onClick={() => handleDeleteOrRetire(device)}
        >
          <FiTrash2 size={13} /> Remove
        </button>
      </div>
    ),
  }));

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Devices"
        description="Catalog, track hardware specifications, and manage customer device statuses."
        action={
          <Button onClick={() => setIsAddModalOpen(true)}>
            <span className="inline-flex items-center gap-1.5">
              <FiPlus size={16} /> Register Device
            </span>
          </Button>
        }
      />

      {notificationMsg && (
        <div className="p-4 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 rounded-xl text-xs font-medium flex items-center gap-2">
          <FiAlertCircle size={16} /> {notificationMsg}
        </div>
      )}

      {/* Search & Filters Toolbar */}
      <Card>
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <SearchInput
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by ID, device name, model, serial, or customer..."
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Type:</span>
              <select
                className="px-3 py-2 rounded-xl border border-slate-300 dark:border-[#334155] bg-white dark:bg-[#111827] text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500"
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

            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Status:</span>
              <select
                className="px-3 py-2 rounded-xl border border-slate-300 dark:border-[#334155] bg-white dark:bg-[#111827] text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All Statuses</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Retired">Retired</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Warranty:</span>
              <select
                className="px-3 py-2 rounded-xl border border-slate-300 dark:border-[#334155] bg-white dark:bg-[#111827] text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500"
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
      <DataTable
        columns={columns}
        data={tableData}
        minWidth="min-w-[960px]"
        emptyMessage="No devices found matching your criteria."
      />

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
