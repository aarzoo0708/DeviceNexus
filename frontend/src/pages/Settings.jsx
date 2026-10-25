import { useState } from "react";
import { useDispatch } from "react-redux";
import {
  FiSun,
  FiMoon,
  FiRefreshCw,
  FiCheck,
  FiSliders,
  FiUser,
  FiBell,
} from "react-icons/fi";
import PageHeader from "../components/common/PageHeader/PageHeader";
import Button from "../components/common/Button/Button";
import Card from "../components/common/Card/Card";
import Badge from "../components/common/Badge/Badge";
import { useTheme } from "../contexts/ThemeContext";
import { useAuth } from "../contexts/AuthContext";
import { resetAllDemoData } from "../store/store";

function Settings() {
  const dispatch = useDispatch();
  const { theme, setTheme } = useTheme();
  const { user, resetDemoUser } = useAuth();

  const [alerts, setAlerts] = useState(() => {
    const saved = localStorage.getItem("devicenexus_alerts_pref");
    return saved
      ? JSON.parse(saved)
      : {
          serviceRequests: true,
          warranty: true,
          system: true,
        };
  });

  const [itemsPerPage, setItemsPerPage] = useState(() => {
    return Number(localStorage.getItem("devicenexus_items_per_page")) || 10;
  });

  const [successMsg, setSuccessMsg] = useState("");
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);

  const handleSavePreferences = () => {
    localStorage.setItem("devicenexus_alerts_pref", JSON.stringify(alerts));
    localStorage.setItem("devicenexus_items_per_page", String(itemsPerPage));
    setSuccessMsg("Settings and preferences saved successfully.");
    setTimeout(() => setSuccessMsg(""), 3500);
  };

  const handleResetData = () => {
    resetAllDemoData(dispatch);
    resetDemoUser();
    setResetConfirmOpen(false);
    setSuccessMsg("All demo data and user state successfully restored to initial seed!");
    setTimeout(() => setSuccessMsg(""), 4500);
  };

  const toggleAlert = (key) => {
    setAlerts((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Configure your DeviceNexus workspace preferences, theme, and application data."
        action={
          <Button onClick={handleSavePreferences}>
            <FiCheck className="inline mr-1" /> Save Preferences
          </Button>
        }
      />

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center gap-3 text-sm font-medium">
          <FiCheck className="text-emerald-500 text-lg shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <div className="space-y-6">
        {/* Workspace & Demo User Info */}
        <Card>
          <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
            <h3 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <FiUser className="text-blue-500" /> Active Demo Persona
            </h3>
            <Badge variant="success">Active Workspace</Badge>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 p-5 bg-slate-50 dark:bg-[#111827] border border-slate-200 dark:border-[#334155] rounded-xl">
            <div>
              <span className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">Current User</span>
              <strong className="text-sm text-slate-900 dark:text-white font-semibold">{user?.name || "Alex Morgan"}</strong>
            </div>
            <div>
              <span className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">Role</span>
              <span className="text-sm text-slate-700 dark:text-slate-300">{user?.role || "Service Lead"}</span>
            </div>
            <div>
              <span className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">Email</span>
              <span className="break-all text-sm font-mono text-slate-700 dark:text-slate-300">{user?.email || "alex.morgan@devicenexus.com"}</span>
            </div>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-4">
            DeviceNexus runs entirely on client-side state. You can switch demo personas from the Profile or top Navbar menu at any time.
          </p>
        </Card>

        {/* Appearance Settings */}
        <Card>
          <h3 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2 mb-5">
            {theme === "dark" ? <FiMoon className="text-blue-400" /> : <FiSun className="text-amber-500" />} Appearance & Theme
          </h3>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2">
            <div>
              <label className="font-semibold text-sm text-slate-900 dark:text-white block">Application Theme</label>
              <span className="text-xs text-slate-500 dark:text-slate-400">Choose your preferred visual theme across all pages</span>
            </div>
            <select
              className="px-4 py-2.5 bg-white dark:bg-[#111827] border border-slate-300 dark:border-[#334155] rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-500 transition-colors w-full sm:w-52 cursor-pointer"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
            >
              <option value="dark">Dark Mode (Default)</option>
              <option value="light">Light Mode</option>
              <option value="system">Follow System</option>
            </select>
          </div>
        </Card>

        {/* Notification Preferences */}
        <Card>
          <h3 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2 mb-5">
            <FiBell className="text-blue-500" /> Notification & Alert Preferences
          </h3>
          <div className="space-y-5 divide-y divide-slate-100 dark:divide-[#334155]">
            <div className="flex items-center justify-between pt-2">
              <div>
                <span className="font-semibold text-sm text-slate-900 dark:text-white block">Service Request Alerts</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">Show notification badge when new service requests are submitted</span>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={alerts.serviceRequests}
                onClick={() => toggleAlert("serviceRequests")}
                className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-200 shrink-0 ${
                  alerts.serviceRequests ? "bg-blue-600" : "bg-slate-300 dark:bg-slate-700"
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform duration-200 ${
                    alerts.serviceRequests ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between pt-5">
              <div>
                <span className="font-semibold text-sm text-slate-900 dark:text-white block">Warranty Expiration Warnings</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">Highlight policies expiring within 30 days</span>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={alerts.warranty}
                onClick={() => toggleAlert("warranty")}
                className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-200 shrink-0 ${
                  alerts.warranty ? "bg-blue-600" : "bg-slate-300 dark:bg-slate-700"
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform duration-200 ${
                    alerts.warranty ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between pt-5">
              <div>
                <span className="font-semibold text-sm text-slate-900 dark:text-white block">Follow-up Reminders</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">Enable banner alerts for overdue customer callbacks</span>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={alerts.system}
                onClick={() => toggleAlert("system")}
                className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-200 shrink-0 ${
                  alerts.system ? "bg-blue-600" : "bg-slate-300 dark:bg-slate-700"
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform duration-200 ${
                    alerts.system ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>
        </Card>

        {/* Display / Table Preferences */}
        <Card>
          <h3 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2 mb-5">
            <FiSliders className="text-indigo-400" /> Table & Display Preferences
          </h3>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2">
            <div>
              <label className="font-semibold text-sm text-slate-900 dark:text-white block">Default Items Per Page</label>
              <span className="text-xs text-slate-500 dark:text-slate-400">Standard page size for customer, device, and service tables</span>
            </div>
            <select
              className="px-4 py-2.5 bg-white dark:bg-[#111827] border border-slate-300 dark:border-[#334155] rounded-xl text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-500 transition-colors w-full sm:w-44 cursor-pointer"
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
            >
              <option value={10}>10 records</option>
              <option value={25}>25 records</option>
              <option value={50}>50 records</option>
            </select>
          </div>
        </Card>

        {/* Reset Demo Data Card */}
        <div className="bg-white dark:bg-[#1e293b] border border-rose-200 dark:border-rose-900/50 rounded-2xl p-6 sm:p-7 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-5">
            <div>
              <h3 className="text-base font-semibold text-rose-500 dark:text-rose-400 flex items-center gap-2">
                <FiRefreshCw /> Reset All Demo Data
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 max-w-xl leading-relaxed">
                Restores the initial seed records for customers, devices, warranties, service requests, interactions, and follow-ups. Clears cached browser localStorage state. Useful for resetting test data during demonstrations.
              </p>
            </div>
            {!resetConfirmOpen ? (
              <button
                type="button"
                className="px-4 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 border border-rose-300 dark:border-rose-800 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl cursor-pointer transition-colors whitespace-nowrap self-start"
                onClick={() => setResetConfirmOpen(true)}
              >
                Reset Demo Data
              </button>
            ) : (
              <div className="flex items-center gap-2 self-start">
                <button
                  type="button"
                  className="px-3.5 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-[#334155] rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                  onClick={() => setResetConfirmOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl cursor-pointer transition-colors shadow-xs"
                  onClick={handleResetData}
                >
                  Confirm Reset
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
