import { createSlice } from '@reduxjs/toolkit';

const loadSettingsFromStorage = () => {
  try {
    const storedSettings = localStorage.getItem('weatherSettings');
    return storedSettings ? JSON.parse(storedSettings) : {
      temperatureUnit: 'C',
      theme: 'light',
      autoRefresh: true,
      refreshInterval: 60
    };
  } catch (error) {
    return {
      temperatureUnit: 'C',
      theme: 'light',
      autoRefresh: true,
      refreshInterval: 60
    };
  }
};

const saveSettingsToStorage = (settings) => {
  try {
    localStorage.setItem('weatherSettings', JSON.stringify(settings));
  } catch (error) {
    console.error('Failed to save settings to localStorage:', error);
  }
};

const settingsSlice = createSlice({
  name: 'settings',
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
    }
  }
});

export const { 
  setTemperatureUnit, 
  setTheme, 
  setAutoRefresh, 
  setRefreshInterval, 
  updateSettings 
} = settingsSlice.actions;
export default settingsSlice.reducer;