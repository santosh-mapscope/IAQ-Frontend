import { createSlice } from "@reduxjs/toolkit";
export const userSlice=createSlice({
    name:"user",
    initialState:{
        user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')):null,
    },
    reducers:{
        login:(state,action)=>{
            const user=localStorage.setItem('user',action.payload);
            state.user=JSON.parse(localStorage.getItem('user'));
        },
        logout:(state)=>{
         state.user=null; 
         localStorage.clear(); 
         sessionStorage.clear(); 
        }
    }
     
     
});
export const {login,logout} =userSlice.actions;
export const selectUser =(state)=>state.user.user;

export default userSlice.reducer;