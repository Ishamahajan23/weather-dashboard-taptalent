import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  setTemperatureUnit,
  setTheme,
  setAutoRefresh,
  setRefreshInterval
} from '../features/settingsSlice';
import { removeFavorite, reorderFavorites } from '../features/favoritesSlice';

const Settings = () => {
  const dispatch = useDispatch();
  const settings = useSelector(state => state.settings);
  const { cities: favoriteCities } = useSelector(state => state.favorites);
  const [draggedItem, setDraggedItem] = useState(null);

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
              className="inline-flex items-center px-6 py-3 backdrop-blur-md bg-white/20 text-white rounded-2xl hover:bg-white/30 transition-all duration-300 border border-white/30 shadow-lg"
            >
              ← Back to Dashboard
            </Link>
            <h1 className="text-4xl font-bold text-white drop-shadow-lg">Settings</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="backdrop-blur-md bg-white/10 rounded-3xl shadow-2xl p-8 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center drop-shadow-lg">
              <span className="mr-3 text-2xl">⚙️</span>
              General Settings
            </h2>

            <div className="mb-8">
              <label className="block text-sm font-medium text-white/90 mb-4">
                Temperature Unit
              </label>
              <div className="flex space-x-4">
                {['C', 'F'].map((unit) => (
                  <button
                    key={unit}
                    onClick={() => handleTemperatureUnitChange(unit)}
                    className={`px-8 py-4 rounded-2xl font-medium transition-all duration-300 backdrop-blur-sm border ${
                      settings.temperatureUnit === unit
                        ? 'bg-blue-500/40 text-white border-blue-400/50 shadow-lg transform scale-105'
                        : 'bg-white/10 text-white/80 border-white/20 hover:bg-white/20 hover:text-white'
                    }`}
                  >
                    °{unit} {unit === 'C' ? 'Celsius' : 'Fahrenheit'}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <label className="block text-sm font-medium text-white/90 mb-4">
                Theme
              </label>
              <div className="flex space-x-4">
                {[
                  { value: 'light', label: '☀️ Light', desc: 'Light theme' },
                  { value: 'dark', label: '🌙 Dark', desc: 'Dark theme' }
                ].map((theme) => (
                  <button
                    key={theme.value}
                    onClick={() => handleThemeChange(theme.value)}
                    className={`px-8 py-4 rounded-2xl font-medium transition-all duration-300 backdrop-blur-sm border ${
                      settings.theme === theme.value
                        ? 'bg-purple-500/40 text-white border-purple-400/50 shadow-lg transform scale-105'
                        : 'bg-white/10 text-white/80 border-white/20 hover:bg-white/20 hover:text-white'
                    }`}
                  >
                    {theme.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <label className="block text-sm font-medium text-white/90 mb-4">
                Auto Refresh
              </label>
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleAutoRefreshToggle}
                  className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors duration-300 ${
                    settings.autoRefresh ? 'bg-green-500/60' : 'bg-white/20'
                  }`}
                >
                  <span
                    className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-transform duration-300 ${
                      settings.autoRefresh ? 'translate-x-9' : 'translate-x-1'
                    }`}
                  />
                </button>
                <span className="text-white/90 font-medium">
                  {settings.autoRefresh ? 'Enabled' : 'Disabled'}
                </span>
              </div>
            </div>

            {settings.autoRefresh && (
              <div className="mb-8">
                <label className="block text-sm font-medium text-white/90 mb-4">
                  Refresh Interval
                </label>
                <select
                  value={settings.refreshInterval}
                  onChange={(e) => handleRefreshIntervalChange(e.target.value)}
                  className="w-full px-4 py-3 backdrop-blur-sm bg-white/10 border border-white/30 rounded-2xl text-white focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all duration-300"
                >
                  <option value={30} className="bg-gray-800">30 seconds</option>
                  <option value={60} className="bg-gray-800">1 minute</option>
                  <option value={120} className="bg-gray-800">2 minutes</option>
                  <option value={300} className="bg-gray-800">5 minutes</option>
                  <option value={600} className="bg-gray-800">10 minutes</option>
                </select>
              </div>
            )}

            <div className="backdrop-blur-sm bg-blue-500/20 rounded-2xl p-6 border border-blue-400/30">
              <h3 className="font-semibold text-white mb-3 flex items-center">
                <span className="mr-2">📋</span>
                Current Settings
              </h3>
              <ul className="text-sm text-white/90 space-y-2">
                <li className="flex justify-between">
                  <span>Temperature:</span> 
                  <span className="font-medium">°{settings.temperatureUnit}</span>
                </li>
                <li className="flex justify-between">
                  <span>Theme:</span> 
                  <span className="font-medium">{settings.theme === 'light' ? 'Light' : 'Dark'}</span>
                </li>
                <li className="flex justify-between">
                  <span>Auto-refresh:</span> 
                  <span className="font-medium">{settings.autoRefresh ? `Every ${settings.refreshInterval}s` : 'Off'}</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="backdrop-blur-md bg-white/10 rounded-3xl shadow-2xl p-8 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center drop-shadow-lg">
              <span className="mr-3 text-2xl">⭐</span>
              Favorite Cities ({favoriteCities.length})
            </h2>

            {favoriteCities.length > 0 ? (
              <div className="space-y-3">
                <p className="text-sm text-white/80 mb-6">
                  Drag and drop to reorder, or click ✖️ to remove
                </p>
                {favoriteCities.map((city, index) => (
                  <div
                    key={city}
                    draggable
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, index)}
                    className="flex items-center justify-between p-4 backdrop-blur-sm bg-white/10 rounded-2xl border border-white/20 hover:border-white/40 cursor-move transition-all duration-300 hover:bg-white/20"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-white/60">⋮⋮</span>
                      <span className="font-medium text-white">{city}</span>
                    </div>
                    <button
                      onClick={() => handleRemoveFavorite(city)}
                      className="p-2 text-red-400 hover:bg-red-500/20 rounded-full transition-all duration-300 hover:scale-110"
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
                <h3 className="text-xl font-bold text-white mb-2">No favorite cities yet</h3>
                <p className="text-white/70 mb-4">
                  Add cities from the dashboard or search
                </p>
              </div>
            )}

            <div className="mt-8 pt-6 border-t border-white/20">
              <Link
                to="/"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500/40 to-purple-500/40 text-white rounded-2xl hover:from-blue-500/60 hover:to-purple-500/60 transition-all duration-300 backdrop-blur-sm border border-white/30 shadow-lg hover:scale-105"
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