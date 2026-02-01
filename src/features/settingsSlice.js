import { createSlice } from "@reduxjs/toolkit";
import { syncSettingsToFirestore } from "../firebase/firestore";

const loadSettingsFromStorage = () => {
  try {
    const storedSettings = localStorage.getItem("weatherSettings");
    return storedSettings
      ? JSON.parse(storedSettings)
      : {
          temperatureUnit: "C",
          theme: "dark",
          autoRefresh: true,
          refreshInterval: 60,
        };
  } catch (error) {
    return {
      temperatureUnit: "C",
      theme: "dark",
      autoRefresh: true,
      refreshInterval: 60,
    };
  }
};

const saveSettingsToStorage = (settings) => {
  try {
    localStorage.setItem("weatherSettings", JSON.stringify(settings));
  } catch (error) {
    console.error("Failed to save settings to localStorage:", error);
  }
};

const syncToFirebase = async (settings, getState) => {
  try {
    const state = getState();
    if (state.auth?.user?.uid) {
      await syncSettingsToFirestore(state.auth.user.uid, settings);
    }
  } catch (error) {
    console.error("Failed to sync settings to Firebase:", error);
  }
};

const settingsSlice = createSlice({
  name: "settings",
  initialState: loadSettingsFromStorage(),
  reducers: {
    setTemperatureUnit: (state, action) => {
      state.temperatureUnit = action.payload;
      saveSettingsToStorage(state);
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
      saveSettingsToStorage(state);
    },
    setAutoRefresh: (state, action) => {
      state.autoRefresh = action.payload;
      saveSettingsToStorage(state);
    },
    setRefreshInterval: (state, action) => {
      state.refreshInterval = action.payload;
      saveSettingsToStorage(state);
    },
    updateSettings: (state, action) => {
      Object.assign(state, action.payload);
      saveSettingsToStorage(state);
    },
    loadSettingsFromCloud: (state, action) => {
      if (action.payload) {
        Object.assign(state, action.payload);
        saveSettingsToStorage(state);
      }
    },
  },
});

export const {
  setTemperatureUnit,
  setTheme,
  setAutoRefresh,
  setRefreshInterval,
  updateSettings,
  loadSettingsFromCloud,
} = settingsSlice.actions;

export const setTemperatureUnitAndSync =
  (unit) => async (dispatch, getState) => {
    dispatch(setTemperatureUnit(unit));
    await syncToFirebase(getState().settings, getState);
  };

export const setThemeAndSync = (theme) => async (dispatch, getState) => {
  dispatch(setTheme(theme));
  await syncToFirebase(getState().settings, getState);
};

export const setAutoRefreshAndSync =
  (autoRefresh) => async (dispatch, getState) => {
    dispatch(setAutoRefresh(autoRefresh));
    await syncToFirebase(getState().settings, getState);
  };

export const setRefreshIntervalAndSync =
  (interval) => async (dispatch, getState) => {
    dispatch(setRefreshInterval(interval));
    await syncToFirebase(getState().settings, getState);
  };

export const updateSettingsAndSync =
  (settings) => async (dispatch, getState) => {
    dispatch(updateSettings(settings));
    await syncToFirebase(getState().settings, getState);
  };

export default settingsSlice.reducer;
