import { createSlice } from "@reduxjs/toolkit";
import { syncFavoritesToFirestore } from "../firebase/firestore";

const loadFavoritesFromStorage = () => {
  try {
    const storedFavorites = localStorage.getItem("weatherFavorites");
    return storedFavorites ? JSON.parse(storedFavorites) : ["mumbai"];
  } catch (error) {
    return ["mumbai"];
  }
};

const saveFavoritesToStorage = (favorites) => {
  try {
    localStorage.setItem("weatherFavorites", JSON.stringify(favorites));
  } catch (error) {
    console.error("Failed to save favorites to localStorage:", error);
  }
};

const syncToFirebase = async (favorites, getState) => {
  try {
    const state = getState();
    if (state.auth?.user?.uid) {
      await syncFavoritesToFirestore(state.auth.user.uid, favorites);
    }
  } catch (error) {
    console.error("Failed to sync favorites to Firebase:", error);
  }
};

const favoritesSlice = createSlice({
  name: "favorites",
  initialState: {
    cities: loadFavoritesFromStorage(),
  },
  reducers: {
    addFavorite: (state, action) => {
      const city = action.payload;
      if (!state.cities.includes(city)) {
        state.cities.push(city);
        saveFavoritesToStorage(state.cities);
      }
    },
    removeFavorite: (state, action) => {
      const city = action.payload;
      state.cities = state.cities.filter((c) => c !== city);
      saveFavoritesToStorage(state.cities);
    },
    reorderFavorites: (state, action) => {
      state.cities = action.payload;
      saveFavoritesToStorage(state.cities);
    },
    loadFavoritesFromCloud: (state, action) => {
      if (action.payload && Array.isArray(action.payload)) {
        state.cities = action.payload;
        saveFavoritesToStorage(state.cities);
      }
    },
  },
});

export const {
  addFavorite,
  removeFavorite,
  reorderFavorites,
  loadFavoritesFromCloud,
} = favoritesSlice.actions;

export const addFavoriteAndSync = (city) => async (dispatch, getState) => {
  dispatch(addFavorite(city));
  await syncToFirebase(getState().favorites.cities, getState);
};

export const removeFavoriteAndSync = (city) => async (dispatch, getState) => {
  dispatch(removeFavorite(city));
  await syncToFirebase(getState().favorites.cities, getState);
};

export const reorderFavoritesAndSync =
  (cities) => async (dispatch, getState) => {
    dispatch(reorderFavorites(cities));
    await syncToFirebase(getState().favorites.cities, getState);
  };

export default favoritesSlice.reducer;
