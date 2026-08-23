import React, { useState } from "react";
import { useNavigate } from "react-router";
import PageHeader from "../components/common/PageHeader/PageHeader";
import Button from "../components/common/Button/Button";
import Card from "../components/common/Card/Card";
import CustomerForm from "../components/customers/CustomerForm";
import { getCustomers, addCustomer } from "../data/mockData";
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
      const currentCustomers = getCustomers();
      const newId = `CUST-${String(currentCustomers.length + 1).padStart(3, '0')}`;
      const newCustomer = {
        id: newId,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        devices: 0,
        status: formData.status,
        joinedDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        registeredDevices: [],
        serviceHistory: []
      };

      addCustomer(newCustomer);
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
          <CustomerForm
            formData={formData}
            errors={errors}
            onChange={handleChange}
            onSubmit={handleSubmit}
            onCancel={() => navigate("/customers")}
          />
        </div>
      </Card>
    </div>
  );
}

export default AddCustomer;
