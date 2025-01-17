import { configureStore } from "@reduxjs/toolkit"
import formSlice from "./formSlice"
import pageSlice from "./pageSlice"



const store = configureStore({
    reducer: {
        form: formSlice,
        page: pageSlice
    }
    
  })

export default store