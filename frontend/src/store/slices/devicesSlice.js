import { createSlice } from "@reduxjs/toolkit";
import { initialDevices } from "../../data/initialData.js";

function getSavedDevices() {
  try {
    const saved = localStorage.getItem("devicenexus_devices");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
      if (parsed && Array.isArray(parsed.items)) return parsed.items;
    }
  } catch (err) {
    console.error("Failed to load devices from storage:", err);
  }
  return initialDevices;
}

const devicesSlice = createSlice({
  name: "devices",
  initialState: getSavedDevices(),
  reducers: {
    addDevice: (state, action) => {
      state.unshift(action.payload);
    },
    updateDevice: (state, action) => {
      const index = state.findIndex((d) => d.id === action.payload.id);
      if (index !== -1) {
        state[index] = { ...state[index], ...action.payload };
      }
    },
    deleteDevice: (state, action) => {
      // action.payload is the device id
      return state.filter((d) => d.id !== action.payload);
    },
    retireDevice: (state, action) => {
      // action.payload is the device id
      const device = state.find((d) => d.id === action.payload);
      if (device) {
        device.status = "Retired";
      }
    },
    resetDevices: () => {
      return [...initialDevices];
    },
  },
});

export const { addDevice, updateDevice, deleteDevice, retireDevice, resetDevices } =
  devicesSlice.actions;
export default devicesSlice.reducer;
