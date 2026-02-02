import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  getWeatherIcon,
  formatTemperature,
} from "../features/weather/weatherAPI";

const capitalizeCity = (city) => {
  return city
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

const WeatherCard = ({ city, weatherData }) => {
  const { temperatureUnit, theme } = useSelector((state) => state.settings);

  const isDark = theme === "dark";
  const displayCity = capitalizeCity(city);

  if (!weatherData) {
    return (
      <div
        className={`rounded-xl shadow-md p-6 animate-pulse ${
          isDark ? "bg-gray-800" : "bg-white"
        }`}
      >
        <div
          className={`h-4 rounded w-3/4 mb-4 ${
            isDark ? "bg-gray-700" : "bg-gray-200"
          }`}
        ></div>
        <div
          className={`h-8 rounded w-1/2 mb-4 ${
            isDark ? "bg-gray-700" : "bg-gray-200"
          }`}
        ></div>
        <div
          className={`h-4 rounded w-full ${
            isDark ? "bg-gray-700" : "bg-gray-200"
          }`}
        ></div>
      </div>
    );
  }

  const { main, weather, wind } = weatherData;
  const weatherCondition = weather[0];

  return (
    <Link to={`/city/${encodeURIComponent(city)}`} className="block group">
      <div
        className={`backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 transform group-hover:-translate-y-2 overflow-hidden border-2 ${
          isDark
            ? "bg-gradient-to-br from-gray-800/95 to-gray-900/95 border-gray-700/50"
            : "bg-gradient-to-br from-white/98 to-blue-50/95 border-blue-200/50"
        }`}
      >
        <div className="p-4 sm:p-6 md:p-8 lg:p-10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
            <div className="flex-1 w-full sm:w-auto">
              <h3
                className={`text-2xl sm:text-3xl md:text-4xl font-bold mb-2 drop-shadow-lg leading-tight ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                {displayCity}
              </h3>
              <p
                className={`text-sm sm:text-base capitalize px-4 py-1.5 rounded-full backdrop-blur-sm inline-block font-medium ${
                  isDark
                    ? "text-blue-200 bg-blue-500/20"
                    : "text-blue-700 bg-blue-100"
                }`}
              >
                {weatherCondition.description}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center mb-6 sm:mb-8">
            <div className="text-center w-full">
              <div className="mb-4 flex justify-center">
                <div className="relative animate-float">
                  <img
                    src={getWeatherIcon(weatherCondition.icon).url}
                    alt={getWeatherIcon(weatherCondition.icon).name}
                    className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 object-contain"
                    style={{
                      imageRendering: "-webkit-optimize-contrast",
                      filter: "contrast(1.1) brightness(1.05)",
                    }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-center gap-1">
                <span
                  className={`text-5xl sm:text-6xl md:text-7xl font-bold leading-none ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  {formatTemperature(main.temp, temperatureUnit)}
                </span>
                <div className="flex flex-col items-start justify-start pt-1">
                  <span
                    className={`text-2xl sm:text-3xl md:text-4xl font-medium leading-none ${
                      isDark ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    °{temperatureUnit}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-5">
            <div
              className={`backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-5 border transition-all duration-200 hover:scale-105 hover:shadow-lg ${
                isDark
                  ? "bg-gray-700/50 border-gray-600/50"
                  : "bg-blue-50/80 border-blue-200/50"
              }`}
            >
              <div className="flex items-center mb-2 sm:mb-3">
                <span className="text-2xl sm:text-3xl mr-2 sm:mr-3">🌡️</span>
                <span
                  className={`text-sm sm:text-base font-medium ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Feels like
                </span>
              </div>
              <span
                className={`font-bold text-lg sm:text-xl md:text-2xl block ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                {formatTemperature(main.feels_like, temperatureUnit)}°
              </span>
            </div>
            <div
              className={`backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-5 border transition-all duration-200 hover:scale-105 hover:shadow-lg ${
                isDark
                  ? "bg-gray-700/50 border-gray-600/50"
                  : "bg-blue-50/80 border-blue-200/50"
              }`}
            >
              <div className="flex items-center mb-2 sm:mb-3">
                <span className="text-2xl sm:text-3xl mr-2 sm:mr-3">💧</span>
                <span
                  className={`text-sm sm:text-base font-medium ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Humidity
                </span>
              </div>
              <span
                className={`font-bold text-lg sm:text-xl md:text-2xl block ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                {main.humidity}%
              </span>
            </div>
            <div
              className={`backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-5 border transition-all duration-200 hover:scale-105 hover:shadow-lg ${
                isDark
                  ? "bg-gray-700/50 border-gray-600/50"
                  : "bg-blue-50/80 border-blue-200/50"
              }`}
            >
              <div className="flex items-center mb-2 sm:mb-3">
                <span className="text-2xl sm:text-3xl mr-2 sm:mr-3">💨</span>
                <span
                  className={`text-sm sm:text-base font-medium ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Wind
                </span>
              </div>
              <span
                className={`font-bold text-lg sm:text-xl md:text-2xl block ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                {wind.speed} m/s
              </span>
            </div>
            <div
              className={`backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-5 border transition-all duration-200 hover:scale-105 hover:shadow-lg ${
                isDark
                  ? "bg-gray-700/50 border-gray-600/50"
                  : "bg-blue-50/80 border-blue-200/50"
              }`}
            >
              <div className="flex items-center mb-2 sm:mb-3">
                <span className="text-2xl sm:text-3xl mr-2 sm:mr-3">⏰</span>
                <span
                  className={`text-sm sm:text-base font-medium ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Updated
                </span>
              </div>
              <span
                className={`font-bold text-lg sm:text-xl md:text-2xl block ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                {new Date().toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>
        </div>

        <div
          className={`backdrop-blur-sm px-4 sm:px-8 py-3 sm:py-4 border-t ${
            isDark
              ? "bg-blue-600/20 border-gray-700/50"
              : "bg-blue-100/70 border-blue-200/50"
          }`}
        >
          <p
            className={`text-center text-sm sm:text-base font-medium group-hover:scale-105 transition-transform duration-300 ${
              isDark ? "text-blue-200" : "text-blue-700"
            }`}
          >
            Tap for detailed forecast →
          </p>
        </div>
      </div>
    </Link>
  );
};

export default WeatherCard;
