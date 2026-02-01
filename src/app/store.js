import { configureStore } from "@reduxjs/toolkit";
import weatherReducer from "../features/weather/weatherSlice";
import favoritesReducer from "../features/favoritesSlice";
import settingsReducer from "../features/settingsSlice";
import authReducer from "../features/authSlice";

export const store = configureStore({
  reducer: {
    weather: weatherReducer,
    favorites: favoritesReducer,
    settings: settingsReducer,
    auth: authReducer,
  },
});
