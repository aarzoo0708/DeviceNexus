import React, { useState } from "react";
import { useNavigate } from "react-router";
import PageHeader from "../components/common/PageHeader/PageHeader";
import Button from "../components/common/Button/Button";
import Card from "../components/common/Card/Card";
import { mockCustomers } from "../data/mockData";
import "./Customers.css";

function AddCustomer() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    customerType: "Individual",
    status: "Active"
  });
  
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear the error for a field once the user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Full Name is required.";
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone is required.";
    } else if (!/^\d{7,15}$/.test(formData.phone.replace(/[\s-()]/g, ""))) {
      newErrors.phone = "Please enter a valid phone number.";
    }
    
    if (!formData.address.trim()) newErrors.address = "Address is required.";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      // Step 9: Submit behavior 
      // Step 11: Add newly created customer to frontend list
      const newId = `CUST-${String(mockCustomers.length + 1).padStart(3, '0')}`;
      const newCustomer = {
        id: newId,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        devices: 0,
        status: formData.status,
        joinedDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        registeredDevices: [], // Step 14: empty states
        serviceHistory: [] // Step 14: empty states
      };
      
      mockCustomers.push(newCustomer);
      
      // Step 13: Navigate back on success
      navigate("/customers");
    }
  };

  return (
    <div className="page-container">
      <div style={{ marginBottom: "20px" }}>
        {/* Step 12: Cancel behavior mapping back to customers */}
        <Button variant="outline" onClick={() => navigate("/customers")}>
          &larr; Back to Customers
        </Button>
      </div>

      <PageHeader
        title="Add Customer"
        description="Create a new customer profile."
      />

      <Card>
        <div className="customer-card-content">
          <form onSubmit={handleSubmit} style={{ display: "grid", gap: "20px" }}>
            
            <div style={{ display: "grid", gap: "5px" }}>
              <label htmlFor="name" style={{ fontWeight: 500 }}>Full Name</label>
              <input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                style={{ padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }}
              />
              {errors.name && <span style={{ color: "red", fontSize: "0.85em" }}>{errors.name}</span>}
            </div>

            <div style={{ display: "grid", gap: "5px" }}>
              <label htmlFor="email" style={{ fontWeight: 500 }}>Email</label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                style={{ padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }}
              />
              {errors.email && <span style={{ color: "red", fontSize: "0.85em" }}>{errors.email}</span>}
            </div>

            <div style={{ display: "grid", gap: "5px" }}>
              <label htmlFor="phone" style={{ fontWeight: 500 }}>Phone</label>
              <input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                style={{ padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }}
              />
              {errors.phone && <span style={{ color: "red", fontSize: "0.85em" }}>{errors.phone}</span>}
            </div>

            <div style={{ display: "grid", gap: "5px" }}>
              <label htmlFor="address" style={{ fontWeight: 500 }}>Address</label>
              <input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                style={{ padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }}
              />
              {errors.address && <span style={{ color: "red", fontSize: "0.85em" }}>{errors.address}</span>}
            </div>

            <div className="customer-grid-2">
              <div style={{ display: "grid", gap: "5px" }}>
                <label htmlFor="customerType" style={{ fontWeight: 500 }}>Customer Type</label>
                <select
                  id="customerType"
                  name="customerType"
                  value={formData.customerType}
                  onChange={handleChange}
                  style={{ padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }}
                >
                  <option value="Individual">Individual</option>
                  <option value="Business">Business</option>
                </select>
              </div>

              <div style={{ display: "grid", gap: "5px" }}>
                <label htmlFor="status" style={{ fontWeight: 500 }}>Status</label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  style={{ padding: "8px", border: "1px solid #ccc", borderRadius: "4px" }}
                >
                  <option value="Active">Active</option>
                  <option value="Pending">Pending</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", marginTop: "10px" }}>
              <Button type="button" variant="outline" onClick={() => navigate("/customers")}>Cancel</Button>
              <Button type="submit">Add Customer</Button>
            </div>

          </form>
        </div>
      </Card>
    </div>
  );
}

export default AddCustomer;
