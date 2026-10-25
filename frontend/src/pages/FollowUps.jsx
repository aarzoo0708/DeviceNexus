import { useState, useEffect } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import {
  FiPlus,
  FiCalendar,
  FiCheckCircle,
  FiCheck,
  FiClock,
  FiAlertCircle,
  FiList,
  FiGrid,
  FiEye,
  FiPhone,
  FiMessageSquare,
  FiMail,
  FiInbox,
} from "react-icons/fi";
import PageHeader from "../components/common/PageHeader/PageHeader";
import Button from "../components/common/Button/Button";
import SearchInput from "../components/common/SearchInput/SearchInput";
import Badge from "../components/common/Badge/Badge";
import DataTable from "../components/common/DataTable/DataTable";

import ScheduleFollowUpModal from "../components/followUps/ScheduleFollowUpModal";
import RescheduleModal from "../components/followUps/RescheduleModal";
import FollowUpDetailModal from "../components/followUps/FollowUpDetailModal";
import FollowUpFilters from "../components/followUps/FollowUpFilters";

import {
  addFollowUp,
  completeFollowUp,
  rescheduleFollowUp,
} from "../store/slices/followUpsSlice";

function FollowUps() {
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const followUps = useSelector((state) => state.followUps || []);
  const customers = useSelector((state) => state.customers || []);

  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [activePriority, setActivePriority] = useState("All");
  const [viewMode, setViewMode] = useState("cards"); // 'cards' | 'table'

  const location = useLocation();
  const navigate = useNavigate();

  // Modals state
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(
    () => Boolean(location.state?.openScheduleModal)
  );
  const [reschedulingItem, setReschedulingItem] = useState(null);
  const [selectedItemId, setSelectedItemId] = useState(() => searchParams.get("followUp"));

  const selectedItem = selectedItemId
    ? followUps.find((item) => item.id === selectedItemId) || null
    : null;

  useEffect(() => {
    if (location.state?.openScheduleModal) {
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  // Compute status counts
  const counts = {
    All: followUps.length,
    Upcoming: 0,
    Overdue: 0,
    Completed: 0,
  };

  followUps.forEach((item) => {
    if (counts[item.status] !== undefined) {
      counts[item.status]++;
    }
  });

  // Filtered follow-ups
  const filteredFollowUps = followUps.filter((item) => {
    const matchesStatus =
      activeFilter === "All" || item.status === activeFilter;

    const matchesPriority =
      activePriority === "All" || item.priority === activePriority;

    const q = searchQuery.toLowerCase().trim();
    if (!q) return matchesStatus && matchesPriority;

    const customer = customers.find((c) => c.id === item.customerId);
    const customerName = customer ? customer.name.toLowerCase() : (item.customerName || "").toLowerCase();

    const matchesSearch =
      customerName.includes(q) ||
      (item.customerPhone && item.customerPhone.toLowerCase().includes(q)) ||
      (item.subject && item.subject.toLowerCase().includes(q)) ||
      (item.notes && item.notes.toLowerCase().includes(q)) ||
      (item.assignedStaff && item.assignedStaff.toLowerCase().includes(q)) ||
      (item.relatedId && item.relatedId.toLowerCase().includes(q)) ||
      (item.id && item.id.toLowerCase().includes(q));

    return matchesStatus && matchesPriority && matchesSearch;
  });

  const handleCreate = (newFollowUp) => {
    dispatch(addFollowUp(newFollowUp));
    setIsScheduleModalOpen(false);
  };

  const handleComplete = (id, completionNotes = "") => {
    dispatch(completeFollowUp({ id, completionNotes }));
  };

  const handleReschedule = (id, newDate, newTime, reason) => {
    dispatch(rescheduleFollowUp({ id, newDate, newTime, reason }));
    setReschedulingItem(null);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Completed":
        return <Badge variant="success">Completed</Badge>;
      case "Overdue":
        return <Badge variant="danger">Overdue</Badge>;
      case "Upcoming":
      default:
        return <Badge variant="info">Upcoming</Badge>;
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case "Critical":
        return <Badge variant="danger">Critical</Badge>;
      case "High":
        return <Badge variant="warning">High</Badge>;
      case "Medium":
        return <Badge variant="info">Medium</Badge>;
      default:
        return <Badge variant="default">Low</Badge>;
    }
  };

  const getChannelIcon = (channel) => {
    switch (channel) {
      case "Phone Call":
        return <FiPhone className="inline text-blue-500" />;
      case "WhatsApp":
        return <FiMessageSquare className="inline text-emerald-500" />;
      case "Email":
        return <FiMail className="inline text-purple-500" />;
      default:
        return <FiClock className="inline" />;
    }
  };

  // Table columns definition
  const tableColumns = [
    { key: "id", label: "ID" },
    { key: "customer", label: "Customer" },
    { key: "subject", label: "Subject / Purpose" },
    { key: "related", label: "Related Module" },
    { key: "dueDate", label: "Due Date & Time" },
    { key: "priority", label: "Priority" },
    { key: "status", label: "Status" },
    { key: "staff", label: "Assigned Staff" },
    { key: "actions", label: "Actions" },
  ];

  const tableData = filteredFollowUps.map((item) => {
    const customer = customers.find((c) => c.id === item.customerId);
    const customerName = customer ? customer.name : item.customerName || "Customer";
    const customerPhone = customer ? customer.phone : item.customerPhone || "";

    return {
      id: <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">{item.id}</span>,
      customer: (
        <div>
          <div className="font-semibold text-slate-900 dark:text-white text-sm">
            {customerName}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
            {getChannelIcon(item.channel)} {customerPhone}
          </div>
        </div>
      ),
      subject: (
        <div
          className="cursor-pointer font-medium max-w-65"
          onClick={() => setSelectedItemId(item.id)}
        >
          <span className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-semibold block truncate">
            {item.subject}
          </span>
          <div className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
            {item.notes}
          </div>
        </div>
      ),
      related: (
        <div>
          <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
            {item.relatedId}
          </span>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {item.relatedType}
          </div>
        </div>
      ),
      dueDate: (
        <span
          className={`font-medium text-xs ${
            item.status === "Overdue"
              ? "text-rose-600 dark:text-rose-400 font-bold"
              : "text-slate-900 dark:text-slate-200"
          }`}
        >
          {item.dueDate} · {item.dueTime}
        </span>
      ),
      priority: getPriorityBadge(item.priority),
      status: getStatusBadge(item.status),
      staff: <span className="text-xs text-slate-700 dark:text-slate-300 font-medium">{item.assignedStaff}</span>,
      actions: (
        <div className="flex gap-1.5 items-center">
          <button
            type="button"
            className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 cursor-pointer"
            title="View Details"
            onClick={() => setSelectedItemId(item.id)}
          >
            <FiEye size={13} />
          </button>
          {item.status !== "Completed" && (
            <>
              <button
                type="button"
                className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 border border-emerald-200 dark:border-emerald-800 cursor-pointer"
                title="Mark as Completed"
                onClick={() => handleComplete(item.id)}
              >
                <FiCheck size={13} />
              </button>
              <button
                type="button"
                className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 hover:bg-blue-100 border border-blue-200 dark:border-blue-800 cursor-pointer"
                title="Reschedule"
                onClick={() => setReschedulingItem(item)}
              >
                <FiCalendar size={13} />
              </button>
            </>
          )}
        </div>
      ),
    };
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Customer Follow-ups"
        description="Schedule, track, and manage customer callbacks, reminder alerts, and quote follow-ups."
        action={
          <Button onClick={() => setIsScheduleModalOpen(true)}>
            <span className="inline-flex items-center gap-1.5">
              <FiPlus size={16} /> Schedule Follow-up
            </span>
          </Button>
        }
      />

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
        <div className="panel p-6 shadow-sm min-h-43.75 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 tracking-wider uppercase">
              Total Reminders
            </span>
            <div className="w-11 h-11 rounded-xl flex items-center justify-center text-lg bg-blue-50 dark:bg-slate-800/80 text-blue-600 dark:text-blue-400">
              <FiList />
            </div>
          </div>
          <div>
            <div className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {counts.All}
            </div>
            <p className="text-xs font-medium text-emerald-500 mt-2">
              All scheduled callbacks
            </p>
          </div>
        </div>

        <div className="panel p-6 shadow-sm min-h-43.75 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 tracking-wider uppercase">
              Upcoming
            </span>
            <div className="w-11 h-11 rounded-xl flex items-center justify-center text-lg bg-amber-50 dark:bg-slate-800/80 text-amber-500 dark:text-amber-400">
              <FiClock />
            </div>
          </div>
          <div>
            <div className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {counts.Upcoming}
            </div>
            <p className="text-xs font-medium text-amber-500 mt-2">
              Pending callbacks
            </p>
          </div>
        </div>

        <div className="panel p-6 shadow-sm min-h-43.75 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 tracking-wider uppercase">
              Overdue
            </span>
            <div className="w-11 h-11 rounded-xl flex items-center justify-center text-lg bg-rose-50 dark:bg-slate-800/80 text-rose-500 dark:text-rose-400">
              <FiAlertCircle />
            </div>
          </div>
          <div>
            <div className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {counts.Overdue}
            </div>
            <p className="text-xs font-medium text-rose-500 mt-2">
              Require immediate action
            </p>
          </div>
        </div>

        <div className="panel p-6 shadow-sm min-h-43.75 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 tracking-wider uppercase">
              Completed
            </span>
            <div className="w-11 h-11 rounded-xl flex items-center justify-center text-lg bg-emerald-50 dark:bg-slate-800/80 text-emerald-500 dark:text-emerald-400">
              <FiCheckCircle />
            </div>
          </div>
          <div>
            <div className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {counts.Completed}
            </div>
            <p className="text-xs font-medium text-emerald-500 mt-2">
              Successfully finished
            </p>
          </div>
        </div>
      </div>

      {/* Search and Layout Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-1">
        <div className="w-full max-w-md">
          <SearchInput
            placeholder="Search by customer, phone, subject, staff, notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-1 p-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-2xs self-end sm:self-auto">
          <button
            type="button"
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
              viewMode === "cards"
                ? "bg-blue-600 text-white shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
            onClick={() => setViewMode("cards")}
          >
            <FiGrid size={14} /> Cards
          </button>
          <button
            type="button"
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
              viewMode === "table"
                ? "bg-blue-600 text-white shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
            onClick={() => setViewMode("table")}
          >
            <FiList size={14} /> Table
          </button>
        </div>
      </div>

      {/* Filter Tabs Bar */}
      <div className="pt-1 pb-1">
        <FollowUpFilters
          activeFilter={activeFilter}
          onSelectFilter={setActiveFilter}
          counts={counts}
          activePriority={activePriority}
          onSelectPriority={setActivePriority}
        />
      </div>

      {/* Main Content Area: Cards or Table */}
      {filteredFollowUps.length > 0 ? (
        viewMode === "cards" ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-6">
            {filteredFollowUps.map((item) => {
              const customer = customers.find((c) => c.id === item.customerId);
              const customerName = customer ? customer.name : item.customerName || "Customer";
              const customerPhone = customer ? customer.phone : item.customerPhone || "";

              const borderAccent =
                item.status === "Overdue"
                  ? "border-l-4 border-l-rose-500"
                  : item.status === "Completed"
                  ? "border-l-4 border-l-emerald-500"
                  : "border-l-4 border-l-blue-500";

              return (
                <div
                  key={item.id}
                  className={`panel p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-5 ${borderAccent}`}
                >
                  <div className="space-y-3.5">
                    {/* Header: Badges & Due Date */}
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        {getStatusBadge(item.status)}
                        {getPriorityBadge(item.priority)}
                        <span className="text-xs text-slate-400 font-mono">
                          {item.id}
                        </span>
                      </div>

                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-lg inline-flex items-center gap-1.5 ${
                          item.status === "Overdue"
                            ? "bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                        }`}
                      >
                        <FiClock size={12} /> {item.dueDate}
                      </span>
                    </div>

                    {/* Subject */}
                    <h3
                      className="text-base font-bold text-slate-900 dark:text-white cursor-pointer hover:text-blue-500 transition-colors line-clamp-1"
                      onClick={() => setSelectedItemId(item.id)}
                    >
                      {item.subject}
                    </h3>

                    {/* Customer Info Row */}
                    <div className="flex flex-wrap gap-3 items-center justify-between p-3 bg-slate-50 dark:bg-[#111827] rounded-xl text-xs">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                          {customerName.charAt(0) || "C"}
                        </div>
                        <span className="font-semibold text-slate-900 dark:text-white truncate">
                          {customerName}
                        </span>
                      </div>

                      {customerPhone && (
                        <a
                          href={`tel:${customerPhone}`}
                          className="text-blue-600 hover:text-blue-700 dark:text-blue-400 flex items-center gap-1.5 font-medium shrink-0 ml-2"
                          title={`Call ${customerPhone}`}
                        >
                          {getChannelIcon(item.channel)} {customerPhone}
                        </a>
                      )}
                    </div>

                    {/* Linked context */}
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span className="font-mono text-[11px] font-semibold px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 shrink-0">
                        {item.relatedId}
                      </span>
                      <span className="truncate" title={item.relatedTitle}>
                        {item.relatedTitle}
                      </span>
                    </div>

                    {/* Notes snippet */}
                    <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {item.notes}
                    </p>
                  </div>

                  {/* Footer with Staff & Actions */}
                  <div className="pt-4 border-t border-slate-100 dark:border-[#334155] flex flex-wrap items-center justify-between gap-3">
                    <div className="text-xs text-slate-400">
                      Staff: <strong className="text-slate-700 dark:text-slate-300 font-semibold">{item.assignedStaff}</strong>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        className="px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-200 dark:border-[#334155] hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                        onClick={() => setSelectedItemId(item.id)}
                      >
                        Details
                      </button>

                      {item.status !== "Completed" && (
                        <>
                          <button
                            type="button"
                            className="p-2 rounded-xl border border-slate-200 dark:border-[#334155] hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
                            title="Reschedule"
                            onClick={() => setReschedulingItem(item)}
                          >
                            <FiCalendar size={13} />
                          </button>

                          <button
                            type="button"
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 transition-colors cursor-pointer"
                            onClick={() => handleComplete(item.id)}
                          >
                            <FiCheck size={13} /> Done
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <DataTable
            columns={tableColumns}
            data={tableData}
            minWidth="min-w-[950px]"
            emptyMessage="No follow-ups found."
          />
        )
      ) : (
        <div className="py-16 text-center panel space-y-3 shadow-xs">
          <FiInbox className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">
            No Follow-ups Found
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {searchQuery
              ? `No reminders or callbacks matched "${searchQuery}".`
              : `No follow-ups currently listed under ${activeFilter}.`}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            <Button
              variant="secondary"
              onClick={() => {
                setSearchQuery("");
                setActiveFilter("All");
                setActivePriority("All");
              }}
            >
              Reset Filters
            </Button>
            <Button
              variant="primary"
              onClick={() => setIsScheduleModalOpen(true)}
            >
              <span className="inline-flex items-center gap-1.5">
                <FiPlus size={16} /> Schedule Follow-up
              </span>
            </Button>
          </div>
        </div>
      )}

      {/* Schedule Modal */}
      {isScheduleModalOpen && (
        <ScheduleFollowUpModal
          onClose={() => setIsScheduleModalOpen(false)}
          onSubmit={handleCreate}
        />
      )}

      {/* Reschedule Modal */}
      {reschedulingItem && (
        <RescheduleModal
          followUp={reschedulingItem}
          onClose={() => setReschedulingItem(null)}
          onReschedule={handleReschedule}
        />
      )}

      {/* Detail Modal */}
      {selectedItem && (
        <FollowUpDetailModal
          followUp={selectedItem}
          onClose={() => setSelectedItemId(null)}
          onMarkCompleted={handleComplete}
          onOpenReschedule={(item) => setReschedulingItem(item)}
        />
      )}
    </div>
  );
}

export default FollowUps;
