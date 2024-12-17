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
    selectedUsersForRole: [],
    selectedGroupsForRole: [],
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
    // Action to set selected users for the role
    setSelectedUsersForRole: (state, action) => {
      state.selectedUsersForRole = action.payload;
    },
    // Action to set selected groups for the role
    setSelectedGroupsForRole: (state, action) => {
      state.selectedGroupsForRole = action.payload;
    },
    resetSelectedUsersAndGroups: (state, action) => {
      state.selectedUsersForRole = [];
      state.selectedGroupsForRole = []; 
    }
  },
});

// Export actions to be dispatched
export const {
  setRoleDetails,
  setStatePermissions,
  setLoading,
  setError,
  resetRole,
  setSelectedUsersForRole,
  setSelectedGroupsForRole,
  resetSelectedUsersAndGroups
} = createRoleSlice.actions;

// Export the reducer to be added to the store
export default createRoleSlice.reducer;
