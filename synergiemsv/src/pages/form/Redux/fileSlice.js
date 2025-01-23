import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    fileURL: null 
}

const fileSlice = createSlice({
  name: "file",
  initialState: initialState,
  reducers: {
    setFile(state, action) {
        state.fileURL = action.payload
        
    },
    clearFile(state) {
      state.fileURL = null;
      
    }
  }
});

export const {
  setFile,
  clearFile
} = fileSlice.actions;

export default fileSlice.reducer;