import { useNavigate } from "react-router";
import { FiUserPlus, FiPlusCircle, FiTool, FiCalendar, FiArrowRight } from "react-icons/fi";

const actions = [
  {
    label: "Add Customer",
    description: "Create a new customer profile",
    icon: <FiUserPlus size={18} />,
    typeStyle: "bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400",
    path: "/customers/add",
  },
  {
    label: "Register Device",
    description: "Add a hardware device for a customer",
    icon: <FiPlusCircle size={18} />,
    typeStyle: "bg-sky-50 text-sky-600 dark:bg-sky-950/60 dark:text-sky-400",
    path: "/devices",
    state: { openAddModal: true },
  },
  {
    label: "Create Service Request",
    description: "Open a new service or repair ticket",
    icon: <FiTool size={18} />,
    typeStyle: "bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400",
    path: "/service-requests",
    state: { openCreateModal: true },
  },
  {
    label: "Schedule Follow-up",
    description: "Set customer callback or reminder",
    icon: <FiCalendar size={18} />,
    typeStyle: "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400",
    path: "/follow-ups",
    state: { openScheduleModal: true },
  },
];

function QuickActions() {
  const navigate = useNavigate();

  return (
    <section className="panel shadow-sm overflow-hidden flex flex-col justify-between h-full">
      <div className="px-6 sm:px-7 py-5 border-b border-slate-100 dark:border-[#334155]">
        <p className="text-xs font-bold text-blue-500 uppercase tracking-wider">
          SHORTCUTS
        </p>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
          Quick Actions
        </h2>
      </div>

      <div className="divide-y divide-slate-100 dark:divide-[#334155]">
        {actions.map((action) => (
          <button
            key={action.label}
            className="ui-clickable group w-full flex items-center gap-4 px-6 sm:px-7 py-4 text-left hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer"
            onClick={() => navigate(action.path, { state: action.state })}
          >
            <div
              className={`w-11 h-11 shrink-0 flex items-center justify-center rounded-xl ${action.typeStyle}`}
            >
              {action.icon}
            </div>

            <div className="flex-1 min-w-0 pr-2">
              <strong className="block text-sm font-semibold text-slate-900 dark:text-white group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors">
                {action.label}
              </strong>
              <span className="block text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-1">
                {action.description}
              </span>
            </div>

            <span className="text-slate-400 group-hover:text-blue-500 dark:group-hover:text-blue-400 group-hover:translate-x-1 transition-all">
              <FiArrowRight size={18} />
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}

export default QuickActions;
