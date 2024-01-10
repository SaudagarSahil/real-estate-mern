import {configureStore} from '@reduxjs/toolkit';
import signinReducer from './user/slice.js';

export const store = configureStore({
    reducer: {
        signin : signinReducer,
    }
})