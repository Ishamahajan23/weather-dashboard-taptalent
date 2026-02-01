import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { weatherAPI } from "./weatherAPI";

const isStale = (timestamp) =>
  !timestamp || Date.now() - timestamp > 60000;

export const fetchWeather = createAsyncThunk(
  "weather/fetchWeather",
  async ({ city, unit }, { getState }) => {
    const cached = getState().weather.current[city];
    if (cached && !isStale(cached.lastUpdated)) {
      return { city, data: cached.data, cached: true };
    }

    const data = await weatherAPI.getCurrentWeather(city);
    return { city, data };
  }
);

export const fetchDetailedWeather = createAsyncThunk(
  "weather/fetchDetailedWeather",
  async ({ city, lat, lon }, { getState }) => {
    const cached = getState().weather.detailed[city];
    if (cached && !isStale(cached.lastUpdated)) {
      return { city, data: cached.data, cached: true };
    }

    const data = await weatherAPI.getDetailedWeather(lat, lon);
    return { city, data };
  }
);

export const searchCities = createAsyncThunk(
  "weather/searchCities",
  async (query) => {
    const data = await weatherAPI.searchCities(query);
    return data;
  }
);

const weatherSlice = createSlice({
  name: "weather",
  initialState: {
    current: {},
    detailed: {},
    searchResults: [],
    status: "idle",
    searchStatus: "idle",
    error: null
  },
  reducers: {
    clearSearchResults: (state) => {
      state.searchResults = [];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWeather.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchWeather.fulfilled, (state, action) => {
        const { city, data } = action.payload;
        state.current[city] = {
          data,
          lastUpdated: Date.now()
        };
        state.status = "success";
      })
      .addCase(fetchWeather.rejected, (state, action) => {
        state.status = "error";
        state.error = action.error.message;
      })
      .addCase(fetchDetailedWeather.fulfilled, (state, action) => {
        const { city, data } = action.payload;
        state.detailed[city] = {
          data,
          lastUpdated: Date.now()
        };
      })
      .addCase(searchCities.pending, (state) => {
        state.searchStatus = "loading";
      })
      .addCase(searchCities.fulfilled, (state, action) => {
        state.searchResults = action.payload;
        state.searchStatus = "success";
      })
      .addCase(searchCities.rejected, (state, action) => {
        state.searchStatus = "error";
        state.error = action.error.message;
      });
  }
});

export const { clearSearchResults } = weatherSlice.actions;
export default weatherSlice.reducer;
