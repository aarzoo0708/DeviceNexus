import "./Dashboard.css";

import StatCard from "../components/dashboard/StatCard";
import ServicePipeline from "../components/dashboard/ServicePipeline";
import WarrantyAlert from "../components/dashboard/WarrantyAlert";
import RecentActivity from "../components/dashboard/RecentActivity";
import QuickActions from "../components/dashboard/QuickActions";

function Dashboard() {
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
          value="250"
          change="↑ 12.5% vs last month"
          icon="👥"
          trend="positive"
        />

        <StatCard
          title="Total Devices"
          value="380"
          change="↑ 8.2% vs last month"
          icon="💻"
          trend="positive"
        />

        <StatCard
          title="Open Requests"
          value="18"
          change="↓ 4.1% vs last month"
          icon="⚡"
          trend="negative"
        />

        <StatCard
          title="Pending Follow-ups"
          value="09"
          change="↑ 2.3% vs last month"
          icon="✓"
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