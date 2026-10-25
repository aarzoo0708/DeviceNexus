import { useNavigate } from "react-router";
import { useSelector } from "react-redux";

function ServicePipeline() {
  const navigate = useNavigate();

  const requests = useSelector((state) => state.serviceRequests || []);
  const customers = useSelector((state) => state.customers || []);
  const devices = useSelector((state) => state.devices || []);

  const statusCounts = ["New", "Assigned", "In Progress", "Resolved"].map((status) => ({
    label: status,
    value: requests.filter((request) => request.status === status).length,
  }));

  const getCustomerName = (customerId) => {
    const cust = customers.find((c) => c.id === customerId);
    return cust ? cust.name : "Customer";
  };

  const getDeviceName = (deviceId) => {
    const dev = devices.find((d) => d.id === deviceId);
    return dev ? dev.name : "Device";
  };

  const recentRequests = requests.slice(0, 4);

  return (
    <section className="panel shadow-sm overflow-hidden flex flex-col">
      {/* Header */}
      <div className="px-6 sm:px-7 py-5 border-b border-slate-100 dark:border-[#334155] flex items-center justify-between">
        <div>
          <p className="text-xs font-bold text-blue-500 uppercase tracking-wider">
            SERVICE OPERATIONS
          </p>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
            Service Requests
          </h2>
        </div>

        <button
          type="button"
          className="text-sm font-semibold text-blue-500 hover:text-blue-400 dark:text-blue-400 flex items-center gap-1.5 transition-colors cursor-pointer"
          onClick={() => navigate("/service-requests")}
        >
          View all →
        </button>
      </div>

      {/* Connected Horizontal Status Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 border-b border-slate-100 dark:border-[#334155] bg-slate-50/50 dark:bg-[#111827]/50">
        {statusCounts.map((status, index) => (
          <button
            type="button"
            key={status.label}
            className={`ui-clickable w-full text-left px-4 py-4 flex flex-wrap gap-2 items-center justify-between cursor-pointer hover:bg-slate-100/60 dark:hover:bg-slate-800/40 transition-colors ${
              index < statusCounts.length - 1
                ? "border-r border-slate-100 dark:border-[#334155]"
                : ""
            }`}
            onClick={() => navigate(`/service-requests?status=${encodeURIComponent(status.label)}`)}
            aria-label={`View ${status.label} requests`}
            title={`View ${status.label} requests`}
          >
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
              {status.label}
            </span>
            <strong className="text-base font-bold text-slate-900 dark:text-white">
              {status.value}
            </strong>
          </button>
        ))}
      </div>

      {/* Request List */}
      <div className="divide-y divide-slate-100 dark:divide-[#334155]">
        {recentRequests.length > 0 ? (
          recentRequests.map((request) => (
            <button
            type="button"
              key={request.id}
              className="ui-clickable w-full text-left px-6 py-5 grid grid-cols-[minmax(0,1fr)_auto] sm:grid-cols-[5rem_minmax(0,1fr)_auto] items-center gap-x-4 gap-y-2 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer"
              onClick={() => navigate(`/service-requests?request=${encodeURIComponent(request.id)}`)}
              aria-label={`Open request ${request.id}`}
              title="Click to view in Service Requests"
            >
              <div className="col-span-2 sm:col-span-1 font-mono text-xs font-semibold text-slate-500 dark:text-slate-400">
                {request.id}
              </div>

              <div className="flex-1 min-w-0 pr-2">
                <strong className="block text-sm font-semibold text-slate-900 dark:text-white break-words leading-relaxed">
                  {request.issue}
                </strong>
                <span className="block text-xs text-slate-500 dark:text-slate-400 truncate mt-1">
                  {getDeviceName(request.deviceId)} · {getCustomerName(request.customerId)}
                </span>
              </div>

              <div className="flex flex-col items-end gap-2 shrink-0">
                <span
                  className={`text-xs px-2.5 py-1 rounded-md font-semibold ${
                    request.priority === "High"
                      ? "bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 dark:border dark:border-rose-800/40"
                      : request.priority === "Critical"
                      ? "bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 dark:border dark:border-purple-800/40"
                      : "bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 dark:border dark:border-blue-800/40"
                  }`}
                >
                  {request.priority || "Medium"}
                </span>

                <span
                  className={`text-xs px-3 py-1 rounded-md font-semibold whitespace-nowrap ${
                    request.status === "Resolved"
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border dark:border-emerald-800/40"
                      : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:border dark:border-slate-700"
                  }`}
                >
                  {request.status}
                </span>
              </div>
            </button>
          ))
        ) : (
          <div className="p-6 text-center text-xs text-slate-500 dark:text-slate-400">
            No service requests found.
          </div>
        )}
      </div>
    </section>
  );
}

export default ServicePipeline;
