import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { FiUsers, FiCpu, FiZap, FiShield } from "react-icons/fi";
import { useAuth } from "../contexts/AuthContext";
import StatCard from "../components/dashboard/StatCard";
import ServicePipeline from "../components/dashboard/ServicePipeline";
import WarrantyAlert from "../components/dashboard/WarrantyAlert";
import RecentActivity from "../components/dashboard/RecentActivity";
import QuickActions from "../components/dashboard/QuickActions";

import { calculateWarrantyStatus } from "../components/warranty/WarrantyTableConfig";

function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Read live business counts directly from Redux Toolkit store
  const customers = useSelector((state) => state.customers || []);
  const devices = useSelector((state) => state.devices || []);
  const serviceRequests = useSelector((state) => state.serviceRequests || []);
  const warranties = useSelector((state) => state.warranties || []);

  const customerCount = customers.length;
  const deviceCount = devices.length;
  const openRequestCount = serviceRequests.filter(
    (r) => r.status !== "Resolved"
  ).length;
  const activeWarrantyCount = warranties.filter(
    (w) => calculateWarrantyStatus(w.expiryDate).status === "Active"
  ).length;

  return (
    <div className="space-y-6">
      {/* Header with live greeting */}
      <div>
        <p className="text-xs font-bold text-blue-500 uppercase tracking-wider">
          OVERVIEW
        </p>
        <h1 className="text-[28px] font-bold text-slate-900 dark:text-white tracking-tight mt-1 flex flex-wrap items-center gap-2">
          Good morning, {user?.name?.split(" ")[0] || "Admin"} <span role="img" aria-label="wave">👋</span>
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1.5">
          Here's what's happening across your service operations today.
        </p>
      </div>

      {/* 4 Interactive KPI Stat Cards derived from Redux */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
        <StatCard
          title="TOTAL CUSTOMERS"
          value={String(customerCount)}
          change="Registered customer accounts"
          icon={<FiUsers size={20} />}
          iconColor="text-blue-500 dark:text-blue-400"
          onClick={() => navigate("/customers")}
        />

        <StatCard
          title="TOTAL DEVICES"
          value={String(deviceCount)}
          change="Tracked hardware units"
          icon={<FiCpu size={20} />}
          iconColor="text-sky-500 dark:text-sky-400"
          onClick={() => navigate("/devices")}
        />

        <StatCard
          title="OPEN REQUESTS"
          value={String(openRequestCount)}
          change={`${openRequestCount} pending resolution`}
          icon={<FiZap size={20} />}
          iconColor="text-amber-500 dark:text-amber-400"
          onClick={() => navigate("/service-requests")}
        />

        <StatCard
          title="ACTIVE WARRANTIES"
          value={String(activeWarrantyCount)}
          change={`${activeWarrantyCount} devices protected`}
          icon={<FiShield size={20} />}
          iconColor="text-blue-500 dark:text-blue-400"
          onClick={() => navigate("/warranty")}
        />
      </div>

      {/* Middle Section: Service Pipeline & Warranty Alerts */}
      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)] gap-6">
        <div className="min-w-0">
          <ServicePipeline />
        </div>
        <div className="min-w-0">
          <WarrantyAlert />
        </div>
      </div>

      {/* Bottom Section: Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)] gap-6">
        <div className="min-w-0">
          <RecentActivity />
        </div>
        <div className="min-w-0">
          <QuickActions />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
