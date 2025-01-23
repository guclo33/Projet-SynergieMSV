import { configureStore } from "@reduxjs/toolkit"
import { persistStore, persistReducer } from 'redux-persist';
import { combineReducers } from "@reduxjs/toolkit";
import adminReducer from "./adminSlice"
import sessionStorage from "redux-persist/lib/storage/session";
import storage from "redux-persist/lib/storage";
import cookies from 'js-cookie';


/*const cookieStorage = {
  getItem: (key) => {
    return new Promise((resolve) => {
      resolve(cookies.get(key));  
    });
  },
  setItem: (key, value) => {
    return new Promise((resolve) => {
      cookies.set(key, value, { expires: 365 });  
      resolve();  
    });
  },
  removeItem: (key) => {
    return new Promise((resolve) => {
      cookies.remove(key); 
      resolve();
    });
  },
};*/



const persistConfig = {
  key: 'root', 
  storage: sessionStorage, 
  whitelist: ["NewGroup", "clientsData", "LeadersData", "photosProfile", "groupesData" ], 
};




const persistedReducer = persistReducer(persistConfig, adminReducer)




const adminStore = configureStore({
  reducer: {
    admin: persistedReducer,
  }
});

const adminPersistor = persistStore(adminStore)

export {adminStore, adminPersistor }