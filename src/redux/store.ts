import { configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import AsyncStorage from '@react-native-async-storage/async-storage';
import logger from "redux-logger";
import authSlice from "../redux/reducers/auth/authSlice";

const persistConfig = {
  key: "authentication",
  storage: AsyncStorage,
  version: 1,
};
const persistedReducer = persistReducer(persistConfig, authSlice);
const combinedReducer = {
  user: persistedReducer,
};
const middlewares: any[] = [];
if (process.env.NODE_ENV === "development") {
  middlewares.push(logger);
}
export const store = configureStore({
  reducer: combinedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false,
    }).concat(middlewares),
  devTools: true,
});
export const persistor = persistStore(store);
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;