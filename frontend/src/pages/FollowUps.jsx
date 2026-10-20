import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
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
  getFollowUps,
  addFollowUp,
  markFollowUpCompleted,
  rescheduleFollowUp,
  onDataChange,
} from "../data/mockData";
import "./FollowUps.css";

function FollowUps() {
  const [followUps, setFollowUps] = useState(() => getFollowUps());
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [activePriority, setActivePriority] = useState("All");
  const [viewMode, setViewMode] = useState("cards"); // 'cards' | 'table'

  // Modals state
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [reschedulingItem, setReschedulingItem] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state?.openScheduleModal) {
      setIsScheduleModalOpen(true);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  useEffect(() => {
    const refreshData = () => setFollowUps(getFollowUps());
    const unsubscribe = onDataChange(refreshData);
    return unsubscribe;
  }, []);

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
    // Status filter
    const matchesStatus =
      activeFilter === "All" || item.status === activeFilter;

    // Priority filter
    const matchesPriority =
      activePriority === "All" || item.priority === activePriority;

    // Search query
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      item.customerName?.toLowerCase().includes(q) ||
      item.customerPhone?.toLowerCase().includes(q) ||
      item.subject?.toLowerCase().includes(q) ||
      item.notes?.toLowerCase().includes(q) ||
      item.assignedStaff?.toLowerCase().includes(q) ||
      item.relatedId?.toLowerCase().includes(q) ||
      item.id?.toLowerCase().includes(q);

    return matchesStatus && matchesPriority && matchesSearch;
  });

  const handleCreate = (newFollowUp) => {
    addFollowUp(newFollowUp);
    setIsScheduleModalOpen(false);
  };

  const handleComplete = (id, completionNotes) => {
    markFollowUpCompleted(id, completionNotes);
    if (selectedItem?.id === id) {
      setSelectedItem((prev) =>
        prev ? { ...prev, status: "Completed", completionNotes } : null
      );
    }
  };

  const handleReschedule = (id, newDate, newTime, reason) => {
    rescheduleFollowUp(id, newDate, newTime, reason);
    setReschedulingItem(null);
    if (selectedItem?.id === id) {
      setSelectedItem((prev) =>
        prev
          ? {
              ...prev,
              dueDate: newDate,
              dueTime: newTime,
              status: "Upcoming",
            }
          : null
      );
    }
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
        return "📞";
      case "WhatsApp":
        return "💬";
      case "Email":
        return "📧";
      case "Service Visit":
        return "🏢";
      default:
        return "⏰";
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

  const tableData = filteredFollowUps.map((item) => ({
    id: <span style={{ fontWeight: "600" }}>{item.id}</span>,
    customer: (
      <div>
        <div style={{ fontWeight: "600", color: "var(--text-primary)" }}>
          {item.customerName}
        </div>
        <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>
          {getChannelIcon(item.channel)} {item.customerPhone}
        </div>
      </div>
    ),
    subject: (
      <div
        style={{ cursor: "pointer", fontWeight: "500", maxWidth: "260px" }}
        onClick={() => setSelectedItem(item)}
      >
        <span style={{ color: "var(--primary)" }}>{item.subject}</span>
        <div
          style={{
            fontSize: "11px",
            color: "var(--text-muted)",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {item.notes}
        </div>
      </div>
    ),
    related: (
      <div>
        <span className="related-pill">{item.relatedId}</span>
        <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>
          {item.relatedType}
        </div>
      </div>
    ),
    dueDate: (
      <span
        style={{
          fontWeight: "600",
          fontSize: "12px",
          color: item.status === "Overdue" ? "var(--danger)" : "var(--text-primary)",
        }}
      >
        {item.dueDate} · {item.dueTime}
      </span>
    ),
    priority: getPriorityBadge(item.priority),
    status: getStatusBadge(item.status),
    staff: <span style={{ fontSize: "12px" }}>{item.assignedStaff}</span>,
    actions: (
      <div style={{ display: "flex", gap: "6px" }}>
        <button
          className="card-action-btn"
          title="View Details"
          onClick={() => setSelectedItem(item)}
        >
          👁
        </button>
        {item.status !== "Completed" && (
          <>
            <button
              className="card-action-btn btn-complete"
              title="Mark as Completed"
              onClick={() => handleComplete(item.id)}
            >
              ✓
            </button>
            <button
              className="card-action-btn btn-reschedule"
              title="Reschedule"
              onClick={() => setReschedulingItem(item)}
            >
              📅
            </button>
          </>
        )}
      </div>
    ),
  }));

  return (
    <div className="page-container followups-page">
      <PageHeader
        title="Customer Follow-ups"
        description="Schedule, track, and manage customer callbacks, reminder alerts, and quote follow-ups."
        action={
          <Button onClick={() => setIsScheduleModalOpen(true)}>
            + Schedule Follow-up
          </Button>
        }
      />

      {/* KPI Stats Cards */}
      <div className="followup-stats-grid">
        <div className="followup-stat-card">
          <div className="followup-stat-icon stat-total">📋</div>
          <div className="followup-stat-info">
            <span className="followup-stat-number">{counts.All}</span>
            <span className="followup-stat-label">Total Reminders</span>
          </div>
        </div>

        <div className="followup-stat-card">
          <div className="followup-stat-icon stat-upcoming">⏰</div>
          <div className="followup-stat-info">
            <span className="followup-stat-number">{counts.Upcoming}</span>
            <span className="followup-stat-label">Upcoming Callbacks</span>
          </div>
        </div>

        <div className="followup-stat-card">
          <div className="followup-stat-icon stat-overdue">⚠️</div>
          <div className="followup-stat-info">
            <span className="followup-stat-number">{counts.Overdue}</span>
            <span className="followup-stat-label">Overdue Follow-ups</span>
          </div>
        </div>

        <div className="followup-stat-card">
          <div className="followup-stat-icon stat-completed">✓</div>
          <div className="followup-stat-info">
            <span className="followup-stat-number">{counts.Completed}</span>
            <span className="followup-stat-label">Completed</span>
          </div>
        </div>
      </div>

      {/* Search and Layout Controls */}
      <div className="followups-controls-bar">
        <div className="followups-search-wrap">
          <SearchInput
            placeholder="Search by customer, phone, subject, staff, notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="view-mode-toggle">
          <button
            type="button"
            className={`view-toggle-btn ${viewMode === "cards" ? "active" : ""}`}
            onClick={() => setViewMode("cards")}
          >
            ▦ Cards
          </button>
          <button
            type="button"
            className={`view-toggle-btn ${viewMode === "table" ? "active" : ""}`}
            onClick={() => setViewMode("table")}
          >
            ☰ Table
          </button>
        </div>
      </div>

      {/* Filter Tabs Bar */}
      <FollowUpFilters
        activeFilter={activeFilter}
        onSelectFilter={setActiveFilter}
        counts={counts}
        activePriority={activePriority}
        onSelectPriority={setActivePriority}
      />

      {/* Main Content Area: Cards or Table */}
      {filteredFollowUps.length > 0 ? (
        viewMode === "cards" ? (
          <div className="followups-cards-grid">
            {filteredFollowUps.map((item) => (
              <div
                key={item.id}
                className={`followup-card ${item.status.toLowerCase()}`}
              >
                {/* Header: Badges & Due Date */}
                <div className="followup-card-header">
                  <div className="followup-badges-wrap">
                    {getStatusBadge(item.status)}
                    {getPriorityBadge(item.priority)}
                    <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                      {item.id}
                    </span>
                  </div>

                  <span
                    className={`due-time-tag ${
                      item.status === "Overdue" ? "overdue" : ""
                    }`}
                  >
                    ⏰ {item.dueDate} · {item.dueTime}
                  </span>
                </div>

                {/* Subject */}
                <h3
                  className="followup-card-title"
                  onClick={() => setSelectedItem(item)}
                >
                  {item.subject}
                </h3>

                {/* Customer Info Row */}
                <div className="followup-customer-row">
                  <div className="customer-name-group">
                    <div className="customer-avatar">
                      {item.customerName?.charAt(0) || "C"}
                    </div>
                    <span>{item.customerName}</span>
                  </div>

                  <a
                    href={`tel:${item.customerPhone}`}
                    className="contact-quick-link"
                    title={`Call ${item.customerPhone}`}
                  >
                    {getChannelIcon(item.channel)} {item.customerPhone}
                  </a>
                </div>

                {/* Linked context */}
                <div className="followup-related-row">
                  <span className="related-pill">{item.relatedId}</span>
                  <span className="related-title-text" title={item.relatedTitle}>
                    {item.relatedTitle}
                  </span>
                </div>

                {/* Notes snippet */}
                <p className="followup-notes-text">{item.notes}</p>

                {/* Footer with Staff & Actions */}
                <div className="followup-card-footer">
                  <div className="staff-assigned-tag">
                    Staff: <strong>{item.assignedStaff}</strong>
                  </div>

                  <div className="followup-action-buttons">
                    <button
                      type="button"
                      className="card-action-btn"
                      onClick={() => setSelectedItem(item)}
                    >
                      Details
                    </button>

                    {item.status !== "Completed" && (
                      <>
                        <button
                          type="button"
                          className="card-action-btn btn-reschedule"
                          onClick={() => setReschedulingItem(item)}
                        >
                          📅 Reschedule
                        </button>

                        <button
                          type="button"
                          className="card-action-btn btn-complete"
                          onClick={() => handleComplete(item.id)}
                        >
                          ✓ Done
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <DataTable columns={tableColumns} data={tableData} />
        )
      ) : (
        <div className="followups-empty-state">
          <div className="followups-empty-icon">⏰</div>
          <h3>No Follow-ups Found</h3>
          <p>
            {searchQuery
              ? `No reminders or callbacks matched "${searchQuery}".`
              : `No follow-ups currently listed under ${activeFilter}.`}
          </p>
          <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
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
              + Schedule Follow-up
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
          onClose={() => setSelectedItem(null)}
          onMarkCompleted={handleComplete}
          onOpenReschedule={(item) => setReschedulingItem(item)}
        />
      )}
    </div>
  );
}

export default FollowUps;
