import { configureStore } from "@reduxjs/toolkit";
import userReducer  from '../Feature/UserSlice'
import groupReducer from '../Feature/GroupSlice'
const store = configureStore({
    reducer:{
        user: userReducer,
        group: groupReducer
    }
})


export default store