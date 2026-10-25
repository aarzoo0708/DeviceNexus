import { createSlice } from "@reduxjs/toolkit";
import { initialServiceRequests } from "../../data/initialData.js";

function getSavedRequests() {
  try {
    const saved = localStorage.getItem("devicenexus_requests");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
      if (parsed && Array.isArray(parsed.items)) return parsed.items;
    }
  } catch (err) {
    console.error("Failed to load requests from storage:", err);
  }
  return initialServiceRequests;
}

const serviceRequestsSlice = createSlice({
  name: "serviceRequests",
  initialState: getSavedRequests(),
  reducers: {
    addServiceRequest: (state, action) => {
      state.unshift(action.payload);
    },
    updateServiceRequestStatus: (state, action) => {
      const { id, status } = action.payload;
      const request = state.find((r) => r.id === id);
      if (request) {
        request.status = status;
        if (!request.timeline) request.timeline = [];
        const now = new Date();
        const dateStr = `${now.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })}, ${now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
        request.timeline.push({
          step: status,
          date: dateStr,
          note: `Status updated to '${status}' by staff member`,
        });
      }
    },
    resetServiceRequests: () => {
      return [...initialServiceRequests];
    },
  },
});

export const { addServiceRequest, updateServiceRequestStatus, resetServiceRequests } =
  serviceRequestsSlice.actions;
export default serviceRequestsSlice.reducer;
