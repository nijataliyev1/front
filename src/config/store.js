import { configureStore } from "@reduxjs/toolkit";
import generalReducer from '../generalSlice';  //butun reducerleri import edirik

export const store = configureStore({
    reducer: {
        general: generalReducer, //butun reducerleri burda qeyd edirik adi ile birlikde
    },
})