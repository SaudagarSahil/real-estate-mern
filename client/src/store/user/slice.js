import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    username : null,
    error : null,
    loading : false,
}

export const signinSlice = createSlice({
    name: 'signin',
    initialState,
    reducers : {
        signinStart : (state) => {
            state.loading = true;
        },
        signinSuccess : (state, action) => {
            state.username = action.payload;
            state.error = null;
            state.loading = false;
        },
        signinFail : (state, action) => {
            state.error = action.payload;
            state.loading = false;
        }
    }
});

export const {signinStart, signinSuccess, signinFail} = signinSlice.actions;

export default signinSlice.reducer;
