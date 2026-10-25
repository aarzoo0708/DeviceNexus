import Badge from "../common/Badge/Badge";

export const calculateWarrantyStatus = (expiryDate) => {
  if (!expiryDate) return { status: "Expired", daysRemaining: 0 };
  const expiry = new Date(expiryDate);
  if (isNaN(expiry.getTime())) {
    return { status: "Expired", daysRemaining: 0 };
  }
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  expiry.setHours(0, 0, 0, 0);

  const diffTime = expiry.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) {
    return { status: "Expired", daysRemaining: 0 };
  } else if (diffDays <= 30) {
    return { status: "Expiring Soon", daysRemaining: diffDays };
  } else {
    return { status: "Active", daysRemaining: diffDays };
  }
};

export const getStatusVariant = (status) => {
  switch (status) {
    case "Active":
      return "success";
    case "Expiring Soon":
      return "warning";
    case "Expired":
      return "danger";
    default:
      return "default";
  }
};

export const columns = [
  { key: "warrantyId", label: "Policy ID" },
  { key: "device", label: "Device & Serial" },
  { key: "customer", label: "Customer" },
  { key: "coverageType", label: "Coverage / Provider" },
  { key: "expiry", label: "Expiry Date" },
  { key: "status", label: "Status" },
  { key: "actions", label: "Actions" },
];

export const getWarrantyTableData = (
  filteredWarranties,
  setSelectedWarranty,
  customers = [],
  devices = []
) => {
  return filteredWarranties.map((w) => {
    const customer = customers.find((c) => c.id === w.customerId);
    const device = devices.find((d) => d.id === w.deviceId);

    const customerName = customer ? customer.name : w.customerName || "Customer";
    const customerPhone = customer ? customer.phone : w.customerPhone || "";
    const deviceName = device ? device.name : w.deviceName || "Device";
    const serialNumber = device ? device.serialNumber : w.serialNumber || "N/A";
    const deviceType = device ? device.type : w.deviceType || "Device";

    const { status, daysRemaining } = calculateWarrantyStatus(w.expiryDate);

    return {
      id: w.id,
      warrantyId: (
        <span className="font-mono font-bold text-blue-600 dark:text-blue-400 text-xs">
          {w.id}
        </span>
      ),
      device: (
        <div>
          <div className="font-semibold text-slate-900 dark:text-white text-sm">
            {deviceName}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400">
            {serialNumber} • {deviceType}
          </div>
        </div>
      ),
      customer: (
        <div>
          <div className="font-semibold text-slate-900 dark:text-white text-sm">
            {customerName}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400">{customerPhone}</div>
        </div>
      ),
      coverageType: (
        <div>
          <div className="font-semibold text-slate-900 dark:text-white text-sm">
            {w.warrantyType}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400">{w.provider}</div>
        </div>
      ),
      expiry: (
        <div>
          <div className="font-medium text-slate-900 dark:text-slate-200 text-sm">
            {w.expiryDate}
          </div>
          {status === "Active" && (
            <div className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              {daysRemaining} days left
            </div>
          )}
          {status === "Expiring Soon" && (
            <div className="text-xs text-amber-600 dark:text-amber-400 font-medium">
              Expiring: {daysRemaining} days left
            </div>
          )}
          {status === "Expired" && (
            <div className="text-xs text-rose-600 dark:text-rose-400 font-medium">Expired</div>
          )}
        </div>
      ),
      status: (
        <Badge variant={getStatusVariant(status)}>{status}</Badge>
      ),
      actions: (
        <button
          type="button"
          className="px-2.5 py-1 text-xs font-semibold rounded bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/60 dark:hover:bg-blue-900/60 text-blue-600 dark:text-blue-400 transition-colors cursor-pointer"
          onClick={() => setSelectedWarranty({ ...w, status, daysRemaining })}
        >
          View Policy
        </button>
      ),
    };
  });
};
