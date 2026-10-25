import { useState } from "react";
import { FiX, FiUserCheck } from "react-icons/fi";
import { useAuth } from "../../../contexts/AuthContext";

const PRESET_USERS = [
  { name: "Alex Morgan", role: "Service Manager", email: "alex.morgan@devicenexus.io" },
  { name: "Sameer Verma", role: "Senior Technician", email: "sameer.verma@devicenexus.io" },
  { name: "Aman Gupta", role: "Display Specialist", email: "aman.gupta@devicenexus.io" },
  { name: "Priya Nair", role: "Support Executive", email: "priya.nair@devicenexus.io" },
];

function LoginModal({ isOpen, onClose }) {
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    role: "Service Manager",
    email: "",
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectPreset = (preset) => {
    login(preset);
    onClose();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    login({
      name: formData.name.trim() || "Admin User",
      role: formData.role,
      email: formData.email.trim() || "user@devicenexus.io",
    });
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="modal-backdrop"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md max-h-[90dvh] overflow-y-auto bg-white dark:bg-[#1e293b] rounded-2xl shadow-2xl border border-slate-200 dark:border-[#334155] overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 text-center border-b border-slate-100 dark:border-[#334155] flex flex-col items-center relative">
          <div className="w-11 h-11 rounded-xl bg-blue-600 text-white font-bold text-lg flex items-center justify-center shadow-md mb-2">
            D
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Switch Demo User
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs">
            Select a pre-configured team persona or enter your custom name for demonstration.
          </p>

          <button
            type="button"
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-lg transition-colors cursor-pointer"
            onClick={onClose}
            aria-label="Close"
          >
            <FiX size={18} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Preset Personas */}
          <div>
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-2.5">
              Quick Select Preset Persona:
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {PRESET_USERS.map((preset) => (
                <button
                  type="button"
                  key={preset.name}
                  onClick={() => handleSelectPreset(preset)}
                  className="p-3 rounded-xl border border-slate-200 dark:border-[#334155] bg-slate-50 hover:bg-slate-100 dark:bg-[#111827] dark:hover:bg-slate-800 text-left transition-colors cursor-pointer"
                >
                  <div className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                    {preset.name}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {preset.role}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-[#334155]">
            <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 mb-3">
              Or Enter Custom User Details:
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1.5">
                  Your Name *
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="e.g. Rahul Sharma"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="form-control"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1.5">
                  Staff Role
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="form-control cursor-pointer"
                >
                  <option value="Service Manager">Service Manager</option>
                  <option value="Senior Technician">Senior Technician</option>
                  <option value="Support Executive">Support Executive</option>
                  <option value="Front Desk Admin">Front Desk Admin</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300 block mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="e.g. rahul@devicenexus.io"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
              >
                <FiUserCheck size={16} /> Switch User Persona
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginModal;
