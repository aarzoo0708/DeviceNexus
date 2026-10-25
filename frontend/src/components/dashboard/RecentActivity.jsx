import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { FiTool, FiMessageSquare, FiClock } from "react-icons/fi";

function RecentActivity() {
  const navigate = useNavigate();

  const serviceRequests = useSelector((state) => state.serviceRequests || []);
  const interactions = useSelector((state) => state.interactions || []);
  const followUps = useSelector((state) => state.followUps || []);

  const dynamicActivities = [
    ...serviceRequests.slice(0, 2).map((r) => ({
      id: `req-${r.id}`,
      typeStyle: "bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400",
      icon: <FiTool size={14} />,
      title: `Service Request ${r.id}`,
      description: r.issue,
      time: r.createdDate || "Recently",
      path: `/service-requests?request=${encodeURIComponent(r.id)}`,
    })),
    ...interactions.slice(0, 2).map((i) => ({
      id: `int-${i.id}`,
      typeStyle: "bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400",
      icon: <FiMessageSquare size={14} />,
      title: `${i.channel}: ${i.subject}`,
      description: `Logged by ${i.staff}`,
      time: `${i.date} ${i.time || ""}`,
      path: `/interactions?interaction=${encodeURIComponent(i.id)}`,
    })),
    ...followUps.slice(0, 1).map((f) => ({
      id: `flp-${f.id}`,
      typeStyle: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400",
      icon: <FiClock size={14} />,
      title: `Follow-up: ${f.subject}`,
      description: `Status: ${f.status} (${f.assignedStaff})`,
      time: `Due: ${f.dueDate}`,
      path: `/follow-ups?followUp=${encodeURIComponent(f.id)}`,
    })),
  ].slice(0, 4);

  return (
    <section className="panel shadow-sm overflow-hidden flex flex-col">
      <div className="px-6 sm:px-7 py-5 border-b border-slate-100 dark:border-[#334155] flex items-center justify-between">
        <div>
          <p className="text-xs font-bold text-blue-500 uppercase tracking-wider">
            TIMELINE
          </p>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
            Recent Activity
          </h2>
        </div>

        <button
          type="button"
          className="text-sm font-semibold text-blue-500 hover:text-blue-400 dark:text-blue-400 flex items-center gap-1.5 transition-colors cursor-pointer"
          onClick={() => navigate("/interactions")}
        >
          View all →
        </button>
      </div>

      <div className="divide-y divide-slate-100 dark:divide-[#334155]">
        {dynamicActivities.length > 0 ? (
          dynamicActivities.map((activity) => (
            <button type="button"
              key={activity.id}
              className="ui-clickable w-full text-left px-6 sm:px-7 py-4 flex flex-wrap sm:flex-nowrap items-center gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer"
              onClick={() => navigate(activity.path)}
              aria-label={`View ${activity.title}`}
              title="Click to view details"
            >
              <div
                className={`w-10 h-10 shrink-0 flex items-center justify-center rounded-xl ${activity.typeStyle}`}
              >
                {activity.icon}
              </div>

              <div className="flex-1 min-w-0 pr-2">
                <strong className="block text-sm font-semibold text-slate-900 dark:text-white wrap-break-word">
                  {activity.title}
                </strong>
                <span className="block text-xs text-slate-500 dark:text-slate-400 wrap-break-word mt-1">
                  {activity.description}
                </span>
              </div>

              <div className="w-full sm:w-auto sm:max-w-28 text-xs text-slate-500 dark:text-slate-400 shrink-0 font-medium">
                {activity.time}
              </div>
            </button>
          ))
        ) : (
          <p className="p-6 text-center text-xs text-slate-500 dark:text-slate-400">
            No recent activity recorded.
          </p>
        )}
      </div>
    </section>
  );
}

export default RecentActivity;
