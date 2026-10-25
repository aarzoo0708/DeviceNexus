import { useParams, useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { FiArrowLeft, FiPlusCircle, FiTool } from "react-icons/fi";
import PageHeader from "../components/common/PageHeader/PageHeader";
import Button from "../components/common/Button/Button";
import Card from "../components/common/Card/Card";
import Badge from "../components/common/Badge/Badge";
import DataTable from "../components/common/DataTable/DataTable";
import {
  deviceColumns,
  getFormattedDevices,
  serviceColumns,
  getFormattedServices,
} from "../components/customers/CustomerDetailsTableConfig";

function CustomerDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Read data from Redux store
  const customers = useSelector((state) => state.customers || []);
  const allDevices = useSelector((state) => state.devices || []);
  const allServices = useSelector((state) => state.serviceRequests || []);

  const customer = customers.find((c) => c.id === id);

  if (!customer) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Customer Not Found"
          description="The requested customer profile could not be located in records."
          action={
            <Button onClick={() => navigate("/customers")}>
              <span className="inline-flex items-center gap-1.5">
                <FiArrowLeft size={16} /> Back to Customers
              </span>
            </Button>
          }
        />
        <Card>
          <div className="p-8 text-center text-slate-500">
            <p>
              No customer found matching identifier: <strong>{id}</strong>
            </p>
          </div>
        </Card>
      </div>
    );
  }

  // Relational Lookup: filter devices and service requests by customerId
  const customerDevices = allDevices.filter((d) => d.customerId === customer.id);
  const customerServices = allServices.filter((s) => s.customerId === customer.id);

  let badgeVariant = "default";
  if (customer.status === "Active") badgeVariant = "success";
  if (customer.status === "Pending") badgeVariant = "warning";
  if (customer.status === "Inactive") badgeVariant = "danger";

  const formattedDevices = getFormattedDevices(customerDevices);
  const formattedServices = getFormattedServices(customerServices);

  return (
    <div className="space-y-6">
      <div>
        <Button variant="outline" onClick={() => navigate("/customers")}>
          <span className="inline-flex items-center gap-1.5">
            <FiArrowLeft size={16} /> Back to Customers
          </span>
        </Button>
      </div>

      <PageHeader
        title={customer.name}
        description={`Customer ID: ${customer.id} • Joined: ${customer.joinedDate || "N/A"}`}
        action={
          <div className="flex flex-wrap items-center gap-2.5">
            <Badge variant={badgeVariant}>{customer.status}</Badge>
            <Button
              variant="outline"
              onClick={() => navigate("/devices", { state: { openAddModal: true } })}
            >
              <span className="inline-flex items-center gap-1.5">
                <FiPlusCircle size={15} /> Add Device
              </span>
            </Button>
            <Button
              onClick={() => navigate("/service-requests", { state: { openCreateModal: true } })}
            >
              <span className="inline-flex items-center gap-1.5">
                <FiTool size={15} /> New Ticket
              </span>
            </Button>
          </div>
        }
      />

      <div className="space-y-6">
        {/* Customer Profile Summary */}
        <Card>
          <div className="p-1">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-5">
              Customer Profile
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <strong className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                  Email Address
                </strong>
                <span className="text-sm text-slate-800 dark:text-slate-200">{customer.email}</span>
              </div>
              <div>
                <strong className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                  Phone Number
                </strong>
                <span className="text-sm text-slate-800 dark:text-slate-200">{customer.phone}</span>
              </div>
              <div>
                <strong className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                  Address
                </strong>
                <span className="text-sm text-slate-800 dark:text-slate-200">{customer.address || "Not provided"}</span>
              </div>
              <div>
                <strong className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                  Customer Type
                </strong>
                <span className="text-sm text-slate-800 dark:text-slate-200">{customer.customerType || "Individual"}</span>
              </div>
              <div>
                <strong className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                  Total Linked Devices
                </strong>
                <span className="text-sm font-semibold text-slate-900 dark:text-white">{customerDevices.length} unit(s)</span>
              </div>
              <div>
                <strong className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                  Total Service Tickets
                </strong>
                <span className="text-sm font-semibold text-slate-900 dark:text-white">{customerServices.length} ticket(s)</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Linked Devices Table (Dynamically filtered by customerId) */}
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3.5">
            Registered Devices ({customerDevices.length})
          </h3>
          <DataTable
            columns={deviceColumns}
            data={formattedDevices}
            minWidth="min-w-[700px]"
            emptyMessage="No devices are currently registered to this customer. Click 'Add Device' to register one."
          />
        </div>

        {/* Linked Service Requests Table (Dynamically filtered by customerId) */}
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-3.5">
            Service & Repair History ({customerServices.length})
          </h3>
          <DataTable
            columns={serviceColumns}
            data={formattedServices}
            minWidth="min-w-[700px]"
            emptyMessage="No previous service requests recorded for this customer."
          />
        </div>
      </div>
    </div>
  );
}

export default CustomerDetails;
