import { createSlice } from "@reduxjs/toolkit";
import { initialCustomers } from "../../data/initialData.js";

// Helper to load persisted data from localStorage if available
function getSavedCustomers() {
  try {
    const saved = localStorage.getItem("devicenexus_customers");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
      if (parsed && Array.isArray(parsed.items)) return parsed.items;
    }
  } catch (err) {
    console.error("Failed to load customers from storage:", err);
  }
  return initialCustomers;
}

const customersSlice = createSlice({
  name: "customers",
  initialState: getSavedCustomers(),
  reducers: {
    addCustomer: (state, action) => {
      // action.payload is the new customer object
      state.unshift(action.payload);
    },
    updateCustomer: (state, action) => {
      const index = state.findIndex((c) => c.id === action.payload.id);
      if (index !== -1) {
        state[index] = { ...state[index], ...action.payload };
      }
    },
    resetCustomers: () => {
      return [...initialCustomers];
    },
  },
});

export const { addCustomer, updateCustomer, resetCustomers } = customersSlice.actions;
export default customersSlice.reducer;
