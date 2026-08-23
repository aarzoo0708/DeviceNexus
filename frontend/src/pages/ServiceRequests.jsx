import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import PageHeader from "../components/common/PageHeader/PageHeader";
import Button from "../components/common/Button/Button";
import SearchInput from "../components/common/SearchInput/SearchInput";
import DataTable from "../components/common/DataTable/DataTable";
import Badge from "../components/common/Badge/Badge";
import ServiceRequestFilters from "../components/serviceRequests/ServiceRequestFilters";
import ServiceRequestDetailModal from "../components/serviceRequests/ServiceRequestDetailModal";
import NewServiceRequestModal from "../components/serviceRequests/NewServiceRequestModal";
import { columns, getServiceRequestTableData } from "../components/serviceRequests/ServiceRequestTableConfig";
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

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state?.openCreateModal) {
      setIsCreateModalOpen(true);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  useEffect(() => {
    const refreshData = () => setRequests(getServiceRequests());
    const unsubscribe = onDataChange(refreshData);
    return unsubscribe;
  }, []);

  // Compute status counts for filter chips
  const counts = {
    All: requests.length,
    New: 0,
    Assigned: 0,
    "In Progress": 0,
    Resolved: 0,
    "On Hold": 0,
  };

  requests.forEach((req) => {
    if (counts[req.status] !== undefined) {
      counts[req.status]++;
    }
  });

  // Filter requests by search query and active status
  const filteredRequests = requests.filter((req) => {
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

  const tableData = getServiceRequestTableData(filteredRequests, setSelectedRequest);

  return (
    <div className="page-container service-requests-page">
      <PageHeader
        title="Service Requests"
        description="Track, assign, and resolve customer device issues and service requests."
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