import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    pageNum: 0,
}



const pageSlice = createSlice({
    name: "page",
    initialState: initialState,
    reducers: {
        setPage(state,action) {
            state.pageNum = action.payload
        },
        addPage(state){
            state.pageNum += 1

        },
        removePage(state){
            state.pageNum -= 1
        }
}})

export const {
    setPage,
    addPage,
    removePage
    

} = pageSlice.actions

export default pageSlice.reducer