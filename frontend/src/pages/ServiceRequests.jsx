import React, { useState, useEffect, useMemo } from "react";
import PageHeader from "../components/common/PageHeader/PageHeader";
import Button from "../components/common/Button/Button";
import SearchInput from "../components/common/SearchInput/SearchInput";
import DataTable from "../components/common/DataTable/DataTable";
import Badge from "../components/common/Badge/Badge";
import ServiceRequestFilters from "../components/serviceRequests/ServiceRequestFilters";
import ServiceRequestDetailModal from "../components/serviceRequests/ServiceRequestDetailModal";
import NewServiceRequestModal from "../components/serviceRequests/NewServiceRequestModal";
import {
  getServiceRequests,
  addServiceRequest,
  updateServiceRequestStatus,
  onDataChange,
} from "../data/mockData";
import "./ServiceRequests.css";

function ServiceRequests() {
  const [requests, setRequests] = useState(() => getServiceRequests());
  const [searchQuery, setSearchQuery] = useState("");
  const [activeStatus, setActiveStatus] = useState("All");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    const refreshData = () => setRequests(getServiceRequests());
    const unsubscribe = onDataChange(refreshData);
    return unsubscribe;
  }, []);

  // Compute status counts for filter chips
  const counts = useMemo(() => {
    const countMap = {
      All: requests.length,
      New: 0,
      Assigned: 0,
      "In Progress": 0,
      Resolved: 0,
      "On Hold": 0,
    };

    requests.forEach((req) => {
      if (countMap[req.status] !== undefined) {
        countMap[req.status]++;
      }
    });

    return countMap;
  }, [requests]);

  // Filter requests by search query and active status
  const filteredRequests = useMemo(() => {
    return requests.filter((req) => {
      const matchesStatus =
        activeStatus === "All" || req.status === activeStatus;

      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        req.id.toLowerCase().includes(query) ||
        req.customerName.toLowerCase().includes(query) ||
        req.deviceName.toLowerCase().includes(query) ||
        req.issue.toLowerCase().includes(query) ||
        (req.assignedTo && req.assignedTo.toLowerCase().includes(query));

      return matchesStatus && matchesSearch;
    });
  }, [requests, activeStatus, searchQuery]);

  // Handler for adding a new service request
  const handleCreateRequest = (newReq) => {
    addServiceRequest(newReq);
    setIsCreateModalOpen(false);
  };

  // Handler for status update
  const handleStatusChange = (reqId, newStatus) => {
    updateServiceRequestStatus(reqId, newStatus);
    setSelectedRequest((prev) =>
      prev && prev.id === reqId ? { ...prev, status: newStatus } : prev
    );
  };

  const getPriorityVariant = (priority) => {
    switch (priority) {
      case "Critical":
        return "danger";
      case "High":
        return "warning";
      case "Medium":
        return "info";
      default:
        return "default";
    }
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case "Resolved":
        return "success";
      case "In Progress":
        return "info";
      case "Assigned":
        return "warning";
      case "New":
        return "default";
      case "On Hold":
        return "danger";
      default:
        return "default";
    }
  };

  const columns = [
    { key: "requestId", label: "Request ID" },
    { key: "customer", label: "Customer" },
    { key: "device", label: "Device" },
    { key: "issue", label: "Issue" },
    { key: "priority", label: "Priority" },
    { key: "status", label: "Status" },
    { key: "assignedTo", label: "Assigned To" },
    { key: "actions", label: "Actions" },
  ];

  const tableData = filteredRequests.map((req) => ({
    id: req.id,
    requestId: (
      <span className="table-req-id">{req.id}</span>
    ),
    customer: (
      <div>
        <div className="table-customer-name">{req.customerName}</div>
        <div className="table-subtext">{req.customerPhone}</div>
      </div>
    ),
    device: (
      <div>
        <div className="table-device-name">{req.deviceName}</div>
        <div className="table-subtext">{req.deviceType}</div>
      </div>
    ),
    issue: (
      <div className="table-issue-text" title={req.issue}>
        {req.issue}
      </div>
    ),
    priority: (
      <Badge variant={getPriorityVariant(req.priority)}>
        {req.priority}
      </Badge>
    ),
    status: (
      <Badge variant={getStatusVariant(req.status)}>
        {req.status}
      </Badge>
    ),
    assignedTo: (
      <div className="table-assigned-name">
        {req.assignedTo ? req.assignedTo.split(" ")[0] + " " + (req.assignedTo.split(" ")[1] || "") : "Unassigned"}
      </div>
    ),
    actions: (
      <button
        type="button"
        className="table-action-btn"
        onClick={() => setSelectedRequest(req)}
      >
        View Details
      </button>
    ),
  }));

  return (
    <div className="page-container service-requests-page">
      <PageHeader
        title="Service Requests"
        description="Track, assign, and resolve customer device issues and repair requests."
        action={
          <Button onClick={() => setIsCreateModalOpen(true)}>
            + New Request
          </Button>
        }
      />

      <div className="service-controls-row">
        <div className="service-search-box">
          <SearchInput
            placeholder="Search by ID, customer, device, issue..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Filter Chips Bar */}
      <ServiceRequestFilters
        activeStatus={activeStatus}
        onSelectStatus={setActiveStatus}
        counts={counts}
      />

      {/* Main Table */}
      {tableData.length > 0 ? (
        <DataTable columns={columns} data={tableData} />
      ) : (
        <div className="service-empty-state">
          <div className="empty-icon">⚡</div>
          <h3>No Service Requests Found</h3>
          <p>
            {searchQuery
              ? `No requests matched "${searchQuery}" in ${activeStatus} status.`
              : `No requests currently in ${activeStatus} status.`}
          </p>
          <Button
            variant="secondary"
            onClick={() => {
              setSearchQuery("");
              setActiveStatus("All");
            }}
          >
            Clear Filters
          </Button>
        </div>
      )}

      {/* Detail Modal */}
      {selectedRequest && (
        <ServiceRequestDetailModal
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
          onStatusChange={handleStatusChange}
        />
      )}

      {/* New Request Modal */}
      {isCreateModalOpen && (
        <NewServiceRequestModal
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleCreateRequest}
        />
      )}
    </div>
  );
}

export default ServiceRequests;