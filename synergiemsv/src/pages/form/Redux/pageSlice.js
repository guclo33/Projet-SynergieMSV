import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    pageNum: 0,
    totalPage : 0
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

            if(state.pageNum >= state.totalPage){
                state.totalPage = state.pageNum
            }

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