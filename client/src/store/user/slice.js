import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentUser : null,
    error : null,
    loading : false,
}

export const signinSlice = createSlice({
    name: 'user',
    initialState,
    reducers : {
        signinStart : (state) => {
            state.loading = true;
        },
        signinSuccess : (state, action) => {
            state.currentUser = action.payload;
            state.error = null;
            state.loading = false;
        },
        signinFail : (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
        updateStart : (state) => {
            state.loading = true;
        },
        updateSuccess : (state, action) => {
            state.currentUser = action.payload;
            state.error = null;
            state.loading = false;
        },
        updateFail : (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
        deleteStart : (state) => {
            state.loading = true;
        },
        deleteSuccess : (state) => {
            state.currentUser = null;
            state.error = null;
            state.loading = false;
        },
        deleteFail : (state, action) => {
            state.error = action.payload;
            state.loading = false;
        },
    }
});

export const {signinStart, signinSuccess, signinFail, updateStart, updateSuccess, updateFail, deleteStart, deleteSuccess, deleteFail} = signinSlice.actions;

export default signinSlice.reducer;
