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
  const response = await fetch("/api/deleteGroups", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ids: groupIds }),
  });
  if (!response.ok) throw new Error('Failed to delete groups');
  return groupIds;
});

const groupSlice = createSlice({
  name: 'group',
  initialState: {
    groups: [],
    status: 'idle',
    error: null,
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
      });
  },
});

export default groupSlice.reducer;