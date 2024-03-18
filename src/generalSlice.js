import { createSlice } from "@reduxjs/toolkit";

const initialState = {  //baslangic deyerler ucun obyekt yaradiriq
    user: null,
    requsetedUser: null
}

const generalSlice = createSlice({
    name: "general", //ad verirrik
    initialState,
    reducers: { //reducerleri burda yaradiriq
        login: (state, action) => {state.user = action.payload;},
        logout: (state) => {state.user = null},
        requestUser: (state,action) => {Boolean(action.payload) ? state.requsetedUser = {...action.payload,verCode: Math.floor(Math.random() * (9000)) + 1000} : state.requsetedUser = null}
    }
})

export const { login,logout,requestUser } = generalSlice.actions; //burda butun reducerleri export edirik

export default generalSlice.reducer;