// // slices/groupSlice.js
// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// export const fetchGroups = createAsyncThunk('group/fetchGroups', async () => {
//   const response = await fetch("/api/Groups/getGroups");
//   if (!response.ok) throw new Error('Failed to fetch groups');
//   return response.json();
// });

// export const createGroup = createAsyncThunk('group/createGroup', async (group) => {
//   const response = await fetch("/api/Groups/createGroup", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(group),
//   });
//   if (!response.ok) throw new Error('Failed to create group');
//   return response.json();
// });

// export const deleteGroups = createAsyncThunk('group/deleteGroups', async (groupIds) => {
//   const response = await fetch("/api/Groups/deleteGroups", {
//     method: "DELETE",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify({ ids: groupIds }),
//   });
//   if (!response.ok) throw new Error('Failed to delete groups');
//   return groupIds;
// });

// export const storeDeletedGroups = createAsyncThunk('group/storeDeletedGroups', async (deletedGroups) => {
//   const response = await fetch("/api/Groups/storeDeletedGroups", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(deletedGroups),
//   });
//   if (!response.ok) throw new Error('Failed to store deleted groups');
//   return deletedGroups;
// });



// const groupSlice = createSlice({
//   name: 'group',
//   initialState: {
//     groups: [],
//     status: 'idle',
//     error: null,
//   },
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchGroups.pending, (state) => {
//         state.status = 'loading';
//       })
//       .addCase(fetchGroups.fulfilled, (state, action) => {
//         state.status = 'succeeded';
//         state.groups = action.payload;
//       })
//       .addCase(fetchGroups.rejected, (state, action) => {
//         state.status = 'failed';
//         state.error = action.error.message;
//       })
//       .addCase(createGroup.fulfilled, (state, action) => {
//         state.groups.push(action.payload);
//       })
//       .addCase(deleteGroups.fulfilled, (state, action) => {
//         state.groups = state.groups.filter(group => !action.payload.includes(group.id));
//       })
//       .addCase(deleteGroups.rejected, (state, action) => {
//         state.status = 'failed';
//         state.error = action.error.message;
//       })
//       .addCase(storeDeletedGroups.pending, (state) => {
//         state.status = 'loading';
//       })
//       .addCase(storeDeletedGroups.fulfilled, (state, action) => {
//         state.status = 'succeeded';
//         state.deletedGroups = [...state.deletedGroups, ...action.payload];
//       })
//       .addCase(storeDeletedGroups.rejected, (state, action) => {
//         state.status = 'failed';
//         state.error = action.error.message;
//       })
//   },
// });

// export default groupSlice.reducer;



// slices/groupSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchGroups = createAsyncThunk('group/fetchGroups', async () => {
  const response = await fetch("/api/Groups/getGroups");
  if (!response.ok) throw new Error('Failed to fetch groups');
  return response.json();
});

export const createGroup = createAsyncThunk('group/createGroup', async (group) => {
  const response = await fetch("/api/Groups/createGroup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(group),
  });
  if (!response.ok) throw new Error('Failed to create group');
  return response.json();
});

export const deleteGroups = createAsyncThunk('group/deleteGroups', async (groupIds) => {
  const response = await fetch("/api/Groups/deleteGroups", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ids: groupIds }),
  });
  if (!response.ok) throw new Error('Failed to delete groups');
  return groupIds;
});

export const storeDeletedGroups = createAsyncThunk('group/storeDeletedGroups', async (deletedGroups) => {
  const response = await fetch("/api/Groups/storeDeletedGroups", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(deletedGroups),
  });
  if (!response.ok) throw new Error('Failed to store deleted groups');
  return deletedGroups;
});


export const fetchDeletedGroups = createAsyncThunk('group/fetchDeletedGroups', async () => {
  const response = await fetch("/api/Groups/getDeletedGroups");
  if (!response.ok) throw new Error('Failed to fetch deleted groups');
  return response.json();
});

const groupSlice = createSlice({
  name: 'group',
  initialState: {
    groups: [],
    status: 'idle',
    error: null,
    deletedGroups: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchGroups.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchGroups.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.groups = action.payload;
      })
      .addCase(fetchGroups.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(createGroup.fulfilled, (state, action) => {
        state.groups.push(action.payload);
      })
      .addCase(deleteGroups.fulfilled, (state, action) => {
        state.groups = state.groups.filter(group => !action.payload.includes(group.id));
      })
      .addCase(deleteGroups.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(storeDeletedGroups.fulfilled, (state, action) => {
        state.deletedGroups = [...state.deletedGroups, ...action.payload];
      })
      .addCase(fetchDeletedGroups.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchDeletedGroups.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.deletedGroups = action.payload;
      })
      .addCase(fetchDeletedGroups.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default groupSlice.reducer;

