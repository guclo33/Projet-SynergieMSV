
import { createSlice } from "@reduxjs/toolkit";

const initialState = {}



const formSlice = createSlice({
    name: "form",
    initialState: initialState,
    reducers: {
        addKeyValue(state,action) {
            const {key, value} = action.payload;
            state[key] = value
        }
       
    
}})

export const {
    addKeyValue,
    

} = formSlice.actions

export default formSlice.reducer