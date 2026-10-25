import Badge from "../common/Badge/Badge";

export const columns = [
  { key: "customer", label: "Customer" },
  { key: "contact", label: "Contact" },
  { key: "devices", label: "Devices" },
  { key: "status", label: "Status" },
  { key: "joined", label: "Joined" },
  { key: "actions", label: "Actions" },
];

export const getCustomerTableData = (filteredCustomers, navigate, allDevices = []) => {
  return filteredCustomers.map((customer) => {
    let badgeVariant = "default";
    if (customer.status === "Active") badgeVariant = "success";
    if (customer.status === "Pending") badgeVariant = "warning";
    if (customer.status === "Inactive") badgeVariant = "danger";

    // Dynamically calculate linked devices count using foreign key relationship
    const linkedDeviceCount = allDevices.filter(
      (d) => d.customerId === customer.id
    ).length;

    return {
      id: customer.id,
      customer: (
        <div>
          <div className="font-semibold text-slate-900 dark:text-white text-sm">{customer.name}</div>
          <div className="font-mono text-xs text-blue-600 dark:text-blue-400">{customer.id}</div>
        </div>
      ),
      contact: (
        <div>
          <div className="text-sm text-slate-800 dark:text-slate-200">{customer.email}</div>
          <div className="text-xs text-slate-500 dark:text-slate-400">
            {customer.phone}
          </div>
        </div>
      ),
      devices: (
        <span className="font-semibold text-slate-900 dark:text-white text-sm">{linkedDeviceCount}</span>
      ),
      status: <Badge variant={badgeVariant}>{customer.status}</Badge>,
      joined: <span className="text-sm text-slate-700 dark:text-slate-300">{customer.joinedDate}</span>,
      actions: (
        <button
          type="button"
          className="px-2.5 py-1 text-xs font-semibold rounded bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/60 dark:hover:bg-blue-900/60 text-blue-600 dark:text-blue-400 transition-colors cursor-pointer"
          onClick={() => navigate(`/customers/${customer.id}`)}
        >
          View Profile
        </button>
      ),
    };
  });
};
