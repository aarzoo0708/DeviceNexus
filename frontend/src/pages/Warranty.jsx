import React, { useState, useEffect, useMemo } from "react";
import PageHeader from "../components/common/PageHeader/PageHeader";
import Button from "../components/common/Button/Button";
import SearchInput from "../components/common/SearchInput/SearchInput";
import DataTable from "../components/common/DataTable/DataTable";
import Badge from "../components/common/Badge/Badge";
import WarrantyFilters from "../components/warranty/WarrantyFilters";
import WarrantyDetailModal from "../components/warranty/WarrantyDetailModal";
import RegisterWarrantyModal from "../components/warranty/RegisterWarrantyModal";
import {
  getWarranties,
  addWarranty,
  extendWarranty,
  onDataChange,
} from "../data/mockData";
import "./Warranty.css";

function Warranty() {
  const [warranties, setWarranties] = useState(() => getWarranties());
  const [searchQuery, setSearchQuery] = useState("");
  const [activeStatus, setActiveStatus] = useState("All");
  const [selectedWarranty, setSelectedWarranty] = useState(null);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  useEffect(() => {
    const refreshData = () => setWarranties(getWarranties());
    const unsubscribe = onDataChange(refreshData);
    return unsubscribe;
  }, []);

  // Compute status counts for filter chips
  const counts = useMemo(() => {
    const countMap = {
      All: warranties.length,
      Active: 0,
      "Expiring Soon": 0,
      Expired: 0,
    };

    warranties.forEach((w) => {
      if (countMap[w.status] !== undefined) {
        countMap[w.status]++;
      }
    });

    return countMap;
  }, [warranties]);

  // Filter warranties by search query and active status
  const filteredWarranties = useMemo(() => {
    return warranties.filter((w) => {
      const matchesStatus =
        activeStatus === "All" || w.status === activeStatus;

      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        w.id.toLowerCase().includes(query) ||
        w.deviceName.toLowerCase().includes(query) ||
        w.customerName.toLowerCase().includes(query) ||
        w.serialNumber.toLowerCase().includes(query) ||
        w.warrantyType.toLowerCase().includes(query) ||
        w.provider.toLowerCase().includes(query);

      return matchesStatus && matchesSearch;
    });
  }, [warranties, activeStatus, searchQuery]);

  // Handler for adding a new warranty
  const handleRegisterWarranty = (newWarranty) => {
    addWarranty(newWarranty);
    setIsRegisterModalOpen(false);
  };

  // Handler for extending a warranty
  const handleExtendWarranty = (id) => {
    extendWarranty(id, 1);
    setSelectedWarranty((prev) =>
      prev && prev.id === id
        ? {
            ...prev,
            status: "Active",
            daysRemaining: (prev.daysRemaining || 0) + 365,
          }
        : prev
    );
  };

  const getStatusVariant = (status) => {
    switch (status) {
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

  const columns = [
    { key: "warrantyId", label: "Policy ID" },
    { key: "device", label: "Device & Serial" },
    { key: "customer", label: "Customer" },
    { key: "coverageType", label: "Coverage / Provider" },
    { key: "expiry", label: "Expiry Date" },
    { key: "status", label: "Status" },
    { key: "actions", label: "Actions" },
  ];

  const tableData = filteredWarranties.map((w) => ({
    id: w.id,
    warrantyId: (
      <span className="table-warranty-id">{w.id}</span>
    ),
    device: (
      <div>
        <div className="table-device-name">{w.deviceName}</div>
        <div className="table-subtext">{w.serialNumber} • {w.deviceType}</div>
      </div>
    ),
    customer: (
      <div>
        <div className="table-customer-name">{w.customerName}</div>
        <div className="table-subtext">{w.customerPhone}</div>
      </div>
    ),
    coverageType: (
      <div>
        <div className="table-plan-name">{w.warrantyType}</div>
        <div className="table-subtext">{w.provider}</div>
      </div>
    ),
    expiry: (
      <div>
        <div className="table-expiry-date">{w.expiryDate}</div>
        {w.status === "Active" && (
          <div className="table-subtext text-success">{w.daysRemaining} days left</div>
        )}
        {w.status === "Expiring Soon" && (
          <div className="table-subtext text-warning">⚠️ {w.daysRemaining} days left</div>
        )}
        {w.status === "Expired" && (
          <div className="table-subtext text-danger">Expired</div>
        )}
      </div>
    ),
    status: (
      <Badge variant={getStatusVariant(w.status)}>
        {w.status}
      </Badge>
    ),
    actions: (
      <button
        type="button"
        className="table-action-btn"
        onClick={() => setSelectedWarranty(w)}
      >
        View Policy
      </button>
    ),
  }));

  // KPI Summary stats
  const totalActive = warranties.filter((w) => w.status === "Active").length;
  const totalExpiring = warranties.filter((w) => w.status === "Expiring Soon").length;
  const totalExpired = warranties.filter((w) => w.status === "Expired").length;
  const totalClaims = warranties.reduce((acc, curr) => acc + (curr.claimsCount || 0), 0);

  return (
    <div className="page-container warranty-page">
      <PageHeader
        title="Warranty Management"
        description="Monitor device warranty terms, upcoming expiration alerts, and coverage claims."
        action={
          <Button onClick={() => setIsRegisterModalOpen(true)}>
            + Register Warranty
          </Button>
        }
      />

      {/* KPI Stats Cards */}
      <div className="warranty-stats-grid">
        <div className="warranty-stat-card">
          <div className="stat-label">Active Warranties</div>
          <div className="stat-value text-success">{totalActive}</div>
          <div className="stat-subtext">Protected devices</div>
        </div>

        <div className="warranty-stat-card">
          <div className="stat-label">Expiring in 30 Days</div>
          <div className="stat-value text-warning">{totalExpiring}</div>
          <div className="stat-subtext">Action recommended</div>
        </div>

        <div className="warranty-stat-card">
          <div className="stat-label">Expired Policies</div>
          <div className="stat-value text-danger">{totalExpired}</div>
          <div className="stat-subtext">Out of coverage</div>
        </div>

        <div className="warranty-stat-card">
          <div className="stat-label">Service Claims</div>
          <div className="stat-value">{totalClaims}</div>
          <div className="stat-subtext">Total claims filed</div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="warranty-controls-row">
        <div className="warranty-search-box">
          <SearchInput
            placeholder="Search by device, customer, serial, provider..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Filter Chips */}
      <WarrantyFilters
        activeStatus={activeStatus}
        onSelectStatus={setActiveStatus}
        counts={counts}
      />

      {/* Main Table */}
      {tableData.length > 0 ? (
        <DataTable columns={columns} data={tableData} />
      ) : (
        <div className="warranty-empty-state">
          <div className="empty-icon">🛡️</div>
          <h3>No Warranty Records Found</h3>
          <p>
            {searchQuery
              ? `No warranty policies matched "${searchQuery}" in ${activeStatus} status.`
              : `No warranty policies currently in ${activeStatus} status.`}
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

      {/* Details Modal */}
      {selectedWarranty && (
        <WarrantyDetailModal
          warranty={selectedWarranty}
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