import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../Feature/UserSlice";
import groupReducer from "../Feature/GroupSlice";
import themeReducer from "../Feature/ThemeSlice";
import createReducer from "../Feature/RoleSlice";
import lockReducer from "../Feature/LockSidebarSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    group: groupReducer,
    theme: themeReducer,
    role: createReducer,
    lock: lockReducer,
  },
});

export default store;
