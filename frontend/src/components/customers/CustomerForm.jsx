import Button from "../common/Button/Button";

function CustomerForm({ formData, errors, onChange, onSubmit, onCancel }) {
  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div>
        <label htmlFor="name" className="field-label">
          Full Name *
        </label>
        <input
          id="name"
          name="name"
          maxLength={100}
          value={formData.name}
          onChange={onChange}
          className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-[#334155] bg-white dark:bg-[#111827] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
        />
        {errors.name && (
          <span className="text-xs text-rose-500 mt-1.5 block">{errors.name}</span>
        )}
      </div>

      <div>
        <label htmlFor="email" className="field-label">
          Email Address *
        </label>
        <input
          id="email"
          name="email"
          maxLength={254}
          type="email"
          value={formData.email}
          onChange={onChange}
          className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-[#334155] bg-white dark:bg-[#111827] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
        />
        {errors.email && (
          <span className="text-xs text-rose-500 mt-1.5 block">{errors.email}</span>
        )}
      </div>

      <div>
        <label htmlFor="phone" className="field-label">
          Phone Number *
        </label>
        <input
          id="phone"
          type="tel"
          name="phone"
          maxLength={30}
          value={formData.phone}
          onChange={onChange}
          className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-[#334155] bg-white dark:bg-[#111827] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
        />
        {errors.phone && (
          <span className="text-xs text-rose-500 mt-1.5 block">{errors.phone}</span>
        )}
      </div>

      <div>
        <label htmlFor="address" className="field-label">
          Address *
        </label>
        <input
          id="address"
          name="address"
          maxLength={250}
          value={formData.address}
          onChange={onChange}
          className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-[#334155] bg-white dark:bg-[#111827] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
        />
        {errors.address && (
          <span className="text-xs text-rose-500 mt-1.5 block">{errors.address}</span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="customerType" className="field-label">
            Customer Type
          </label>
          <select
            id="customerType"
            name="customerType"
            value={formData.customerType}
            onChange={onChange}
            className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-[#334155] bg-white dark:bg-[#111827] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors cursor-pointer"
          >
            <option value="Individual">Individual</option>
            <option value="Business">Business</option>
          </select>
        </div>

        <div>
          <label htmlFor="status" className="field-label">
            Status
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={onChange}
            className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-[#334155] bg-white dark:bg-[#111827] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors cursor-pointer"
          >
            <option value="Active">Active</option>
            <option value="Pending">Pending</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-[#334155]">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Add Customer</Button>
      </div>
    </form>
  );
}

export default CustomerForm;
