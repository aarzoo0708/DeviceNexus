import { configureStore } from "@reduxjs/toolkit";
import customersReducer, { resetCustomers } from "./slices/customersSlice.js";
import devicesReducer, { resetDevices } from "./slices/devicesSlice.js";
import serviceRequestsReducer, { resetServiceRequests } from "./slices/serviceRequestsSlice.js";
import warrantiesReducer, { resetWarranties } from "./slices/warrantiesSlice.js";
import interactionsReducer, { resetInteractions } from "./slices/interactionsSlice.js";
import followUpsReducer, { resetFollowUps } from "./slices/followUpsSlice.js";

export const store = configureStore({
  reducer: {
    customers: customersReducer,
    devices: devicesReducer,
    serviceRequests: serviceRequestsReducer,
    warranties: warrantiesReducer,
    interactions: interactionsReducer,
    followUps: followUpsReducer,
  },
});

// Auto-save slices to localStorage whenever Redux store updates
store.subscribe(() => {
  try {
    const state = store.getState();
    localStorage.setItem("devicenexus_customers", JSON.stringify(state.customers));
    localStorage.setItem("devicenexus_devices", JSON.stringify(state.devices));
    localStorage.setItem("devicenexus_requests", JSON.stringify(state.serviceRequests));
    localStorage.setItem("devicenexus_warranties", JSON.stringify(state.warranties));
    localStorage.setItem("devicenexus_interactions", JSON.stringify(state.interactions));
    localStorage.setItem("devicenexus_followups", JSON.stringify(state.followUps));
  } catch (err) {
    console.error("Failed to save state to localStorage:", err);
  }
});

// Helper function to reset all data back to original demo seed
export function resetAllDemoData(dispatch) {
  try {
    localStorage.removeItem("devicenexus_customers");
    localStorage.removeItem("devicenexus_devices");
    localStorage.removeItem("devicenexus_requests");
    localStorage.removeItem("devicenexus_warranties");
    localStorage.removeItem("devicenexus_interactions");
    localStorage.removeItem("devicenexus_followups");
  } catch (err) {
    console.error("Failed to clear localStorage:", err);
  }

  dispatch(resetCustomers());
  dispatch(resetDevices());
  dispatch(resetServiceRequests());
  dispatch(resetWarranties());
  dispatch(resetInteractions());
  dispatch(resetFollowUps());
}

export default store;
