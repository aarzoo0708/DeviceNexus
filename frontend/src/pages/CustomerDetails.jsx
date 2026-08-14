import React from "react";
import { useParams, useNavigate } from "react-router";
import PageHeader from "../components/common/PageHeader/PageHeader";
import Button from "../components/common/Button/Button";
import Card from "../components/common/Card/Card";
import Badge from "../components/common/Badge/Badge";
import DataTable from "../components/common/DataTable/DataTable";
import { mockCustomers } from "../data/mockData";

function CustomerDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const customer = mockCustomers.find(c => c.id === id);

  if (!customer) {
    return (
      <div className="page-container">
        <PageHeader
          title="Customer Not Found"
          description="The requested customer could not be found."
          action={
            <Button onClick={() => navigate("/customers")}>
              Back to Customers
            </Button>
          }
        />
        <Card style={{ padding: "20px", textAlign: "center", marginTop: "20px" }}>
          <p>Invalid Customer ID: {id}</p>
        </Card>
      </div>
    );
  }

  let badgeVariant = "default";
  if (customer.status === "Active") badgeVariant = "success";
  if (customer.status === "Pending") badgeVariant = "warning";
  if (customer.status === "Inactive") badgeVariant = "danger";

  const deviceColumns = [
    { key: "name", label: "Device Name" },
    { key: "type", label: "Type" },
    { key: "status", label: "Status" },
    { key: "warranty", label: "Warranty" }
  ];

  const formattedDevices = customer.registeredDevices.map(device => ({
    ...device,
    status: <Badge variant={device.status === "Active" ? "success" : "default"}>{device.status}</Badge>,
    warranty: <Badge variant={device.warranty === "Valid" ? "success" : "warning"}>{device.warranty}</Badge>
  }));

  const serviceColumns = [
    { key: "id", label: "Request ID" },
    { key: "issue", label: "Issue" },
    { key: "device", label: "Device" },
    { key: "priority", label: "Priority" },
    { key: "status", label: "Status" }
  ];

  const formattedServices = customer.serviceHistory.map(req => {
    let reqStatusVariant = "default";
    if (req.status === "Resolved") reqStatusVariant = "success";
    if (req.status === "In Progress") reqStatusVariant = "warning";

    let priorityVariant = "default";
    if (req.priority === "High") priorityVariant = "danger";
    if (req.priority === "Medium") priorityVariant = "warning";

    return {
      ...req,
      status: <Badge variant={reqStatusVariant}>{req.status}</Badge>,
      priority: <Badge variant={priorityVariant}>{req.priority}</Badge>
    };
  });

  return (
    <div className="page-container">
      <div style={{ marginBottom: "20px" }}>
        <Button variant="outline" onClick={() => navigate("/customers")}>
          &larr; Back to Customers
        </Button>
      </div>

      <PageHeader
        title={customer.name}
        description={`Customer ID: ${customer.id}`}
        action={
          <Badge variant={badgeVariant}>{customer.status}</Badge>
        }
      />

      <div style={{ display: "grid", gap: "20px", marginTop: "20px" }}>
        <Card>
          <div style={{ padding: "20px" }}>
            <h3 style={{ marginTop: 0, marginBottom: "15px" }}>Customer Profile</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
              <div>
                <strong style={{ color: "#666", fontSize: "0.85em", display: "block" }}>Email</strong>
                <span>{customer.email}</span>
              </div>
              <div>
                <strong style={{ color: "#666", fontSize: "0.85em", display: "block" }}>Phone</strong>
                <span>{customer.phone}</span>
              </div>
              <div>
                <strong style={{ color: "#666", fontSize: "0.85em", display: "block" }}>Joined Date</strong>
                <span>{customer.joinedDate}</span>
              </div>
              <div>
                <strong style={{ color: "#666", fontSize: "0.85em", display: "block" }}>Total Devices</strong>
                <span>{customer.devices}</span>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div style={{ padding: "20px" }}>
            <h3 style={{ marginTop: 0, marginBottom: "15px" }}>Registered Devices</h3>
            {formattedDevices.length > 0 ? (
              <DataTable columns={deviceColumns} data={formattedDevices} />
            ) : (
              <p style={{ color: "#666", fontStyle: "italic", margin: 0 }}>No devices registered for this customer.</p>
            )}
          </div>
        </Card>

        <Card>
          <div style={{ padding: "20px" }}>
            <h3 style={{ marginTop: 0, marginBottom: "15px" }}>Service History</h3>
            {formattedServices.length > 0 ? (
              <DataTable columns={serviceColumns} data={formattedServices} />
            ) : (
              <p style={{ color: "#666", fontStyle: "italic", margin: 0 }}>No previous service requests.</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

export default CustomerDetails;
