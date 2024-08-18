// userSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";

// Async thunks
export const fetchUsers = createAsyncThunk("user/fetchUsers", async () => {
  const response = await fetch("/api/Users/getUser");
  if (!response.ok) throw new Error("Failed to fetch users");
  return response.json();
});

export const fetchDeletedUsers = createAsyncThunk(
  "user/fetchDeletedUsers",
  async () => {
    const response = await fetch("/api/Users/getDeletedUser");
    if (!response.ok) throw new Error("Failed to fetch deleted users");
    return response.json();
  }
);
export const deleteUserAsync = createAsyncThunk(
  "user/deleteUser",
  async (userId) => {
    const response = await fetch("/api/Users/deleteUser", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: userId }),
    });
    if (!response.ok) throw new Error("Failed to delete user");
    return userId;
  }
);

export const storeDeletedUser = createAsyncThunk(
  "user/storeDeletedUser",
  async (user) => {
    const response = await fetch("/api/Users/storeDeletedUser", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ users: [user] }),
    });
    if (!response.ok) throw new Error("Failed to store deleted user");
    return user;
  }
);

const initialState = {
  users: [],
  selectedGroupUsers: [],
  selectedUser: null,
  status: "idle",
  error: null,
  searchTerm: "",
  sortOrder: null,
  filterCriteria: {},
  currentPage: 1,
  itemsPerPage: 5,
  deletedUsersCurrentPage: 1,
  deletedUsersItemsPerPage: 10,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    addUser: (state, action) => {
      const userWithId = { ...action.payload, id: uuidv4() };
      state.users.push(userWithId);
    },
    updateUser: (state, action) => {
      const index = state.users.findIndex(
        (user) => user.id === action.payload.id
      );
      if (index !== -1) {
        state.users[index] = { ...state.users[index], ...action.payload };
      }
    },
    setSelectedGroupUsers: (state, action) => {
      state.selectedGroupUsers = action.payload;
    },
    setSelectedUseruniquely: (state, action) => {
      state.selectedUser = action.payload;
    },
    clearSelectedUser: (state) => {
      state.selectedUser = null;
    },
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
      state.currentPage = 1;
    },
    setSortOrder: (state, action) => {
      state.sortOrder = action.payload;
    },
    setFilterCriteria: (state, action) => {
      state.filterCriteria = action.payload;
      state.currentPage = 1;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setDeletedUsersCurrentPage: (state, action) => {
      state.deletedUsersCurrentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(deleteUserAsync.fulfilled, (state, action) => {
        state.users = state.users.filter((user) => user.id !== action.payload);
      })
      .addCase(fetchDeletedUsers.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchDeletedUsers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.deletedUsers = action.payload;
      })
      .addCase(fetchDeletedUsers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const {
  addUser,
  updateUser,
  setSelectedUseruniquely,
  clearSelectedUser,
  setSearchTerm,
  setSortOrder,
  setFilterCriteria,
  setCurrentPage,
  setDeletedUsersCurrentPage,
  setSelectedGroupUsers
} = userSlice.actions;

// Selectors
export const selectAllUsers = (state) => state.user.users;
export const selectAllDeletedUsers = (state) => state.user.deletedUsers;

export const selectPaginatedDeletedUsers = (state) => {
  const { deletedUsers, deletedUsersCurrentPage, deletedUsersItemsPerPage } =
    state.user;
  const startIndex = (deletedUsersCurrentPage - 1) * deletedUsersItemsPerPage;
  return deletedUsers?.slice(startIndex, startIndex + deletedUsersItemsPerPage);
};
export const selectDeletedUsersTotalPages = (state) => {
  return Math.ceil(
    state.user.deletedUsers?.length / state.user.deletedUsersItemsPerPage
  );
};
export const selectFilteredUsers = (state) => {
  const { users, searchTerm, filterCriteria, sortOrder } = state.user;

  let filteredUsers = users.filter(
    (user) =>
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (!filterCriteria.address || user.address === filterCriteria.address) &&
      (!filterCriteria.city || user.city === filterCriteria.city) &&
      (!filterCriteria.contact || user.contact === filterCriteria.contact) &&
      (!filterCriteria.email || user.email === filterCriteria.email)
  );

  if (sortOrder !== null) {
    filteredUsers.sort((a, b) => {
      const firstLetterA = a.fullName.charAt(0).toUpperCase();
      const firstLetterB = b.fullName.charAt(0).toUpperCase();
      return sortOrder
        ? firstLetterA.localeCompare(firstLetterB)
        : firstLetterB.localeCompare(firstLetterA);
    });
  }

  return filteredUsers;
};
export const selectPaginatedUsers = (state) => {
  const filteredUsers = selectFilteredUsers(state);
  const { currentPage, itemsPerPage } = state.user;
  const startIndex = (currentPage - 1) * itemsPerPage;
  return filteredUsers.slice(startIndex, startIndex + itemsPerPage);
};
export const selectTotalPages = (state) => {
  const filteredUsers = selectFilteredUsers(state);
  return Math.ceil(filteredUsers.length / state.user.itemsPerPage);
};

export default userSlice.reducer;
