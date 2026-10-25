import { createSlice } from "@reduxjs/toolkit";
import { initialWarranties } from "../../data/initialData.js";

function getSavedWarranties() {
  try {
    const saved = localStorage.getItem("devicenexus_warranties");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
      if (parsed && Array.isArray(parsed.items)) return parsed.items;
    }
  } catch (err) {
    console.error("Failed to load warranties from storage:", err);
  }
  return initialWarranties;
}

const warrantiesSlice = createSlice({
  name: "warranties",
  initialState: getSavedWarranties(),
  reducers: {
    addWarranty: (state, action) => {
      state.unshift(action.payload);
    },
    extendWarranty: (state, action) => {
      // payload can be an ID or { id, additionalYears }
      const id = typeof action.payload === "object" ? action.payload.id : action.payload;
      const additionalYears = action.payload?.additionalYears || 1;

      const warranty = state.find((w) => w.id === id);
      if (warranty) {
        const currentExpiry = new Date(warranty.expiryDate);
        currentExpiry.setFullYear(currentExpiry.getFullYear() + additionalYears);
        const newExpiryStr = currentExpiry.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });
        warranty.expiryDate = newExpiryStr;
        warranty.status = "Active";
        warranty.daysRemaining = (warranty.daysRemaining || 0) + additionalYears * 365;
      }
    },
    resetWarranties: () => {
      return [...initialWarranties];
    },
  },
});

export const { addWarranty, extendWarranty, resetWarranties } = warrantiesSlice.actions;
export default warrantiesSlice.reducer;
