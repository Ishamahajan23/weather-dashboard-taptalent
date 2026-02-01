import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  setTemperatureUnit,
  setTheme,
  setAutoRefresh,
  setRefreshInterval,
} from "../features/settingsSlice";
import { removeFavorite, reorderFavorites } from "../features/favoritesSlice";

const Settings = () => {
  const dispatch = useDispatch();
  const settings = useSelector((state) => state.settings);
  const { cities: favoriteCities } = useSelector((state) => state.favorites);
  const [draggedItem, setDraggedItem] = useState(null);

  const isDark = settings.theme === "dark";

  const handleTemperatureUnitChange = (unit) => {
    dispatch(setTemperatureUnit(unit));
  };

  const handleThemeChange = (theme) => {
    dispatch(setTheme(theme));
  };

  const handleAutoRefreshToggle = () => {
    dispatch(setAutoRefresh(!settings.autoRefresh));
  };

  const handleRefreshIntervalChange = (interval) => {
    dispatch(setRefreshInterval(parseInt(interval)));
  };

  const handleRemoveFavorite = (city) => {
    dispatch(removeFavorite(city));
  };

  const handleDragStart = (e, index) => {
    setDraggedItem(index);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();

    if (draggedItem === null) return;

    const newCities = [...favoriteCities];
    const draggedCity = newCities[draggedItem];

    newCities.splice(draggedItem, 1);
    newCities.splice(dropIndex, 0, draggedCity);

    dispatch(reorderFavorites(newCities));
    setDraggedItem(null);
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link
              to="/"
              className={`inline-flex items-center px-6 py-3 backdrop-blur-md rounded-2xl transition-all duration-300 border shadow-lg ${
                isDark
                  ? "bg-gray-800/50 text-white border-gray-700/50 hover:bg-gray-800/70"
                  : "bg-white/80 text-gray-900 border-gray-300/50 hover:bg-white/95"
              }`}
            >
              ← Back to Dashboard
            </Link>
            <h1
              className={`text-4xl font-bold drop-shadow-lg ${isDark ? "text-white" : "text-gray-900"}`}
            >
              Settings
            </h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div
            className={`backdrop-blur-md rounded-3xl shadow-2xl p-8 border ${
              isDark
                ? "bg-gray-800/50 border-gray-700/50"
                : "bg-white/90 border-gray-200/50"
            }`}
          >
            <h2
              className={`text-2xl font-bold mb-6 flex items-center drop-shadow-lg ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              <span className="mr-3 text-2xl">⚙️</span>
              General Settings
            </h2>

            <div className="mb-8">
              <label
                className={`block text-sm font-medium mb-4 ${
                  isDark ? "text-white/90" : "text-gray-700"
                }`}
              >
                Temperature Unit
              </label>
              <div className="flex space-x-4">
                {["C", "F"].map((unit) => (
                  <button
                    key={unit}
                    onClick={() => handleTemperatureUnitChange(unit)}
                    className={`px-8 py-4 rounded-2xl font-medium transition-all duration-300 backdrop-blur-sm border ${
                      settings.temperatureUnit === unit
                        ? isDark
                          ? "bg-blue-500/40 text-white border-blue-400/50 shadow-lg transform scale-105"
                          : "bg-blue-500 text-white border-blue-400 shadow-lg transform scale-105"
                        : isDark
                          ? "bg-gray-700/50 text-white/80 border-gray-600/50 hover:bg-gray-700/70 hover:text-white"
                          : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200 hover:text-gray-900"
                    }`}
                  >
                    °{unit} {unit === "C" ? "Celsius" : "Fahrenheit"}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <label
                className={`block text-sm font-medium mb-4 ${
                  isDark ? "text-white/90" : "text-gray-700"
                }`}
              >
                Theme
              </label>
              <div className="flex space-x-4">
                {[
                  { value: "light", label: "☀️ Light", desc: "Light theme" },
                  { value: "dark", label: "🌙 Dark", desc: "Dark theme" },
                ].map((theme) => (
                  <button
                    key={theme.value}
                    onClick={() => handleThemeChange(theme.value)}
                    className={`px-8 py-4 rounded-2xl font-medium transition-all duration-300 backdrop-blur-sm border ${
                      settings.theme === theme.value
                        ? isDark
                          ? "bg-purple-500/40 text-white border-purple-400/50 shadow-lg transform scale-105"
                          : "bg-purple-500 text-white border-purple-400 shadow-lg transform scale-105"
                        : isDark
                          ? "bg-gray-700/50 text-white/80 border-gray-600/50 hover:bg-gray-700/70 hover:text-white"
                          : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200 hover:text-gray-900"
                    }`}
                  >
                    {theme.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <label
                className={`block text-sm font-medium mb-4 ${
                  isDark ? "text-white/90" : "text-gray-700"
                }`}
              >
                Auto Refresh
              </label>
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleAutoRefreshToggle}
                  className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors duration-300 ${
                    settings.autoRefresh
                      ? "bg-green-500/60"
                      : isDark
                        ? "bg-gray-700/50"
                        : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-transform duration-300 ${
                      settings.autoRefresh ? "translate-x-9" : "translate-x-1"
                    }`}
                  />
                </button>
                <span
                  className={`font-medium ${
                    isDark ? "text-white/90" : "text-gray-700"
                  }`}
                >
                  {settings.autoRefresh ? "Enabled" : "Disabled"}
                </span>
              </div>
            </div>

            {settings.autoRefresh && (
              <div className="mb-8">
                <label
                  className={`block text-sm font-medium mb-4 ${
                    isDark ? "text-white/90" : "text-gray-700"
                  }`}
                >
                  Refresh Interval
                </label>
                <select
                  value={settings.refreshInterval}
                  onChange={(e) => handleRefreshIntervalChange(e.target.value)}
                  className={`w-full px-4 py-3 backdrop-blur-sm border rounded-2xl focus:ring-2 focus:border-transparent transition-all duration-300 ${
                    isDark
                      ? "bg-gray-700/50 border-gray-600/50 text-white focus:ring-blue-500/50"
                      : "bg-white border-gray-300 text-gray-900 focus:ring-blue-500"
                  }`}
                >
                  <option
                    value={30}
                    className={isDark ? "bg-gray-800" : "bg-white"}
                  >
                    30 seconds
                  </option>
                  <option
                    value={60}
                    className={isDark ? "bg-gray-800" : "bg-white"}
                  >
                    1 minute
                  </option>
                  <option
                    value={120}
                    className={isDark ? "bg-gray-800" : "bg-white"}
                  >
                    2 minutes
                  </option>
                  <option
                    value={300}
                    className={isDark ? "bg-gray-800" : "bg-white"}
                  >
                    5 minutes
                  </option>
                  <option
                    value={600}
                    className={isDark ? "bg-gray-800" : "bg-white"}
                  >
                    10 minutes
                  </option>
                </select>
              </div>
            )}

            <div
              className={`backdrop-blur-sm rounded-2xl p-6 border ${
                isDark
                  ? "bg-blue-500/20 border-blue-400/30"
                  : "bg-blue-50 border-blue-200"
              }`}
            >
              <h3
                className={`font-semibold mb-3 flex items-center ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                <span className="mr-2">📋</span>
                Current Settings
              </h3>
              <ul
                className={`text-sm space-y-2 ${
                  isDark ? "text-white/90" : "text-gray-700"
                }`}
              >
                <li className="flex justify-between">
                  <span>Temperature:</span>
                  <span className="font-medium">
                    °{settings.temperatureUnit}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span>Theme:</span>
                  <span className="font-medium">
                    {settings.theme === "light" ? "Light" : "Dark"}
                  </span>
                </li>
                <li className="flex justify-between">
                  <span>Auto-refresh:</span>
                  <span className="font-medium">
                    {settings.autoRefresh
                      ? `Every ${settings.refreshInterval}s`
                      : "Off"}
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <div
            className={`backdrop-blur-md rounded-3xl shadow-2xl p-8 border ${
              isDark
                ? "bg-gray-800/50 border-gray-700/50"
                : "bg-white/90 border-gray-200/50"
            }`}
          >
            <h2
              className={`text-2xl font-bold mb-6 flex items-center drop-shadow-lg ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              <span className="mr-3 text-2xl">⭐</span>
              Favorite Cities ({favoriteCities.length})
            </h2>

            {favoriteCities.length > 0 ? (
              <div className="space-y-3">
                <p
                  className={`text-sm mb-6 ${
                    isDark ? "text-white/80" : "text-gray-600"
                  }`}
                >
                  Drag and drop to reorder, or click ✖️ to remove
                </p>
                {favoriteCities.map((city, index) => (
                  <div
                    key={city}
                    draggable
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, index)}
                    className={`flex items-center justify-between p-4 backdrop-blur-sm rounded-2xl border cursor-move transition-all duration-300 ${
                      isDark
                        ? "bg-gray-700/50 border-gray-600/50 hover:border-gray-500/50 hover:bg-gray-700/70"
                        : "bg-gray-50 border-gray-300 hover:border-gray-400 hover:bg-gray-100"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span
                        className={isDark ? "text-white/60" : "text-gray-400"}
                      >
                        ⋮⋮
                      </span>
                      <span
                        className={`font-medium ${isDark ? "text-white" : "text-gray-900"}`}
                      >
                        {city}
                      </span>
                    </div>
                    <button
                      onClick={() => handleRemoveFavorite(city)}
                      className={`p-2 rounded-full transition-all duration-300 hover:scale-110 ${
                        isDark
                          ? "text-red-400 hover:bg-red-500/20"
                          : "text-red-500 hover:bg-red-100"
                      }`}
                      title="Remove from favorites"
                    >
                      ✖️
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4 animate-bounce">🌍</div>
                <h3
                  className={`text-xl font-bold mb-2 ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  No favorite cities yet
                </h3>
                <p className={isDark ? "text-white/70" : "text-gray-600"}>
                  Add cities from the dashboard or search
                </p>
              </div>
            )}

            <div
              className={`mt-8 pt-6 border-t ${
                isDark ? "border-gray-700/50" : "border-gray-200"
              }`}
            >
              <Link
                to="/"
                className={`inline-flex items-center px-6 py-3 rounded-2xl transition-all duration-300 backdrop-blur-sm border shadow-lg hover:scale-105 ${
                  isDark
                    ? "bg-gradient-to-r from-blue-600/40 to-purple-600/40 text-white border-gray-600/50 hover:from-blue-600/60 hover:to-purple-600/60"
                    : "bg-gradient-to-r from-blue-500 to-purple-500 text-white border-blue-400 hover:from-blue-600 hover:to-purple-600"
                }`}
              >
                <span className="mr-2 text-lg">+</span>
                Add More Cities
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
