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
            if(action.payload >= 0 && action.payload <= 26 ){
            state.pageNum = action.payload
            }
        },
        addPage(state){
            if(state.pageNum <=26){
            state.pageNum += 1
            }

            if(state.pageNum >= state.totalPage && state.totalPage <= 26){
                state.totalPage = state.pageNum
            }

        },
        removePage(state){
            if(state.pageNum >=0){
            state.pageNum -= 1
            }
        }
}})

export const {
    setPage,
    addPage,
    removePage
    

} = pageSlice.actions

export default pageSlice.reducer