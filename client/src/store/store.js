import {configureStore} from '@reduxjs/toolkit';
import signinReducer from './user/slice.js';

export const store = configureStore({
    reducer: {
        user : signinReducer,
    }
})