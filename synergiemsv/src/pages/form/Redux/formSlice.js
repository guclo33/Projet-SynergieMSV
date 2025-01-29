
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    info: {},
    form: {}
}



const formSlice = createSlice({
    name: "form",
    initialState: initialState,
    reducers: {
        addValueForm(state,action) {
            const {key, value} = action.payload;
            state.form[key] = value
        },
        addValueInfo(state,action) {
            const {key, value} = action.payload;
            state.info[key] = value
        },
       
    
}})

export const {
    addValueForm,
    addValueInfo
    

} = formSlice.actions

export default formSlice.reducer