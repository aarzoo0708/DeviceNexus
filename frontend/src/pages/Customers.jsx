import React, { useState } from "react";
import { useNavigate } from "react-router";
import PageHeader from "../components/common/PageHeader/PageHeader";
import Button from "../components/common/Button/Button";
import SearchInput from "../components/common/SearchInput/SearchInput";
import DataTable from "../components/common/DataTable/DataTable";
import Badge from "../components/common/Badge/Badge";
import { mockCustomers } from "../data/mockData";

function Customers() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCustomers = mockCustomers.filter((customer) => {
    const query = searchQuery.toLowerCase();
    return (
      customer.name.toLowerCase().includes(query) ||
      customer.email.toLowerCase().includes(query) ||
      customer.phone.includes(query) ||
      customer.id.toLowerCase().includes(query)
    );
  });

  const columns = [
    { key: "customer", label: "Customer" },
    { key: "contact", label: "Contact" },
    { key: "devices", label: "Devices" },
    { key: "status", label: "Status" },
    { key: "joined", label: "Joined" },
    { key: "actions", label: "Actions" }
  ];

  const tableData = filteredCustomers.map((customer) => {
    let badgeVariant = "default";
    if (customer.status === "Active") badgeVariant = "success";
    if (customer.status === "Pending") badgeVariant = "warning";
    if (customer.status === "Inactive") badgeVariant = "danger";

    return {
      id: customer.id,
      customer: (
        <div>
          <div style={{ fontWeight: 500 }}>{customer.name}</div>
          <div style={{ fontSize: "0.85em", color: "#666" }}>{customer.id}</div>
        </div>
      ),
      contact: (
        <div>
          <div>{customer.email}</div>
          <div style={{ fontSize: "0.85em", color: "#666" }}>{customer.phone}</div>
        </div>
      ),
      devices: customer.devices,
      status: (
        <Badge variant={badgeVariant}>
          {customer.status}
        </Badge>
      ),
      joined: customer.joinedDate,
      actions: (
        <span 
          style={{ color: "#0066cc", cursor: "pointer", fontWeight: 500 }}
          onClick={() => navigate(`/customers/${customer.id}`)}
        >
          View
        </span>
      )
    };
  });

  return (
    <div className="page-container">
      <PageHeader
        title="Customers"
        description="Manage customer relationships and registered devices."
        action={
          <Button>
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