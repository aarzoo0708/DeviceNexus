import { useState, useEffect } from "react";
import PageHeader from "../components/common/PageHeader/PageHeader";
import Button from "../components/common/Button/Button";
import SearchInput from "../components/common/SearchInput/SearchInput";
import Badge from "../components/common/Badge/Badge";
import LogInteractionModal from "../components/interactions/LogInteractionModal";
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
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    const updateData = () => setInteractions(getInteractions());
    const unsubscribe = onDataChange(updateData);
    return unsubscribe;
  }, []);

  // Filtered interactions
  const filteredInteractions = interactions.filter((item) => {
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
    const newErrors = {};
    if (!formData.customerId) newErrors.customerId = "Select a customer.";
    if (!formData.subject.trim()) newErrors.subject = "Subject is required.";
    if (!formData.notes.trim()) newErrors.notes = "Discussion notes are required.";
    if (!formData.staff.trim()) newErrors.staff = "Staff member is required.";
    setFormErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const selectedCust = customers.find((c) => c.id === formData.customerId);

    const now = new Date();
    const newEntry = {
      id: `INT-${Math.floor(300 + Math.random() * 700)}`,
      customerId: formData.customerId,
      customerName: selectedCust?.name || "Customer",
      customerPhone: selectedCust?.phone || "9999999999",
      channel: formData.channel,
      icon: getChannelIcon(formData.channel),
      subject: formData.subject.trim(),
      notes: formData.notes.trim(),
      date: now.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      time: now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      staff: formData.staff.trim(),
      type: "Support",
    };

    addInteraction(newEntry);
    setIsModalOpen(false);
    setFormErrors({});
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
        <LogInteractionModal
          customers={customers}
          formData={formData}
          onClose={() => setIsModalOpen(false)}
          onChange={handleFormChange}
          onSubmit={handleFormSubmit}
          errors={formErrors}
        />
      )}
    </div>
  );
}

export default Interactions;
