import { createSlice } from "@reduxjs/toolkit";

const createRoleSlice = createSlice({
  name: "role",
  initialState: {
    name: "",
    description: "",
    permissions: {
      menuPermissions: [],
      formPermissions: [],
      reportPermissions: [],
      workflowPermissions: [],
    },
    loading: false,
    error: null,
  },
  reducers: {
    // Action to set role details (name, description)
    setRoleDetails(state, action) {
      const { name, description } = action.payload;
      state.name = name;
      state.description = description;
    },

    // Action to set permissions
    setStatePermissions(state, action) {
      state.permissions = action.payload;
    },

    // Action to set loading state
    setLoading(state, action) {
      state.loading = action.payload;
    },

    // Action to set error state
    setError(state, action) {
      state.error = action.payload;
    },

    // Action to reset the role state
    resetRole(state) {
      state.name = "";
      state.description = "";
      state.permissions = {
        menuPermissions: [],
        formPermissions: [],
        reportPermissions: [],
        workflowPermissions: [],
      };
      state.loading = false;
      state.error = null;
    },
  },
});

// Export actions to be dispatched
export const {
  setRoleDetails,
  setStatePermissions,
  setLoading,
  setError,
  resetRole,
} = createRoleSlice.actions;

// Export the reducer to be added to the store
export default createRoleSlice.reducer;
