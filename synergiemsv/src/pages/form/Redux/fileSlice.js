import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    fileURL: null,
    fileName: null,
    fileType: null,
    fileSize: null,
    fileBase64: null
}

const fileSlice = createSlice({
  name: "file",
  initialState: initialState,
  reducers: {
    setFile(state, action) {
        const { url, file } = action.payload;
        state.fileURL = url;
        state.fileName = file.name;
        state.fileType = file.type;
        state.fileSize = file.size;
    },
    setFileBase64(state, action) {
        state.fileBase64 = action.payload;
    },
    clearFile(state) {
      state.fileURL = null;
      state.fileName = null;
      state.fileType = null;
      state.fileSize = null;
      state.fileBase64 = null;
    }
  }
});

export const {
  setFile,
  setFileBase64,
  clearFile
} = fileSlice.actions;

export default fileSlice.reducer;