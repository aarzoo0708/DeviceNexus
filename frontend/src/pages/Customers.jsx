import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import PageHeader from "../components/common/PageHeader/PageHeader";
import Button from "../components/common/Button/Button";
import SearchInput from "../components/common/SearchInput/SearchInput";
import DataTable from "../components/common/DataTable/DataTable";
import Badge from "../components/common/Badge/Badge";
import { getCustomers, onDataChange } from "../data/mockData";
import { columns, getCustomerTableData } from "../components/customers/CustomerTableConfig";
function Customers() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [customers, setCustomers] = useState(() => getCustomers());

  useEffect(() => {
    const updateCustomers = () => setCustomers(getCustomers());
    const unsubscribe = onDataChange(updateCustomers);
    return unsubscribe;
  }, []);

  const filteredCustomers = customers.filter((customer) => {
    const query = searchQuery.toLowerCase();
    return (
      customer.name.toLowerCase().includes(query) ||
      customer.email.toLowerCase().includes(query) ||
      customer.phone.includes(query) ||
      customer.id.toLowerCase().includes(query)
    );
  });


  const tableData = getCustomerTableData(filteredCustomers, navigate);

  return (
    <div className="page-container">
      <PageHeader
        title="Customers"
        description="Manage customer relationships and registered devices."
        action={
          <Button onClick={() => navigate("/customers/add")}>
            Add Customer
          </Button>
        }
      />

      <div style={{ marginBottom: "20px" }}>
        <SearchInput
          placeholder="Search customers..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <DataTable columns={columns} data={tableData} />

    </div>
  );
}

export default Customers;