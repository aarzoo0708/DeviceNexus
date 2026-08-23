import React from "react";
import Button from "../common/Button/Button";

function CustomerForm({ formData, errors, onChange, onSubmit, onCancel }) {
  return (
    <form onSubmit={onSubmit} style={{ display: "grid", gap: "20px" }}>
      <div style={{ display: "grid", gap: "5px" }}>
        <label htmlFor="name" style={{ fontWeight: 500 }}>
          Full Name
        </label>
        <input
          id="name"
          name="name"
          value={formData.name}
          onChange={onChange}
          style={{ padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }}
        />
        {errors.name && (
          <span style={{ color: "red", fontSize: "0.85em" }}>{errors.name}</span>
        )}
      </div>

      <div style={{ display: "grid", gap: "5px" }}>
        <label htmlFor="email" style={{ fontWeight: 500 }}>
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={onChange}
          style={{ padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }}
        />
        {errors.email && (
          <span style={{ color: "red", fontSize: "0.85em" }}>{errors.email}</span>
        )}
      </div>

      <div style={{ display: "grid", gap: "5px" }}>
        <label htmlFor="phone" style={{ fontWeight: 500 }}>
          Phone
        </label>
        <input
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={onChange}
          style={{ padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }}
        />
        {errors.phone && (
          <span style={{ color: "red", fontSize: "0.85em" }}>{errors.phone}</span>
        )}
      </div>

      <div style={{ display: "grid", gap: "5px" }}>
        <label htmlFor="address" style={{ fontWeight: 500 }}>
          Address
        </label>
        <input
          id="address"
          name="address"
          value={formData.address}
          onChange={onChange}
          style={{ padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }}
        />
        {errors.address && (
          <span style={{ color: "red", fontSize: "0.85em" }}>
            {errors.address}
          </span>
        )}
      </div>

      <div className="customer-grid-2">
        <div style={{ display: "grid", gap: "5px" }}>
          <label htmlFor="customerType" style={{ fontWeight: 500 }}>
            Customer Type
          </label>
          <select
            id="customerType"
            name="customerType"
            value={formData.customerType}
            onChange={onChange}
            style={{ padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }}
          >
            <option value="Individual">Individual</option>
            <option value="Business">Business</option>
          </select>
        </div>

        <div style={{ display: "grid", gap: "5px" }}>
          <label htmlFor="status" style={{ fontWeight: 500 }}>
            Status
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={onChange}
            style={{ padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }}
          >
            <option value="Active">Active</option>
            <option value="Pending">Pending</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          gap: "10px",
          justifyContent: "flex-end",
          marginTop: "10px",
        }}
      >
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Add Customer</Button>
      </div>
    </form>
  );
}

export default CustomerForm;
