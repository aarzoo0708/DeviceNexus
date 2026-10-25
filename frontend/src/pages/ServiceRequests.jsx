import { useState, useEffect } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { FiPlus, FiInbox } from "react-icons/fi";
import PageHeader from "../components/common/PageHeader/PageHeader";
import Button from "../components/common/Button/Button";
import SearchInput from "../components/common/SearchInput/SearchInput";
import DataTable from "../components/common/DataTable/DataTable";
import ServiceRequestFilters from "../components/serviceRequests/ServiceRequestFilters";
import ServiceRequestDetailModal from "../components/serviceRequests/ServiceRequestDetailModal";
import NewServiceRequestModal from "../components/serviceRequests/NewServiceRequestModal";
import {
  columns,
  getServiceRequestTableData,
} from "../components/serviceRequests/ServiceRequestTableConfig";
import {
  addServiceRequest,
  updateServiceRequestStatus,
} from "../store/slices/serviceRequestsSlice";

function ServiceRequests() {
  const dispatch = useDispatch();
  const requests = useSelector((state) => state.serviceRequests || []);
  const customers = useSelector((state) => state.customers || []);
  const devices = useSelector((state) => state.devices || []);

  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [searchQuery, setSearchQuery] = useState("");
  const requestedStatus = searchParams.get("status");
  const activeStatus = ["New", "Assigned", "In Progress", "Resolved", "On Hold"].includes(requestedStatus) ? requestedStatus : "All";
  const setActiveStatus = (status) => {
    setSearchParams(status === "All" ? {} : { status });
  };
  const [selectedRequestId, setSelectedRequestId] = useState(() => searchParams.get("request"));
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(
    () => Boolean(location.state?.openCreateModal)
  );

  const selectedRequest = selectedRequestId
    ? requests.find((r) => r.id === selectedRequestId) || null
    : null;

  useEffect(() => {
    if (location.state?.openCreateModal) {
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

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
    if (!query) return matchesStatus;

    const customer = customers.find((c) => c.id === req.customerId);
    const device = devices.find((d) => d.id === req.deviceId);
    const customerName = customer ? customer.name.toLowerCase() : (req.customerName || "").toLowerCase();
    const deviceName = device ? device.name.toLowerCase() : (req.deviceName || "").toLowerCase();

    const matchesSearch =
      req.id.toLowerCase().includes(query) ||
      customerName.includes(query) ||
      deviceName.includes(query) ||
      req.issue.toLowerCase().includes(query) ||
      (req.assignedTo && req.assignedTo.toLowerCase().includes(query));

    return matchesStatus && matchesSearch;
  });

  // Handler for adding a new service request
  const handleCreateRequest = (newReq) => {
    dispatch(addServiceRequest(newReq));
    setIsCreateModalOpen(false);
  };

  // Handler for status update
  const handleStatusChange = (reqId, newStatus) => {
    dispatch(updateServiceRequestStatus({ id: reqId, status: newStatus }));
  };

  const tableData = getServiceRequestTableData(
    filteredRequests,
    (req) => setSelectedRequestId(req.id),
    customers,
    devices
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Service Requests"
        description="Track, assign, and resolve customer device issues and service requests."
        action={
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <span className="inline-flex items-center gap-1.5">
              <FiPlus size={16} /> New Request
            </span>
          </Button>
        }
      />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="w-full max-w-md">
          <SearchInput
            placeholder="Search by ID, customer, device, issue..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Filter Chips Bar */}
      <div>
        <ServiceRequestFilters
          activeStatus={activeStatus}
          onSelectStatus={setActiveStatus}
          counts={counts}
        />
      </div>

      {/* Main Table */}
      {tableData.length > 0 ? (
        <DataTable
          columns={columns}
          data={tableData}
          minWidth="min-w-[920px]"
          emptyMessage="No service requests found matching your filter criteria."
        />
      ) : (
        <div className="py-16 text-center panel space-y-3 shadow-xs">
          <FiInbox className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">
            No Service Requests Found
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {searchQuery
              ? `No requests matched "${searchQuery}" in ${activeStatus} status.`
              : `No requests currently in ${activeStatus} status.`}
          </p>
          <div className="pt-2">
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
        </div>
      )}

      {/* Detail Modal */}
      {selectedRequest && (
        <ServiceRequestDetailModal
          request={selectedRequest}
          onClose={() => setSelectedRequestId(null)}
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
