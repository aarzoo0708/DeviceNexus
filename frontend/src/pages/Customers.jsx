import { useState } from "react";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { FiUserPlus } from "react-icons/fi";
import PageHeader from "../components/common/PageHeader/PageHeader";
import Button from "../components/common/Button/Button";
import SearchInput from "../components/common/SearchInput/SearchInput";
import DataTable from "../components/common/DataTable/DataTable";
import { columns, getCustomerTableData } from "../components/customers/CustomerTableConfig";

function Customers() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  // Read customers and devices directly from Redux
  const customers = useSelector((state) => state.customers || []);
  const devices = useSelector((state) => state.devices || []);

  const filteredCustomers = customers.filter((customer) => {
    const query = searchQuery.toLowerCase().trim();
    return (
      !query ||
      customer.name.toLowerCase().includes(query) ||
      customer.email.toLowerCase().includes(query) ||
      customer.phone.includes(query) ||
      customer.id.toLowerCase().includes(query)
    );
  });

  const tableData = getCustomerTableData(filteredCustomers, navigate, devices);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Customers"
        description="Manage customer profiles, contact info, and registered hardware units."
        action={
          <Button onClick={() => navigate("/customers/add")}>
            <span className="inline-flex items-center gap-1.5">
              <FiUserPlus size={16} /> Add Customer
            </span>
          </Button>
        }
      />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-1">
        <div className="w-full max-w-md">
          <SearchInput
            placeholder="Search by customer name, email, phone, or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={tableData}
        minWidth="min-w-[850px]"
        emptyMessage="No customers found matching your search query."
      />
    </div>
  );
}

export default Customers;
