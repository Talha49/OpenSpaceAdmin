import { createSlice } from "@reduxjs/toolkit";

const lockSidebarSlice = createSlice({
  name: "lockSidebar",
  initialState: {
    locked: false,
  },
  reducers: {
    toggleLockSidebar: (state) => {
      state.locked = !state.locked;
    },
  },
});

export const { toggleLockSidebar } = lockSidebarSlice.actions;
export default lockSidebarSlice.reducer;
