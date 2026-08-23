<<<<<<< Updated upstream
function Warranty() {
=======
import React, { useState, useEffect } from "react";
import PageHeader from "../components/common/PageHeader/PageHeader";
import Button from "../components/common/Button/Button";
import SearchInput from "../components/common/SearchInput/SearchInput";
import DataTable from "../components/common/DataTable/DataTable";
import Badge from "../components/common/Badge/Badge";
import WarrantyFilters from "../components/warranty/WarrantyFilters";
import WarrantyDetailModal from "../components/warranty/WarrantyDetailModal";
import RegisterWarrantyModal from "../components/warranty/RegisterWarrantyModal";
import { columns, getWarrantyTableData } from "../components/warranty/WarrantyTableConfig";
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
  const counts = {
    All: warranties.length,
    Active: 0,
    "Expiring Soon": 0,
    Expired: 0,
  };

  warranties.forEach((w) => {
    if (counts[w.status] !== undefined) {
      counts[w.status]++;
    }
  });

  // Filter warranties by search query and active status
  const filteredWarranties = warranties.filter((w) => {
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

  const tableData = getWarrantyTableData(filteredWarranties, setSelectedWarranty);

  // KPI Summary stats
  const totalActive = warranties.filter((w) => w.status === "Active").length;
  const totalExpiring = warranties.filter((w) => w.status === "Expiring Soon").length;
  const totalExpired = warranties.filter((w) => w.status === "Expired").length;
  const totalClaims = warranties.reduce((acc, curr) => acc + (curr.claimsCount || 0), 0);

>>>>>>> Stashed changes
  return (
    <div>
      <h1>Warranty</h1>
      <p>Warranty management module.</p>
    </div>
  );
}

export default Warranty;