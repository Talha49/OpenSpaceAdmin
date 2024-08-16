import { configureStore } from "@reduxjs/toolkit";
import userReducer  from '../Feature/UserSlice'
import groupReducer from '../Feature/GroupSlice'
import themeReducer from '../Feature/ThemeSlice';
const store = configureStore({
    reducer:{
        user: userReducer,
        group: groupReducer,
        theme:themeReducer
    }
})


export default store