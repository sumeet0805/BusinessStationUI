import {createSlice} from "@reduxjs/toolkit";

const loaderSlice=createSlice({
    name:'loader',
    initialState:{
        loader:false,
    },
    reducers:{
        ShowLoader:(state)=>{
            state.loader=true;
        },
        HideLoader:(state)=>{
            state.loader=false;
        },
    },
});

export const {ShowLoader,HideLoader}=loaderSlice.actions;
const loaderReducer= loaderSlice.reducer;
export default loaderReducer;
