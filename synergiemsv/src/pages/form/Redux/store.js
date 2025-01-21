import { configureStore } from "@reduxjs/toolkit"
import { persistStore, persistReducer } from 'redux-persist';
import { combineReducers } from "@reduxjs/toolkit";
import sessionStorage from "redux-persist/lib/storage/session";
import storage from "redux-persist/lib/storage";
import cookies from 'js-cookie';
import formReducer from "./formSlice"
import pageReducer from "./pageSlice"
import fileReducer from "./fileSlice"

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

const filePersistConfig = {
  key: "file", 
  storage: storage,
};

const persistConfig = {
  key: 'root', 
  storage: sessionStorage, 
  whitelist: ['form', 'page'], 
};

const sessionPersistedReducer = persistReducer(persistConfig, combineReducers({
  form: formReducer,
  page: pageReducer,
}));


const filePersistedReducer = persistReducer(filePersistConfig, fileReducer)

const rootReducer = combineReducers({
  session : sessionPersistedReducer,
  file: filePersistedReducer
});


const store = configureStore({
  reducer: rootReducer
});

const persistor = persistStore(store)

export {store, persistor }