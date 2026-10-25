import { validateName, validateEmail, validatePhone, validateText } from "../utils/validation";
import { useState } from "react";
import {
  FiEdit2,
  FiCheck,
  FiX,
  FiUser,
  FiBriefcase,
} from "react-icons/fi";
import PageHeader from "../components/common/PageHeader/PageHeader";
import Button from "../components/common/Button/Button";
import Card from "../components/common/Card/Card";
import { useAuth } from "../contexts/AuthContext";

function Profile() {
  const { user, login } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  const [extraProfile, setExtraProfile] = useState({
    phone: "9876543210",
    department: "Customer Service & Field Engineering",
  });

  const profileData = {
    name: user?.name || "Alex Morgan",
    email: user?.email || "alex.morgan@devicenexus.com",
    role: user?.role || "Service Lead",
    phone: extraProfile.phone,
    department: extraProfile.department,
  };

  const [editData, setEditData] = useState(profileData);
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
    const nameError = validateName(editData.name);
    const emailError = validateEmail(editData.email);
    const phoneError = validatePhone(editData.phone);
    const departmentError = validateText(editData.department, "Department", 2, 100);

    if (nameError) newErrors.name = nameError;
    if (emailError) newErrors.email = emailError;
    if (phoneError) newErrors.phone = phoneError;
    if (departmentError) newErrors.department = departmentError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (validate()) {
      setExtraProfile({
        phone: editData.phone,
        department: editData.department,
      });
      login({
        name: editData.name,
        role: editData.role,
        email: editData.email,
      });
      setIsEditing(false);
      setSuccessMsg("Profile updated and synced with Demo User session.");
      setTimeout(() => setSuccessMsg(""), 3500);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="User Profile"
        description="View and update your active operator account and personal details."
        action={
          !isEditing ? (
            <Button onClick={handleEdit}>
              <FiEdit2 className="inline mr-1" /> Edit Profile
            </Button>
          ) : null
        }
      />

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center gap-3 text-sm font-medium">
          <FiCheck className="text-emerald-500 text-lg shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <div className="space-y-6">
        {/* Header Card */}
        <Card>
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white font-bold text-2xl flex items-center justify-center shrink-0 shadow-md">
              {profileData.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">{profileData.name}</h2>
              <p className="text-sm text-blue-600 dark:text-blue-400 font-semibold mt-1">{profileData.role}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{profileData.email}</p>
            </div>
          </div>
        </Card>

        {/* Details Form / View */}
        <form onSubmit={handleSave}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <h3 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2 mb-5 pb-3 border-b border-slate-100 dark:border-[#334155]">
                <FiUser className="text-blue-500" /> Personal Information
              </h3>

              <div className="flex flex-col gap-1.5 mb-5">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Full Name</label>
                {isEditing ? (
                  <div>
                    <input
                      type="text"
                      name="name"
                      value={editData.name}
                      onChange={handleChange}
                      className={`w-full px-4 py-2.5 bg-white dark:bg-[#111827] border ${
                        errors.name ? "border-rose-500" : "border-slate-300 dark:border-[#334155]"
                      } rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 transition-colors`}
                    />
                    {errors.name && <span className="text-xs text-rose-500 mt-1 block">{errors.name}</span>}
                  </div>
                ) : (
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-200 py-1">{profileData.name}</p>
                )}
              </div>

              <div className="flex flex-col gap-1.5 mb-5">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Email Address</label>
                {isEditing ? (
                  <div>
                    <input
                      type="email"
                      name="email"
                      value={editData.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-2.5 bg-white dark:bg-[#111827] border ${
                        errors.email ? "border-rose-500" : "border-slate-300 dark:border-[#334155]"
                      } rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 transition-colors`}
                    />
                    {errors.email && <span className="text-xs text-rose-500 mt-1 block">{errors.email}</span>}
                  </div>
                ) : (
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-200 py-1">{profileData.email}</p>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Direct Phone</label>
                {isEditing ? (
                  <div>
                    <input
                      type="tel"
                      name="phone"
                      value={editData.phone}
                      onChange={handleChange}
                      className={`w-full px-4 py-2.5 bg-white dark:bg-[#111827] border ${
                        errors.phone ? "border-rose-500" : "border-slate-300 dark:border-[#334155]"
                      } rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 transition-colors`}
                    />
                    {errors.phone && <span className="text-xs text-rose-500 mt-1 block">{errors.phone}</span>}
                  </div>
                ) : (
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-200 py-1">{profileData.phone}</p>
                )}
              </div>
            </Card>

            <Card>
              <h3 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2 mb-5 pb-3 border-b border-slate-100 dark:border-[#334155]">
                <FiBriefcase className="text-indigo-400" /> Professional Information
              </h3>

              <div className="flex flex-col gap-1.5 mb-5">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Role / Designation</label>
                {isEditing ? (
                  <select
                    name="role"
                    className="w-full px-4 py-2.5 bg-white dark:bg-[#111827] border border-slate-300 dark:border-[#334155] rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 transition-colors cursor-pointer"
                    value={editData.role}
                    onChange={handleChange}
                  >
                    <option value="Service Lead">Service Lead</option>
                    <option value="Senior Technician">Senior Technician</option>
                    <option value="Support Executive">Support Executive</option>
                    <option value="Service Manager">Service Manager</option>
                  </select>
                ) : (
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-200 py-1">{profileData.role}</p>
                )}
              </div>

              <div className="flex flex-col gap-1.5 mb-5">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Department</label>
                {isEditing ? (
                  <div>
                    <input
                      type="text"
                      name="department"
                      value={editData.department}
                      onChange={handleChange}
                      className={`w-full px-4 py-2.5 bg-white dark:bg-[#111827] border ${
                        errors.department ? "border-rose-500" : "border-slate-300 dark:border-[#334155]"
                      } rounded-xl text-sm text-slate-900 dark:text-white focus:outline-none focus:border-blue-500 transition-colors`}
                    />
                    {errors.department && <span className="text-xs text-rose-500 mt-1 block">{errors.department}</span>}
                  </div>
                ) : (
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-200 py-1">{profileData.department}</p>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Access Level</label>
                <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 py-1">Full Operator & Demo Administrator</p>
              </div>
            </Card>
          </div>

          {isEditing && (
            <div className="flex gap-3 justify-end mt-7">
              <Button variant="secondary" type="button" onClick={handleCancel}>
                <FiX className="inline mr-1" /> Cancel
              </Button>
              <Button variant="primary" type="submit">
                <FiCheck className="inline mr-1" /> Save Changes
              </Button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default Profile;
