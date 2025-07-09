import { configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import AsyncStorage from '@react-native-async-storage/async-storage';
import logger from "redux-logger";
import authSlice from "../redux/reducers/auth/authSlice";
import foodSlice from "../redux/reducers/foods/foodSlice";
import { foodApi } from '../redux/reducers/foods/foodApi';
const persistConfig = {
  key: "authentication",
  storage: AsyncStorage,
  version: 1,
  whitelist: ['registeredEmail', 'user', 'token', 'isOtpSent', 'isOtpVerified']
};
const persistedReducer = persistReducer(persistConfig, authSlice);
const combinedReducer = {
  user: persistedReducer,
  foods: foodSlice,
  [foodApi.reducerPath]: foodApi.reducer,
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
    }).concat(middlewares).concat(foodApi.middleware),
  devTools: true,
});
export const persistor = persistStore(store);
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;