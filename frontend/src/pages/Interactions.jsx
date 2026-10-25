import { validateText } from "../utils/validation";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import {
  FiPlus,
  FiPhone,
  FiMessageSquare,
  FiMail,
  FiMapPin,
  FiInbox,
} from "react-icons/fi";
import PageHeader from "../components/common/PageHeader/PageHeader";
import Button from "../components/common/Button/Button";
import SearchInput from "../components/common/SearchInput/SearchInput";
import Badge from "../components/common/Badge/Badge";
import LogInteractionModal from "../components/interactions/LogInteractionModal";
import InteractionDetailModal from "../components/interactions/InteractionDetailModal";
import { addInteraction } from "../store/slices/interactionsSlice";

const CHANNELS = ["All", "Phone Call", "WhatsApp", "Email", "Service Visit"];

function Interactions() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const interactions = useSelector((state) => state.interactions || []);
  const customers = useSelector((state) => state.customers || []);

  const [searchQuery, setSearchQuery] = useState("");
  const [activeChannel, setActiveChannel] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(() => searchParams.get("interaction"));
  const selectedInteraction = interactions.find((item) => item.id === selectedId);

  // Form State
  const [formData, setFormData] = useState({
    customerId: customers[0]?.id || "",
    channel: "Phone Call",
    subject: "",
    notes: "",
    staff: "Alex Morgan",
  });
  const [formErrors, setFormErrors] = useState({});

  // Filtered interactions
  const filteredInteractions = interactions.filter((item) => {
    const matchesChannel =
      activeChannel === "All" || item.channel === activeChannel;

    const query = searchQuery.toLowerCase().trim();
    if (!query) return matchesChannel;

    const customer = customers.find((c) => c.id === item.customerId);
    const customerName = customer ? customer.name.toLowerCase() : (item.customerName || "").toLowerCase();

    const matchesSearch =
      customerName.includes(query) ||
      (item.subject && item.subject.toLowerCase().includes(query)) ||
      (item.notes && item.notes.toLowerCase().includes(query)) ||
      (item.staff && item.staff.toLowerCase().includes(query)) ||
      (item.channel && item.channel.toLowerCase().includes(query));

    return matchesChannel && matchesSearch;
  });

  const getChannelIcon = (channel) => {
    switch (channel) {
      case "Phone Call":
        return <FiPhone className="inline text-blue-500" />;
      case "WhatsApp":
        return <FiMessageSquare className="inline text-green-500" />;
      case "Email":
        return <FiMail className="inline text-purple-500" />;
      case "Service Visit":
        return <FiMapPin className="inline text-amber-500" />;
      default:
        return <FiMessageSquare className="inline" />;
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.customerId) newErrors.customerId = "Select a customer.";
    const subjectError = validateText(formData.subject, "Subject", 3, 120);
    if (subjectError) newErrors.subject = subjectError;
    const notesError = validateText(formData.notes, "Discussion notes", 3, 2000);
    if (notesError) newErrors.notes = notesError;
    const staffError = validateText(formData.staff, "Staff member", 2, 60);
    if (staffError) newErrors.staff = staffError;
    setFormErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const selectedCust = customers.find((c) => c.id === formData.customerId);

    const now = new Date();
    const newEntry = {
      id: `INT-${Math.floor(300 + Math.random() * 700)}`,
      customerId: formData.customerId,
      customerName: selectedCust?.name || "Customer",
      customerPhone: selectedCust?.phone || "N/A",
      channel: formData.channel,
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

    dispatch(addInteraction(newEntry));
    setIsModalOpen(false);
    setFormErrors({});
    setFormData({
      customerId: customers[0]?.id || "",
      channel: "Phone Call",
      subject: "",
      notes: "",
      staff: "Alex Morgan",
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Customer Interactions"
        description="View communication history, phone calls, messages, and customer interaction logs."
        action={
          <Button onClick={() => setIsModalOpen(true)}>
            <FiPlus className="inline mr-1" /> Log Interaction
          </Button>
        }
      />

      {/* Search & Channel Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="w-full max-w-md">
          <SearchInput
            placeholder="Search by customer, subject, staff, notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2.5 pb-1">
        {CHANNELS.map((ch) => {
          const isActive = activeChannel === ch;
          return (
            <button
              key={ch}
              type="button"
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-colors whitespace-nowrap ${
                isActive
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-white dark:bg-[#1e293b] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-[#334155] hover:bg-slate-50 dark:hover:bg-slate-800"
              }`}
              onClick={() => setActiveChannel(ch)}
            >
              {ch !== "All" && <span>{getChannelIcon(ch)}</span>}
              <span>{ch}</span>
            </button>
          );
        })}
      </div>

      {/* Timeline List */}
      <div className="space-y-4">
        {filteredInteractions.length > 0 ? (
          filteredInteractions.map((item) => {
            const customer = customers.find((c) => c.id === item.customerId);
            const customerName = customer ? customer.name : item.customerName || "Customer";
            const customerPhone = customer ? customer.phone : item.customerPhone || "";

            return (
              <button type="button"
                className="ui-clickable w-full text-left panel p-6 shadow-sm space-y-4"
                key={item.id}
                aria-label={`View interaction: ${item.subject}`}
                aria-haspopup="dialog"
                onClick={() => setSelectedId(item.id)}
              >
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                  <div className="flex min-w-0 items-start gap-4">
                    <span className="w-11 h-11 rounded-xl bg-slate-100 dark:bg-slate-800/80 flex items-center justify-center shrink-0 text-lg">
                      {getChannelIcon(item.channel)}
                    </span>
                    <div>
                      <h3 className="text-base font-semibold text-slate-900 dark:text-white leading-tight">
                        {item.subject}
                      </h3>
                      <span className="text-xs text-slate-500 dark:text-slate-400 mt-1 block">
                        Customer: <span className="font-semibold text-slate-800 dark:text-slate-200">{customerName}</span>
                        {customerPhone && ` • ${customerPhone}`}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:items-end gap-2 shrink-0">
                    <Badge variant="info">{item.channel}</Badge>
                    <span className="text-xs text-slate-400 dark:text-slate-400 whitespace-nowrap">
                      {item.date} • {item.time}
                    </span>
                  </div>
                </div>

                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed break-words sm:pl-15">
                  {item.notes}
                </p>

                <div className="flex justify-between items-center text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-[#334155] pt-3.5 mt-2 sm:pl-15 gap-3 flex-wrap">
                  <span>
                    Logged by: <strong className="font-semibold text-slate-700 dark:text-slate-300">{item.staff}</strong>
                  </span>
                  <span className="font-mono text-xs font-semibold text-slate-400 dark:text-slate-500">
                    {item.id} <span className="ml-3 text-blue-500">View details →</span>
                  </span>
                </div>
              </button>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center p-12 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-center gap-3">
            <div className="text-slate-400 dark:text-slate-500">
              <FiInbox className="w-10 h-10 mx-auto" />
            </div>
            <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100">
              No Interactions Found
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm">
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
      {selectedInteraction && (
        <InteractionDetailModal
          interaction={selectedInteraction}
          customer={customers.find((customer) => customer.id === selectedInteraction.customerId)}
          onClose={() => setSelectedId(null)}
          onViewCustomer={() => navigate(`/customers/${selectedInteraction.customerId}`)}
        />
      )}
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
