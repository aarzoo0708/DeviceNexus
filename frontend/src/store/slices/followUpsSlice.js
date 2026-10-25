import { createSlice } from "@reduxjs/toolkit";
import { initialFollowUps } from "../../data/initialData.js";

function getSavedFollowUps() {
  try {
    const saved = localStorage.getItem("devicenexus_followups");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
      if (parsed && Array.isArray(parsed.items)) return parsed.items;
    }
  } catch (err) {
    console.error("Failed to load follow-ups from storage:", err);
  }
  return initialFollowUps;
}

const followUpsSlice = createSlice({
  name: "followUps",
  initialState: getSavedFollowUps(),
  reducers: {
    addFollowUp: (state, action) => {
      state.unshift(action.payload);
    },
    completeFollowUp: (state, action) => {
      const { id, completionNotes } = action.payload;
      const followUp = state.find((f) => f.id === id);
      if (followUp) {
        const now = new Date();
        followUp.status = "Completed";
        followUp.completedAt = `${now.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })}, ${now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
        followUp.completionNotes =
          completionNotes || "Marked as completed by staff.";
      }
    },
    rescheduleFollowUp: (state, action) => {
      const { id, newDate, newTime, reason } = action.payload;
      const followUp = state.find((f) => f.id === id);
      if (followUp) {
        followUp.dueDate = newDate;
        if (newTime) followUp.dueTime = newTime;
        followUp.status = "Upcoming";
        followUp.completedAt = null;
        if (reason) {
          followUp.notes = followUp.notes
            ? `${followUp.notes}\n[Rescheduled to ${newDate} ${newTime || ""}: ${reason}]`
            : `[Rescheduled to ${newDate} ${newTime || ""}: ${reason}]`;
        }
      }
    },
    deleteFollowUp: (state, action) => {
      return state.filter((f) => f.id !== action.payload);
    },
    resetFollowUps: () => {
      return [...initialFollowUps];
    },
  },
});

export const {
  addFollowUp,
  completeFollowUp,
  rescheduleFollowUp,
  deleteFollowUp,
  resetFollowUps,
} = followUpsSlice.actions;

export default followUpsSlice.reducer;
