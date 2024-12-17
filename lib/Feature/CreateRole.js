import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const createRole = createAsyncThunk(
  "roles/create",
  async (
    {
      name,
      description,
      menuPermissions,
      formPermissions,
      reportPermissions,
      workflowPermissions,
      allotedUsers,
      allotedGroups,
      createdBy,
    },
    { dispatch }
  ) => {
    // Dispatch setLoading(true) before API request
    dispatch(setLoading(true));

    try {
      const response = await fetch("/api/roles/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          description,
          menuPermissions,
          formPermissions,
          reportPermissions,
          workflowPermissions,
          allotedUsers,
          allotedGroups,
          createdBy,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // Optionally, handle the success response and reset the state or store role data
        dispatch(setLoading(false)); // Set loading to false after success
        return data; // You can return the data here if you need to update state
      } else {
        // Handle the error response
        const errorData = await response.json();
        dispatch(setError(errorData.error || "Something went wrong"));
        dispatch(setLoading(false));
        throw new Error(errorData.error || "Something went wrong");
      }
    } catch (error) {
      dispatch(setError(error.message)); // Dispatch error if the request fails
      dispatch(setLoading(false)); // Set loading to false after error
      console.log("Error creating role =>", error.message);
      throw error; // Throw error for async thunk to handle it
    }
  }
);

export const fetchAllRoles = createAsyncThunk(
  "/roles/get/all",
  async (_, { rejectWithValue }) => {
    try {
      // Making an API call to fetch roles
      const response = await fetch("/api/roles/get/all");

      // Check if the response status is OK (200-299)
      if (!response.ok) {
        throw new Error("Failed to fetch roles");
      }

      // Parse the JSON response
      const data = await response.json();
      // console.log("Roles =>", data.roles);

      // Return the roles data
      return data.roles;
    } catch (error) {
      // Return the error message in case of failure
      return rejectWithValue(error.message || "Something went wrong");
    }
  }
);

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
    roles: [],
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
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createRole.pending, (state) => {
        state.loading = true;
        state.error = null; // Reset previous errors
      })
      .addCase(createRole.fulfilled, (state, action) => {
        state.loading = false;
        // Optionally reset role after successful creation
        state.name = "";
        state.description = "";
        state.selectedUsersForRole = [];
        state.selectedGroupsForRole = [];
        state.permissions = {
          menuPermissions: [],
          formPermissions: [],
          reportPermissions: [],
          workflowPermissions: [],
        };
        localStorage.removeItem("permissions");
      })
      .addCase(createRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to create role";
      })
      .addCase(fetchAllRoles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllRoles.fulfilled, (state, action) => {
        state.loading = false;
        state.roles = action.payload;
      })
      .addCase(fetchAllRoles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch roles";
      });
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
  resetSelectedUsersAndGroups,
} = createRoleSlice.actions;

// Export the reducer to be added to the store
export default createRoleSlice.reducer;
