import { validateName, validateEmail, validatePhone, validateText } from "../utils/validation";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { FiArrowLeft } from "react-icons/fi";
import PageHeader from "../components/common/PageHeader/PageHeader";
import Button from "../components/common/Button/Button";
import Card from "../components/common/Card/Card";
import CustomerForm from "../components/customers/CustomerForm";
import { addCustomer } from "../store/slices/customersSlice";

function AddCustomer() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const customers = useSelector((state) => state.customers || []);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    customerType: "Individual",
    status: "Active",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error as user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};

    const nameError = formData.customerType === "Business"
      ? validateText(formData.name, "Business name", 2, 100)
      : validateName(formData.name);
    const emailError = validateEmail(formData.email);
    const phoneError = validatePhone(formData.phone);
    const addressError = validateText(formData.address, "Address", 5, 250);

    if (nameError) newErrors.name = nameError;
    if (emailError) newErrors.email = emailError;
    if (phoneError) newErrors.phone = phoneError;
    if (addressError) newErrors.address = addressError;

    const emailExists = customers.some(
      (customer) => customer.email.toLowerCase() === formData.email.trim().toLowerCase()
    );
    if (!emailError && emailExists) {
      newErrors.email = "A customer with this email already exists.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validate()) {
      const nextNumber = customers.length + 1;
      const newId = `CUST-${String(nextNumber).padStart(3, "0")}`;

      const newCustomer = {
        id: newId,
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim(),
        customerType: formData.customerType,
        status: formData.status,
        joinedDate: new Date().toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
      };

      dispatch(addCustomer(newCustomer));
      navigate("/customers");
    }
  };

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
        title="Add Customer"
        description="Create a new customer profile to track their devices and service history."
      />

      <Card>
        <div className="p-1">
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
