import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../Redux/Userslice";
export default configureStore({
    reducer:{
        user:userReducer,
    },
})