import React, { useState } from "react";
import PageHeader from "../components/common/PageHeader/PageHeader";
import Button from "../components/common/Button/Button";
import SearchInput from "../components/common/SearchInput/SearchInput";
import DataTable from "../components/common/DataTable/DataTable";
import Badge from "../components/common/Badge/Badge";

const mockCustomers = [
  {
    id: "CUST-001",
    name: "Rahul Sharma",
    email: "rahul@example.com",
    phone: "9876543210",
    devices: 3,
    status: "Active",
    joinedDate: "12 Aug 2026"
  },
  {
    id: "CUST-002",
    name: "Priya Kapoor",
    email: "priya@example.com",
    phone: "9812345678",
    devices: 2,
    status: "Active",
    joinedDate: "10 Aug 2026"
  },
  {
    id: "CUST-003",
    name: "Amit Patel",
    email: "amit@example.com",
    phone: "9823456789",
    devices: 1,
    status: "Pending",
    joinedDate: "14 Aug 2026"
  },
  {
    id: "CUST-004",
    name: "Sneha Desai",
    email: "sneha@example.com",
    phone: "9834567890",
    devices: 4,
    status: "Active",
    joinedDate: "05 Aug 2026"
  },
  {
    id: "CUST-005",
    name: "Vikram Singh",
    email: "vikram@example.com",
    phone: "9845678901",
    devices: 0,
    status: "Inactive",
    joinedDate: "01 Aug 2026"
  }
];

function Customers() {
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
        <span style={{ color: "#0066cc", cursor: "pointer", fontWeight: 500 }}>
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