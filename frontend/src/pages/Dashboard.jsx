import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import "./Dashboard.css";

import StatCard from "../components/dashboard/StatCard";
import ServicePipeline from "../components/dashboard/ServicePipeline";
import WarrantyAlert from "../components/dashboard/WarrantyAlert";
import RecentActivity from "../components/dashboard/RecentActivity";
import QuickActions from "../components/dashboard/QuickActions";
import {
  getCustomers,
  getDevices,
  getServiceRequests,
  getWarranties,
  onDataChange,
} from "../data/mockData";

function Dashboard() {
  const navigate = useNavigate();

  // Dynamic counts using simple React state
  const [customerCount, setCustomerCount] = useState(() => getCustomers().length);
  const [deviceCount, setDeviceCount] = useState(() => getDevices().length);
  const [openRequestCount, setOpenRequestCount] = useState(() =>
    getServiceRequests().filter((r) => r.status !== "Resolved").length
  );
  const [warrantyCount, setWarrantyCount] = useState(() =>
    getWarranties().filter((w) => w.status === "Active").length
  );

  useEffect(() => {
    const updateCounts = () => {
      setCustomerCount(getCustomers().length);
      setDeviceCount(getDevices().length);
      setOpenRequestCount(
        getServiceRequests().filter((r) => r.status !== "Resolved").length
      );
      setWarrantyCount(
        getWarranties().filter((w) => w.status === "Active").length
      );
    };

    updateCounts();
    const unsubscribe = onDataChange(updateCounts);
    return unsubscribe;
  }, []);

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <p className="dashboard-subtitle">OVERVIEW</p>
          <h1>Good morning, Admin 👋</h1>
          <span>
            Here's what's happening across your service operations today.
          </span>
        </div>
      </div>

      {/* 4 Interactive KPI Stat Cards */}
      <div className="stats-grid">
        <StatCard
          title="Total Customers"
          value={String(customerCount)}
          change="↑ 12.5% vs last month"
          icon="👥"
          trend="positive"
          onClick={() => navigate("/customers")}
        />

        <StatCard
          title="Total Devices"
          value={String(deviceCount)}
          change="↑ 8.2% vs last month"
          icon="💻"
          trend="positive"
          onClick={() => navigate("/devices")}
        />

        <StatCard
          title="Open Requests"
          value={String(openRequestCount)}
          change={`${openRequestCount} pending resolution`}
          icon="⚡"
          trend={openRequestCount > 0 ? "positive" : "neutral"}
          onClick={() => navigate("/service-requests")}
        />

        <StatCard
          title="Active Warranties"
          value={String(warrantyCount)}
          change={`${warrantyCount} devices protected`}
          icon="🛡️"
          trend="positive"
          onClick={() => navigate("/warranty")}
        />
      </div>

      {/* Middle Section: Service Pipeline & Warranty Alerts */}
      <div className="dashboard-main-grid">
        <ServicePipeline />
        <WarrantyAlert />
      </div>

      {/* Bottom Section: Recent Activity & Quick Actions */}
      <div className="dashboard-bottom-grid">
        <RecentActivity />
        <QuickActions />
      </div>
    </div>
  );
}

export default Dashboard;