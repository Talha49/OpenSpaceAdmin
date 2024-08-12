import { configureStore } from "@reduxjs/toolkit";
import userReducer  from '../Feature/UserSlice'

const store = configureStore({
    reducer:{
        user: userReducer 
    }
})


export default store