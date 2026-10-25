import { createSlice } from "@reduxjs/toolkit";
import { initialInteractions } from "../../data/initialData.js";

function getSavedInteractions() {
  try {
    const saved = localStorage.getItem("devicenexus_interactions");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
      if (parsed && Array.isArray(parsed.items)) return parsed.items;
    }
  } catch (err) {
    console.error("Failed to load interactions from storage:", err);
  }
  return initialInteractions;
}

const interactionsSlice = createSlice({
  name: "interactions",
  initialState: getSavedInteractions(),
  reducers: {
    addInteraction: (state, action) => {
      state.unshift(action.payload);
    },
    resetInteractions: () => {
      return [...initialInteractions];
    },
  },
});

export const { addInteraction, resetInteractions } = interactionsSlice.actions;
export default interactionsSlice.reducer;
