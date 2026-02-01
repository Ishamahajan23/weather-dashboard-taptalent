import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchWeather } from "../features/weather/weatherSlice";
import { removeFavorite, reorderFavorites } from "../features/favoritesSlice";
import { getWeatherIcon } from "../features/weather/weatherAPI";
import WeatherCard from "../components/WeatherCard";
import SearchBar from "../components/SearchBar";
import Snackbar from "../components/Snackbar";
import { MapPin, Plus, X } from "lucide-react";

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [draggedItem, setDraggedItem] = useState(null);
  const [snackbar, setSnackbar] = useState({
    isOpen: false,
    message: "",
    type: "info",
  });
  const { current: weatherData, error } = useSelector((state) => state.weather);
  const { cities: favoriteCities } = useSelector((state) => state.favorites);
  const { temperatureUnit, theme } = useSelector((state) => state.settings);

  const isDark = theme === "dark";

  useEffect(() => {
    favoriteCities.forEach((city) => {
      dispatch(fetchWeather({ city, unit: temperatureUnit }));
    });
  }, [dispatch, favoriteCities, temperatureUnit]);

  const handleCitySelect = (cityName) => {
    navigate(`/city/${encodeURIComponent(cityName)}`);
  };

  const handleRemoveFavorite = (city) => {
    dispatch(removeFavorite(city));
    setSnackbar({
      isOpen: true,
      message: `${city.charAt(0).toUpperCase() + city.slice(1)} removed from favorites`,
      type: "info",
    });
    if (currentIndex >= favoriteCities.length - 1 && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleViewCity = (city, index) => {
    setCurrentIndex(index);
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

  const nextCity = () => {
    setCurrentIndex((prev) => (prev + 1) % favoriteCities.length);
  };

  const prevCity = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + favoriteCities.length) % favoriteCities.length,
    );
  };

  const getWeatherForCity = (city) => {
    return weatherData[city]?.data;
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-md mx-auto pt-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <h2 className="text-xl font-bold text-red-800 mb-2">
              Error Loading Weather
            </h2>
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  const currentCity = favoriteCities[currentIndex];

  // Capitalize city name function
  const capitalizeCity = (city) => {
    return city
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8">
        {/* Improved Header */}
        <div className="text-center mb-6 sm:mb-8 md:mb-10">
          <div
            className={`inline-block mb-4 sm:mb-6 p-3 sm:p-4 rounded-2xl sm:rounded-3xl backdrop-blur-xl border-2 shadow-2xl transition-all duration-300 ${
              isDark
                ? "bg-gray-800/80 border-gray-600/50"
                : "bg-white/90 border-gray-200/50"
            }`}
          >
            <div className="flex items-center justify-center space-x-2 sm:space-x-3 mb-1 sm:mb-2">
              <MapPin
                className={`w-6 h-6 sm:w-8 sm:h-8 ${isDark ? "text-blue-400" : "text-blue-600"}`}
              />
              <h1
                className={`text-2xl sm:text-3xl md:text-4xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}
              >
                Weather Dashboard
              </h1>
              <MapPin
                className={`w-6 h-6 sm:w-8 sm:h-8 ${isDark ? "text-blue-400" : "text-blue-600"}`}
              />
            </div>
            <p
              className={`text-xs sm:text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}
            >
              Search and track weather for your favorite cities
            </p>
          </div>
          <SearchBar onCitySelect={handleCitySelect} />
        </div>

        {/* Horizontal Card Slider - Mobile Only */}
        <div className="lg:hidden mb-6 sm:mb-8 mt-4">
          <div className="overflow-x-auto custom-scrollbar pb-4 -mx-3 px-3">
            <div className="flex space-x-3 sm:space-x-4 pt-2">
              {favoriteCities.map((city, index) => (
                <div
                  key={city}
                  onClick={() => handleViewCity(city, index)}
                  className={`shrink-0 w-48 sm:w-56 p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
                    index === currentIndex
                      ? isDark
                        ? "bg-blue-600/30 border-blue-500/50 shadow-lg scale-105"
                        : "bg-blue-100 border-blue-400/50 shadow-lg scale-105"
                      : isDark
                        ? "bg-gray-800/50 border-gray-700/50 hover:bg-gray-800/70"
                        : "bg-white/90 border-gray-300/50 hover:bg-white"
                  }`}
                >
                  <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between mb-3">
                      <h3
                        className={`font-bold text-base truncate flex-1 ${
                          isDark ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {capitalizeCity(city)}
                      </h3>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveFavorite(city);
                        }}
                        className={`group/remove p-1.5 rounded-full transition-all duration-300 hover:scale-110 hover:rotate-90 shrink-0 ml-2 ${
                          isDark
                            ? "text-red-400 hover:bg-red-500/30 border border-transparent hover:border-red-400/50"
                            : "text-red-500 hover:bg-red-100 border border-transparent hover:border-red-400/50"
                        }`}
                        title="Remove from favorites"
                      >
                        <X className="w-4 h-4" strokeWidth={2.5} />
                      </button>
                    </div>
                    {getWeatherForCity(city) && (
                      <div className="mt-auto">
                        <div className="text-center mb-2 flex justify-center">
                          <img
                            src={
                              getWeatherIcon(
                                getWeatherForCity(city).weather[0].icon,
                              ).url
                            }
                            alt={
                              getWeatherIcon(
                                getWeatherForCity(city).weather[0].icon,
                              ).name
                            }
                            className="w-16 h-16 object-contain"
                            style={{
                              imageRendering: "-webkit-optimize-contrast",
                              filter: "contrast(1.1) brightness(1.05)",
                            }}
                          />
                        </div>
                        <div
                          className={`text-center mb-2 ${isDark ? "text-white" : "text-gray-900"}`}
                        >
                          <span className="text-2xl font-bold">
                            {Math.round(getWeatherForCity(city).main.temp)}°
                          </span>
                          <span className="text-lg ml-1">
                            {temperatureUnit}
                          </span>
                        </div>
                        <p
                          className={`text-xs text-center capitalize ${
                            isDark ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          {getWeatherForCity(city).weather[0].description}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Add City Card */}
              <div
                onClick={() =>
                  document.querySelector('input[type="text"]')?.focus()
                }
                className={`shrink-0 w-48 sm:w-56 p-4 rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-300 flex items-center justify-center ${
                  isDark
                    ? "bg-gray-800/30 border-gray-600/50 hover:bg-gray-800/50 hover:border-blue-500/50"
                    : "bg-gray-50/50 border-gray-400/50 hover:bg-gray-100 hover:border-blue-500/50"
                }`}
              >
                <div className="text-center">
                  <Plus
                    className={`w-12 h-12 mx-auto mb-2 ${
                      isDark ? "text-gray-500" : "text-gray-400"
                    }`}
                  />
                  <p
                    className={`text-sm font-medium ${
                      isDark ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    Add City
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {/* Main Weather Display */}
          <div className="lg:col-span-2">
            {favoriteCities.length > 0 && currentCity ? (
              <div className="space-y-8">
                <div className="transform hover:scale-105 transition-all duration-500">
                  <WeatherCard
                    city={currentCity}
                    weatherData={getWeatherForCity(currentCity)}
                    isFavorite={true}
                  />
                </div>

                {favoriteCities.length > 1 && (
                  <div
                    className={`flex justify-between items-center backdrop-blur-md rounded-2xl p-3 sm:p-4 border ${
                      isDark
                        ? "bg-gray-800/50 border-gray-700/50"
                        : "bg-white/70 border-gray-300/50"
                    }`}
                  >
                    <button
                      onClick={prevCity}
                      className={`group p-3 sm:p-4 rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-110 font-bold text-lg sm:text-xl ${
                        isDark
                          ? "bg-gradient-to-r from-blue-600 to-purple-700 text-white"
                          : "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                      }`}
                    >
                      <span className="group-hover:-translate-x-1 transition-transform duration-300 inline-block">
                        ←
                      </span>
                    </button>
                    <div className="text-center px-2">
                      <div className="flex space-x-1.5 sm:space-x-2 mb-2">
                        {favoriteCities.map((_, index) => (
                          <div
                            key={index}
                            className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 cursor-pointer ${
                              index === currentIndex
                                ? isDark
                                  ? "bg-gradient-to-r from-blue-400 to-purple-500 scale-125"
                                  : "bg-gradient-to-r from-blue-500 to-purple-600 scale-125"
                                : isDark
                                  ? "bg-gray-600 hover:bg-gray-500"
                                  : "bg-gray-400 hover:bg-gray-500"
                            }`}
                            onClick={() => setCurrentIndex(index)}
                          />
                        ))}
                      </div>
                      <span
                        className={`text-xs sm:text-sm font-medium ${
                          isDark ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        {currentIndex + 1} of {favoriteCities.length}
                      </span>
                    </div>
                    <button
                      onClick={nextCity}
                      className={`group p-3 sm:p-4 rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-110 font-bold text-lg sm:text-xl ${
                        isDark
                          ? "bg-gradient-to-r from-purple-600 to-pink-700 text-white"
                          : "bg-gradient-to-r from-purple-500 to-pink-600 text-white"
                      }`}
                    >
                      <span className="group-hover:translate-x-1 transition-transform duration-300 inline-block">
                        →
                      </span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div
                className={`text-center py-16 backdrop-blur-xl rounded-3xl border-2 ${
                  isDark
                    ? "bg-gray-800/50 border-gray-700/50"
                    : "bg-white/80 border-gray-200/50"
                }`}
              >
                <div className="text-8xl mb-6 animate-bounce">🌤️</div>
                <h3
                  className={`text-2xl font-bold mb-3 ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  No cities added yet
                </h3>
                <p
                  className={`text-lg ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Search above to add your first city
                </p>
                <div
                  className={`mt-6 w-32 h-1 rounded-full mx-auto ${
                    isDark
                      ? "bg-gradient-to-r from-blue-400 to-purple-500"
                      : "bg-gradient-to-r from-blue-500 to-purple-600"
                  }`}
                ></div>
              </div>
            )}
          </div>

          {/* Favorite Cities List - Desktop Only */}
          <div className="lg:col-span-1 hidden lg:block">
            <div
              className={`backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 border-2 sticky top-20 transition-colors overflow-hidden ${
                isDark
                  ? "bg-gray-800/90 border-gray-600/50"
                  : "bg-white/95 border-gray-200/50"
              }`}
            >
              <h2
                className={`text-lg sm:text-xl font-bold mb-3 sm:mb-4 flex items-center ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                <span className="mr-2 text-lg sm:text-xl">⭐</span>
                Favorite Cities ({favoriteCities.length})
              </h2>

              {favoriteCities.length > 0 ? (
                <>
                  <p
                    className={`text-xs sm:text-sm mb-3 sm:mb-4 ${isDark ? "text-gray-400" : "text-gray-600"}`}
                  >
                    Drag to reorder • Click to view • ✖️ to remove
                  </p>
                  <div className="space-y-2.5 max-h-96 lg:max-h-[calc(100vh-280px)] overflow-y-auto custom-scrollbar pr-2">
                    {favoriteCities.map((city, index) => (
                      <div
                        key={city}
                        draggable
                        onDragStart={(e) => handleDragStart(e, index)}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, index)}
                        onClick={() => handleViewCity(city, index)}
                        className={`flex items-center justify-between p-3 rounded-xl border-2 transition-all duration-300 cursor-move group ${
                          index === currentIndex
                            ? isDark
                              ? "bg-blue-600/30 border-blue-500/60 shadow-lg ring-2 ring-blue-500/30"
                              : "bg-blue-100 border-blue-400/60 shadow-lg ring-2 ring-blue-400/30"
                            : isDark
                              ? "bg-gray-700/50 border-gray-600/30 hover:bg-gray-700/70 hover:border-gray-500/50"
                              : "bg-gray-50 border-gray-300/50 hover:bg-gray-100/80 hover:border-gray-400/50"
                        }`}
                      >
                        <div className="flex items-center space-x-3 flex-1 min-w-0">
                          <span
                            className={`text-sm ${isDark ? "text-gray-500" : "text-gray-400"} group-hover:text-blue-500 transition-colors shrink-0`}
                          >
                            ⋮⋮
                          </span>
                          <div className="flex flex-col flex-1 min-w-0">
                            <span
                              className={`font-semibold text-base truncate ${
                                isDark ? "text-white" : "text-gray-900"
                              }`}
                            >
                              {capitalizeCity(city)}
                            </span>
                            {getWeatherForCity(city) && (
                              <span
                                className={`text-xs ${
                                  isDark ? "text-gray-400" : "text-gray-600"
                                } truncate`}
                              >
                                {Math.round(getWeatherForCity(city).main.temp)}°
                                {temperatureUnit} •{" "}
                                {getWeatherForCity(city).weather[0].description}
                              </span>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveFavorite(city);
                          }}
                          className={`group/remove p-2 rounded-full transition-all duration-300 hover:scale-110 hover:rotate-90 shrink-0 ${
                            isDark
                              ? "text-red-400 hover:bg-red-500/30 border border-transparent hover:border-red-400/50"
                              : "text-red-500 hover:bg-red-100 border border-transparent hover:border-red-400/50"
                          }`}
                          title="Remove from favorites"
                        >
                          <X
                            className="w-4 h-4 sm:w-5 sm:h-5"
                            strokeWidth={2.5}
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-6 sm:py-8">
                  <div className="text-3xl sm:text-4xl mb-3 animate-bounce">
                    🌍
                  </div>
                  <p
                    className={`text-xs sm:text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}
                  >
                    Add cities from search above
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Snackbar Notifications */}
      <Snackbar
        message={snackbar.message}
        type={snackbar.type}
        isOpen={snackbar.isOpen}
        onClose={() => setSnackbar({ ...snackbar, isOpen: false })}
        duration={3000}
      />
    </div>
  );
};

export default Dashboard;
