import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import "./Dashboard.css";

import StatCard from "../components/dashboard/StatCard";
import ServicePipeline from "../components/dashboard/ServicePipeline";
import WarrantyAlert from "../components/dashboard/WarrantyAlert";
import RecentActivity from "../components/dashboard/RecentActivity";
import QuickActions from "../components/dashboard/QuickActions";
import { getCustomers, getDevices, onDataChange } from "../data/mockData";

function Dashboard() {
  const navigate = useNavigate();
  const [customerCount, setCustomerCount] = useState(() => getCustomers().length);
  const [deviceCount, setDeviceCount] = useState(() => getDevices().length);

  useEffect(() => {
    const updateCounts = () => {
      setCustomerCount(getCustomers().length);
      setDeviceCount(getDevices().length);
    };

    updateCounts();
    const unsubscribe = onDataChange(updateCounts);
    return unsubscribe;
  }, []);

  return (
    <div>
      <div className="dashboard-header">
        <div>
          <p>Overview</p>

          <h1>Good morning, Admin 👋</h1>

          <span>
            Here's what's happening across your service operations today.
          </span>
        </div>
      </div>

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
          value="18"
          change="↓ 4.1% vs last month"
          icon="⚡"
          trend="negative"
        />


      </div>

      <div className="dashboard-main-grid">
        <ServicePipeline />

        <WarrantyAlert />
      </div>

      <div className="dashboard-bottom-grid">
        <RecentActivity />

        <QuickActions />
      </div>
    </div>
  );
}

export default Dashboard;