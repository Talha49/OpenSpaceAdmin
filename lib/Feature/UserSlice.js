// import { createSlice } from '@reduxjs/toolkit';
// import { v4 as uuidv4 } from 'uuid';

// const initialState = {
//   users: []
// };

// const userSlice = createSlice({
//   name: 'user',
//   initialState,
//   reducers: {
//     addUser: (state, action) => {
//       const userWithId = { ...action.payload, id: uuidv4() };
//       state.users.push(userWithId);
//     },
//     deleteUser: (state, action) => {
//       state.users = state.users.filter(user => user.id !== action.payload);
//     },
//     updateUser: (state, action) => {
//         const index = state.users.findIndex(user => user.id === action.payload.id);
//         if (index !== -1) {
//           state.users[index] = { ...state.users[index], ...action.payload };
//         }
//       }
//   }
// });

// export const { addUser, deleteUser,updateUser } = userSlice.actions;

// export default userSlice.reducer;
import { createSlice } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

const initialState = {
  users: [],
  selectedUser: null, // Add selectedUser to the initial state
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    addUser: (state, action) => {
      const userWithId = { ...action.payload, id: uuidv4() };
      state.users.push(userWithId);
    },
    deleteUser: (state, action) => {
      state.users = state.users.filter(user => user.id !== action.payload);
    },
    updateUser: (state, action) => {
      const index = state.users.findIndex(user => user.id === action.payload.id);
      if (index !== -1) {
        state.users[index] = { ...state.users[index], ...action.payload };
      }
    },
    setSelectedUseruniquely: (state, action) => {
      state.selectedUser = action.payload;
    },
    clearSelectedUser: (state) => {
      state.selectedUser = null;
    },
  }
});

export const { addUser, deleteUser, updateUser, setSelectedUseruniquely, clearSelectedUser } = userSlice.actions;

export default userSlice.reducer;
