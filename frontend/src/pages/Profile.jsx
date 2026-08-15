import { useState } from "react";
import PageHeader from "../components/common/PageHeader/PageHeader";
import Button from "../components/common/Button/Button";
import Card from "../components/common/Card/Card";
import "./Profile.css";

const initialProfile = {
  name: "Admin User",
  email: "admin@devicenexus.com",
  phone: "9876543210",
  role: "Service Manager",
  department: "Customer Service"
};

function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState(initialProfile);
  const [editData, setEditData] = useState(initialProfile);
  const [errors, setErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState("");

  const handleEdit = () => {
    setEditData(profileData);
    setErrors({});
    setSuccessMsg("");
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setErrors({});
  };

  const validate = () => {
    const newErrors = {};
    if (!editData.name.trim()) newErrors.name = "Full Name is required.";
    
    if (!editData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editData.email)) {
      newErrors.email = "Invalid email format.";
    }

    if (!editData.phone.trim()) {
      newErrors.phone = "Phone is required.";
    } else if (!/^\d+$/.test(editData.phone)) {
      newErrors.phone = "Phone must contain only digits.";
    }

    if (!editData.department.trim()) newErrors.department = "Department is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validate()) {
      setProfileData(editData);
      setIsEditing(false);
      setSuccessMsg("Profile updated successfully.");
      setTimeout(() => setSuccessMsg(""), 3000);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData({ ...editData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  return (
    <div className="profile-page">
      <PageHeader 
        title="Profile" 
        description="Manage your account information and preferences."
        action={
          !isEditing ? (
            <Button onClick={handleEdit}>Edit Profile</Button>
          ) : null
        }
      />

      {successMsg && <div className="profile-success-msg">{successMsg}</div>}

      <div className="profile-content">
        <Card>
          <div className="profile-header-info">
            <div className="profile-avatar-large">
              {profileData.name.charAt(0)}
            </div>
            <div className="profile-header-details">
              <h2>{profileData.name}</h2>
              <p className="profile-role">{profileData.role}</p>
              <p className="profile-email-sub">{profileData.email}</p>
            </div>
          </div>
        </Card>

        <div className="profile-details-grid">
          <Card>
            <h3>Personal Information</h3>
            <div className="profile-field-group">
              <label>Full Name</label>
              {isEditing ? (
                <div>
                  <input 
                    type="text" 
                    name="name" 
                    value={editData.name} 
                    onChange={handleChange} 
                    className={errors.name ? "input-error" : ""}
                  />
                  {errors.name && <span className="error-text">{errors.name}</span>}
                </div>
              ) : (
                <p>{profileData.name}</p>
              )}
            </div>

            <div className="profile-field-group">
              <label>Email</label>
              {isEditing ? (
                <div>
                  <input 
                    type="email" 
                    name="email" 
                    value={editData.email} 
                    onChange={handleChange} 
                    className={errors.email ? "input-error" : ""}
                  />
                  {errors.email && <span className="error-text">{errors.email}</span>}
                </div>
              ) : (
                <p>{profileData.email}</p>
              )}
            </div>

            <div className="profile-field-group">
              <label>Phone</label>
              {isEditing ? (
                <div>
                  <input 
                    type="tel" 
                    name="phone" 
                    value={editData.phone} 
                    onChange={handleChange} 
                    className={errors.phone ? "input-error" : ""}
                  />
                  {errors.phone && <span className="error-text">{errors.phone}</span>}
                </div>
              ) : (
                <p>{profileData.phone}</p>
              )}
            </div>
          </Card>

          <Card>
            <h3>Professional Information</h3>
            <div className="profile-field-group">
              <label>Role</label>
              <p className="read-only-text">{profileData.role}</p>
            </div>

            <div className="profile-field-group">
              <label>Department</label>
              {isEditing ? (
                <div>
                  <input 
                    type="text" 
                    name="department" 
                    value={editData.department} 
                    onChange={handleChange} 
                    className={errors.department ? "input-error" : ""}
                  />
                  {errors.department && <span className="error-text">{errors.department}</span>}
                </div>
              ) : (
                <p>{profileData.department}</p>
              )}
            </div>
          </Card>
        </div>

        {isEditing && (
          <div className="profile-actions">
            {/* The existing Button component might not have a variant="outline" built in, 
                so we can just use secondary or standard styling if needed. We'll add standard classes if possible. */}
            <Button className="btn-secondary" onClick={handleCancel}>Cancel</Button>
            <Button onClick={handleSave}>Save Changes</Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;
