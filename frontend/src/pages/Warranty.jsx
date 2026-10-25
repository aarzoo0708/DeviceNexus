import { useState } from "react";
import { useSearchParams } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { FiPlus, FiShield } from "react-icons/fi";
import PageHeader from "../components/common/PageHeader/PageHeader";
import Button from "../components/common/Button/Button";
import SearchInput from "../components/common/SearchInput/SearchInput";
import DataTable from "../components/common/DataTable/DataTable";
import WarrantyFilters from "../components/warranty/WarrantyFilters";
import WarrantyDetailModal from "../components/warranty/WarrantyDetailModal";
import RegisterWarrantyModal from "../components/warranty/RegisterWarrantyModal";
import {
  columns,
  getWarrantyTableData,
  calculateWarrantyStatus,
} from "../components/warranty/WarrantyTableConfig";
import { addWarranty, extendWarranty } from "../store/slices/warrantiesSlice";

function Warranty() {
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const warranties = useSelector((state) => state.warranties || []);
  const customers = useSelector((state) => state.customers || []);
  const devices = useSelector((state) => state.devices || []);

  const [searchQuery, setSearchQuery] = useState("");
  const [activeStatus, setActiveStatus] = useState("All");
  const [selectedWarranty, setSelectedWarranty] = useState(() => warranties.find((w) => w.id === searchParams.get("policy")) || null);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  // Derive dynamic status & daysRemaining for every warranty based on actual expiry date
  const processedWarranties = warranties.map((w) => {
    const { status, daysRemaining } = calculateWarrantyStatus(w.expiryDate);
    return {
      ...w,
      status,
      daysRemaining,
    };
  });

  // Keep selectedWarranty updated if Redux changes
  const activeSelectedWarranty = selectedWarranty
    ? processedWarranties.find((w) => w.id === selectedWarranty.id) || selectedWarranty
    : null;

  // Compute status counts for filter chips
  const counts = {
    All: processedWarranties.length,
    Active: 0,
    "Expiring Soon": 0,
    Expired: 0,
  };

  processedWarranties.forEach((w) => {
    if (counts[w.status] !== undefined) {
      counts[w.status]++;
    }
  });

  // Filter warranties by search query and active status
  const filteredWarranties = processedWarranties.filter((w) => {
    const matchesStatus =
      activeStatus === "All" || w.status === activeStatus;

    const query = searchQuery.toLowerCase().trim();
    if (!query) return matchesStatus;

    const customer = customers.find((c) => c.id === w.customerId);
    const device = devices.find((d) => d.id === w.deviceId);
    const customerName = customer ? customer.name.toLowerCase() : (w.customerName || "").toLowerCase();
    const deviceName = device ? device.name.toLowerCase() : (w.deviceName || "").toLowerCase();
    const serialNumber = device ? device.serialNumber.toLowerCase() : (w.serialNumber || "").toLowerCase();

    const matchesSearch =
      w.id.toLowerCase().includes(query) ||
      deviceName.includes(query) ||
      customerName.includes(query) ||
      serialNumber.includes(query) ||
      w.warrantyType.toLowerCase().includes(query) ||
      w.provider.toLowerCase().includes(query);

    return matchesStatus && matchesSearch;
  });

  // Handler for adding a new warranty
  const handleRegisterWarranty = (newWarranty) => {
    dispatch(addWarranty(newWarranty));
    setIsRegisterModalOpen(false);
  };

  // Handler for extending a warranty
  const handleExtendWarranty = (id) => {
    dispatch(extendWarranty({ id, additionalYears: 1 }));
  };

  const tableData = getWarrantyTableData(
    filteredWarranties,
    setSelectedWarranty,
    customers,
    devices
  );

  // KPI Summary stats dynamically calculated
  const totalActive = processedWarranties.filter((w) => w.status === "Active").length;
  const totalExpiring = processedWarranties.filter((w) => w.status === "Expiring Soon").length;
  const totalExpired = processedWarranties.filter((w) => w.status === "Expired").length;
  const totalClaims = processedWarranties.reduce((acc, curr) => acc + (curr.claimsCount || 0), 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Warranty Management"
        description="Monitor device warranty terms, upcoming expiration alerts, and coverage claims."
        action={
          <Button onClick={() => setIsRegisterModalOpen(true)}>
            <span className="inline-flex items-center gap-1.5">
              <FiPlus size={16} /> Register Warranty
            </span>
          </Button>
        }
      />

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
        <div className="panel p-6 shadow-sm min-h-42.5 flex flex-col justify-between">
          <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Active Warranties
          </div>
          <div className="text-4xl font-extrabold text-emerald-500 dark:text-emerald-400 my-2">
            {totalActive}
          </div>
          <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Protected devices</div>
        </div>

        <div className="panel p-6 shadow-sm min-h-42.5 flex flex-col justify-between">
          <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Expiring in 30 Days
          </div>
          <div className="text-4xl font-extrabold text-amber-500 dark:text-amber-400 my-2">
            {totalExpiring}
          </div>
          <div className="text-xs font-semibold text-amber-600 dark:text-amber-400">Action recommended</div>
        </div>

        <div className="panel p-6 shadow-sm min-h-42.5 flex flex-col justify-between">
          <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Expired Policies
          </div>
          <div className="text-4xl font-extrabold text-rose-500 dark:text-rose-400 my-2">
            {totalExpired}
          </div>
          <div className="text-xs font-semibold text-rose-600 dark:text-rose-400">Out of coverage</div>
        </div>

        <div className="panel p-6 shadow-sm min-h-42.5 flex flex-col justify-between">
          <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Service Claims
          </div>
          <div className="text-4xl font-extrabold text-slate-900 dark:text-white my-2">
            {totalClaims}
          </div>
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total claims filed</div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-1">
        <div className="w-full max-w-md">
          <SearchInput
            placeholder="Search by device, customer, serial, provider..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Filter Chips */}
      <div className="pt-1 pb-1">
        <WarrantyFilters
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
          emptyMessage="No warranty policies found matching your filter criteria."
        />
      ) : (
        <div className="py-16 text-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl space-y-3 shadow-xs">
          <FiShield className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">
            No Warranty Records Found
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {searchQuery
              ? `No warranty policies matched "${searchQuery}" in ${activeStatus} status.`
              : `No warranty policies currently in ${activeStatus} status.`}
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

      {/* Details Modal */}
      {activeSelectedWarranty && (
        <WarrantyDetailModal
          warranty={activeSelectedWarranty}
          onClose={() => setSelectedWarranty(null)}
          onExtend={handleExtendWarranty}
        />
      )}

      {/* Register Warranty Modal */}
      {isRegisterModalOpen && (
        <RegisterWarrantyModal
          onClose={() => setIsRegisterModalOpen(false)}
          onSubmit={handleRegisterWarranty}
        />
      )}
    </div>
  );
}

export default Warranty;
