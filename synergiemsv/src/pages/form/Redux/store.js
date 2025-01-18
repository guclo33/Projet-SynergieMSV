import { configureStore } from "@reduxjs/toolkit"
import { persistStore, persistReducer } from 'redux-persist';
import { combineReducers } from "@reduxjs/toolkit";
//import cookieStorage from 'redux-persist-cookie-storage';
import cookies from 'js-cookie';
import formReducer from "./formSlice"
import pageReducer from "./pageSlice"

const cookieStorage = {
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
};

const persistConfig = {
  key: 'root', 
  storage: cookieStorage, 
  whitelist: ['form', 'page'], 
};

const rootReducer = combineReducers({
  form: formReducer,
  page: pageReducer, 
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
});


const persistor = persistStore(store)

export {store, persistor }