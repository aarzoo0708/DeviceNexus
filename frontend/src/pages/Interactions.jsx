import { useState, useEffect, useMemo } from "react";
import PageHeader from "../components/common/PageHeader/PageHeader";
import Button from "../components/common/Button/Button";
import SearchInput from "../components/common/SearchInput/SearchInput";
import Badge from "../components/common/Badge/Badge";
import {
  getInteractions,
  addInteraction,
  getCustomers,
  onDataChange,
} from "../data/mockData";
import "./Interactions.css";

const CHANNELS = ["All", "Phone Call", "WhatsApp", "Email", "Service Visit"];

function Interactions() {
  const [interactions, setInteractions] = useState(() => getInteractions());
  const [searchQuery, setSearchQuery] = useState("");
  const [activeChannel, setActiveChannel] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const customers = getCustomers();
  const [formData, setFormData] = useState({
    customerId: customers[0]?.id || "",
    channel: "Phone Call",
    subject: "",
    notes: "",
    staff: "Aman Gupta",
  });

  useEffect(() => {
    const updateData = () => setInteractions(getInteractions());
    const unsubscribe = onDataChange(updateData);
    return unsubscribe;
  }, []);

  // Filtered interactions
  const filteredInteractions = useMemo(() => {
    return interactions.filter((item) => {
      const matchesChannel =
        activeChannel === "All" || item.channel === activeChannel;

      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        (item.customerName &&
          item.customerName.toLowerCase().includes(query)) ||
        (item.subject && item.subject.toLowerCase().includes(query)) ||
        (item.notes && item.notes.toLowerCase().includes(query)) ||
        (item.staff && item.staff.toLowerCase().includes(query));

      return matchesChannel && matchesSearch;
    });
  }, [interactions, activeChannel, searchQuery]);

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
        return "💬";
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.subject.trim()) return;

    const selectedCust = customers.find((c) => c.id === formData.customerId);

    const now = new Date();
    const newEntry = {
      id: `INT-${Math.floor(300 + Math.random() * 700)}`,
      customerId: formData.customerId,
      customerName: selectedCust?.name || "Customer",
      customerPhone: selectedCust?.phone || "9999999999",
      channel: formData.channel,
      icon: getChannelIcon(formData.channel),
      subject: formData.subject,
      notes: formData.notes,
      date: now.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      time: now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      staff: formData.staff,
      type: "Support",
    };

    addInteraction(newEntry);
    setInteractions((prev) => [newEntry, ...prev]);
    setIsModalOpen(false);
    setFormData({
      customerId: customers[0]?.id || "",
      channel: "Phone Call",
      subject: "",
      notes: "",
      staff: "Aman Gupta",
    });
  };

  return (
    <div className="page-container interactions-page">
      <PageHeader
        title="Customer Interactions"
        description="View communication history, phone calls, messages, and customer interaction logs."
        action={
          <Button onClick={() => setIsModalOpen(true)}>
            + Log Interaction
          </Button>
        }
      />

      {/* Search & Channel Filter */}
      <div className="interactions-controls">
        <div className="interactions-search-box">
          <SearchInput
            placeholder="Search by customer, subject, staff, notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="channel-filter-chips">
          {CHANNELS.map((ch) => (
            <button
              key={ch}
              type="button"
              className={`channel-chip ${activeChannel === ch ? "active" : ""}`}
              onClick={() => setActiveChannel(ch)}
            >
              {ch !== "All" && <span>{getChannelIcon(ch)}</span>}
              <span>{ch}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Timeline List */}
      <div className="timeline-container">
        {filteredInteractions.length > 0 ? (
          filteredInteractions.map((item) => (
            <div className="timeline-card" key={item.id}>
              <div className="timeline-card-header">
                <div className="timeline-badge-group">
                  <span className="channel-icon-badge">{item.icon}</span>
                  <div>
                    <h3 className="timeline-subject">{item.subject}</h3>
                    <span className="timeline-customer-sub">
                      Customer: <strong>{item.customerName}</strong> (
                      {item.customerPhone})
                    </span>
                  </div>
                </div>

                <div className="timeline-meta">
                  <Badge variant="info">{item.channel}</Badge>
                  <span className="timeline-time">
                    {item.date} · {item.time}
                  </span>
                </div>
              </div>

              <p className="timeline-body-text">{item.notes}</p>

              <div className="timeline-card-footer">
                <span>
                  Logged by: <strong>{item.staff}</strong>
                </span>
                <span className="interaction-id">{item.id}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="interactions-empty-state">
            <div className="empty-icon">💬</div>
            <h3>No Interactions Found</h3>
            <p>
              {searchQuery
                ? `No interaction logs matched "${searchQuery}".`
                : `No interaction logs found in ${activeChannel}.`}
            </p>
            <Button
              variant="secondary"
              onClick={() => {
                setSearchQuery("");
                setActiveChannel("All");
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>

      {/* Log Interaction Modal */}
      {isModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div
            className="modal-card log-modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <div>
                <h2 className="modal-title">Log Customer Interaction</h2>
                <p className="modal-subtitle">
                  Record a phone call, WhatsApp, or store visit note
                </p>
              </div>
              <button
                className="modal-close-btn"
                onClick={() => setIsModalOpen(false)}
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="modal-body form-body">
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Customer</label>
                  <select
                    name="customerId"
                    className="form-control"
                    value={formData.customerId}
                    onChange={handleFormChange}
                    required
                  >
                    {customers.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.id})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Communication Channel</label>
                  <select
                    name="channel"
                    className="form-control"
                    value={formData.channel}
                    onChange={handleFormChange}
                  >
                    <option value="Phone Call">📞 Phone Call</option>
                    <option value="WhatsApp">💬 WhatsApp</option>
                    <option value="Email">📧 Email</option>
                    <option value="Service Visit">🏢 Service Visit</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Subject / Purpose *</label>
                <input
                  type="text"
                  name="subject"
                  className="form-control"
                  placeholder="e.g. Repair status update, Quote discussion, Follow-up call"
                  value={formData.subject}
                  onChange={handleFormChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Discussion Notes *</label>
                <textarea
                  name="notes"
                  rows={3}
                  className="form-control"
                  placeholder="Summarize what the customer said, agreed cost, next steps..."
                  value={formData.notes}
                  onChange={handleFormChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Staff Member</label>
                <input
                  type="text"
                  name="staff"
                  className="form-control"
                  value={formData.staff}
                  onChange={handleFormChange}
                  required
                />
              </div>

              <div className="modal-footer form-footer">
                <Button
                  variant="secondary"
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button variant="primary" type="submit">
                  Save Log
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Interactions;