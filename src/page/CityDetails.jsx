import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Heart } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Area,
  AreaChart,
} from "recharts";
import { fetchDetailedWeather } from "../features/weather/weatherSlice";
import { addFavorite, removeFavorite } from "../features/favoritesSlice";
import {
  getWeatherIcon,
  formatTemperature,
} from "../features/weather/weatherAPI";
import { weatherAPI } from "../features/weather/weatherAPI";

const CityDetails = () => {
  const { cityName } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [, setCoordinates] = useState(null);

  const {
    detailed: detailedWeather,
    status,
    error,
  } = useSelector((state) => state.weather);
  const { cities: favoriteCities } = useSelector((state) => state.favorites);
  const { temperatureUnit, theme } = useSelector((state) => state.settings);

  const isDark = theme === "dark";
  const decodedCityName = decodeURIComponent(cityName);
  const isFavorite = favoriteCities.includes(decodedCityName);
  const cityWeatherData = detailedWeather[decodedCityName]?.data;
  const [selectedView, setSelectedView] = useState("hourly"); // 'hourly' or 'daily'
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const fetchData = async () => {
      try {
        const coords = await weatherAPI.getCoordinates(decodedCityName);
        setCoordinates(coords);
        dispatch(
          fetchDetailedWeather({
            city: decodedCityName,
            lat: coords.lat,
            lon: coords.lon,
          }),
        );
      } catch (error) {
        console.error("Failed to fetch city coordinates:", error);
      }
    };

    fetchData();
  }, [decodedCityName, dispatch]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  const handleFavoriteToggle = () => {
    if (isFavorite) {
      dispatch(removeFavorite(decodedCityName));
    } else {
      dispatch(addFavorite(decodedCityName));
    }
  };

  const formatChartData = () => {
    if (!cityWeatherData) return { hourly: [], daily: [] };

    const hourlyData =
      cityWeatherData.hourly?.slice(0, 24).map((hour, index) => ({
        time:
          new Date(
            (hour.dt || Date.now() / 1000 + index * 3600) * 1000,
          ).getHours() + ":00",
        temperature: formatTemperature(hour.temp, temperatureUnit),
        humidity: Math.floor(Math.random() * 30) + 40,
        precipitation: Math.round((hour.pop || Math.random()) * 100),
        icon: hour.weather?.[0]?.icon || "01d",
      })) || [];

    const dailyData =
      cityWeatherData.daily?.map((day, index) => ({
        day: new Date(
          (day.dt || Date.now() / 1000 + index * 24 * 3600) * 1000,
        ).toLocaleDateString("en", { weekday: "short" }),
        high: formatTemperature(
          day.temp?.max || day.temp?.day || 25,
          temperatureUnit,
        ),
        low: formatTemperature(
          day.temp?.min || day.temp?.day || 15,
          temperatureUnit,
        ),
        humidity: day.humidity || Math.floor(Math.random() * 30) + 40,
        windSpeed: Math.round((day.wind_speed || Math.random() * 5) * 10) / 10,
        precipitation: Math.round((day.pop || Math.random()) * 100),
      })) || [];

    return { hourly: hourlyData, daily: dailyData };
  };

  if (status === "loading" || !cityWeatherData) {
    return (
      <div
        className={`min-h-screen p-4 ${isDark ? "bg-gray-900" : "bg-gradient-to-br from-blue-50 to-indigo-100"}`}
      >
        <div className="max-w-7xl mx-auto pt-8">
          <div
            className={`text-center backdrop-blur-md rounded-2xl p-8 border shadow-lg ${
              isDark
                ? "bg-gray-800/90 border-gray-700/50"
                : "bg-white/90 border-gray-200/50"
            }`}
          >
            <div
              className={`animate-spin w-12 h-12 border-4 rounded-full mx-auto mb-4 ${
                isDark
                  ? "border-gray-600 border-t-blue-400"
                  : "border-gray-300 border-t-blue-600"
              }`}
            ></div>
            <p
              className={`text-lg font-medium ${isDark ? "text-white" : "text-gray-900"}`}
            >
              Loading detailed weather data for {decodedCityName}...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`min-h-screen p-4 ${isDark ? "bg-gray-900" : "bg-gradient-to-br from-blue-50 to-indigo-100"}`}
      >
        <div className="max-w-7xl mx-auto pt-8">
          <div
            className={`backdrop-blur-md rounded-2xl p-6 text-center border shadow-lg ${
              isDark
                ? "bg-red-500/20 border-red-400/30"
                : "bg-red-50 border-red-200"
            }`}
          >
            <h2
              className={`text-xl font-bold mb-2 ${isDark ? "text-white" : "text-red-900"}`}
            >
              Error Loading Data
            </h2>
            <p className={`mb-4 ${isDark ? "text-red-200" : "text-red-700"}`}>
              {error}
            </p>
            <button
              onClick={() => navigate("/")}
              className={`px-6 py-3 rounded-lg hover:scale-105 transition-all duration-300 backdrop-blur-sm border ${
                isDark
                  ? "bg-white/20 text-white border-white/30 hover:bg-white/30"
                  : "bg-white text-red-700 border-red-300 hover:bg-red-50"
              }`}
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentWeather = cityWeatherData.current;
  const { hourly, daily } = formatChartData();

  const cityTimezoneName = cityWeatherData.timezone_name;

  const capitalizeCity = (city) => {
    return city
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  return (
    <div
      className={`min-h-screen ${isDark ? "bg-gray-900" : "bg-linear-to-br from-blue-50 to-indigo-100"}`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        {/* Header - Responsive */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
            <Link
              to="/"
              className={`inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 backdrop-blur-md rounded-xl sm:rounded-2xl hover:scale-105 transition-all duration-300 border shadow-lg text-sm sm:text-base ${
                isDark
                  ? "bg-gray-800/90 text-white border-gray-700/50 hover:bg-gray-800"
                  : "bg-white/90 text-gray-900 border-gray-200/50 hover:bg-white"
              }`}
            >
              ← Back to Dashboard
            </Link>
            <h1
              className={`text-2xl sm:text-3xl md:text-4xl font-bold drop-shadow-lg ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              {capitalizeCity(decodedCityName)}
            </h1>
          </div>
          <button
            onClick={handleFavoriteToggle}
            className={`group/fav px-4 sm:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl font-medium transition-all duration-300 backdrop-blur-md border shadow-lg flex items-center space-x-2 hover:scale-105 w-full sm:w-auto justify-center text-sm sm:text-base ${
              isFavorite
                ? isDark
                  ? "bg-linear-to-r from-red-500/30 to-pink-500/30 text-white border-red-400/50 hover:from-red-500/40 hover:to-pink-500/40"
                  : "bg-linear-to-r from-red-100 to-pink-100 text-red-700 border-red-300 hover:from-red-200 hover:to-pink-200"
                : isDark
                  ? "bg-gray-800/90 text-white border-gray-700/50 hover:bg-gray-800"
                  : "bg-white/90 text-gray-900 border-gray-200/50 hover:bg-white"
            }`}
          >
            {isFavorite ? (
              <>
                <Heart
                  className="w-4 h-4 sm:w-5 sm:h-5 fill-red-400 text-red-300 group-hover/fav:scale-110 transition-transform"
                  strokeWidth={2.5}
                />
                <span>Remove from Favorites</span>
              </>
            ) : (
              <>
                <Heart
                  className="w-4 h-4 sm:w-5 sm:h-5 group-hover/fav:scale-110 group-hover/fav:fill-red-400/30 transition-all"
                  strokeWidth={2}
                />
                <span>Add to Favorites</span>
              </>
            )}
          </button>
        </div>

        {/* Current Weather Card - Responsive */}
        <div
          className={`backdrop-blur-md rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 md:p-8 mb-6 sm:mb-8 border-2 ${
            isDark
              ? "bg-gray-800/90 border-gray-700/50"
              : "bg-white/95 border-gray-200/50"
          }`}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            <div className="text-center lg:text-left">
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 sm:gap-6 mb-4">
                <img
                  src={getWeatherIcon(currentWeather.weather[0].icon).url}
                  alt={getWeatherIcon(currentWeather.weather[0].icon).name}
                  className="w-24 h-24 sm:w-28 sm:h-28 object-contain animate-float"
                  style={{
                    imageRendering: "-webkit-optimize-contrast",
                    filter:
                      "contrast(1.1) brightness(1.05) drop-shadow(0 10px 20px rgba(0,0,0,0.3))",
                  }}
                />
                <div>
                  <div
                    className={`text-5xl sm:text-6xl font-bold drop-shadow-lg ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {formatTemperature(currentWeather.temp, temperatureUnit)}°
                    {temperatureUnit}
                  </div>
                  <div
                    className={`text-base sm:text-xl capitalize mt-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full backdrop-blur-sm inline-block ${
                      isDark
                        ? "bg-blue-500/20 text-blue-200"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {currentWeather.weather[0].description}
                  </div>
                </div>
              </div>
              <div
                className={`text-lg sm:text-xl font-medium ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Feels like{" "}
                {formatTemperature(currentWeather.feels_like, temperatureUnit)}°
                {temperatureUnit}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div
                className={`backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center border transition-all hover:scale-105 ${
                  isDark
                    ? "bg-blue-500/10 border-blue-400/20"
                    : "bg-blue-50 border-blue-200/50"
                }`}
              >
                <div className="text-2xl sm:text-3xl mb-2 sm:mb-3">💧</div>
                <div
                  className={`text-xs sm:text-sm mb-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}
                >
                  Humidity
                </div>
                <div
                  className={`text-xl sm:text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}
                >
                  {currentWeather.humidity}%
                </div>
              </div>
              <div
                className={`backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center border transition-all hover:scale-105 ${
                  isDark
                    ? "bg-green-500/10 border-green-400/20"
                    : "bg-green-50 border-green-200/50"
                }`}
              >
                <div className="text-2xl sm:text-3xl mb-2 sm:mb-3">💨</div>
                <div
                  className={`text-xs sm:text-sm mb-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}
                >
                  Wind Speed
                </div>
                <div
                  className={`text-xl sm:text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}
                >
                  {currentWeather.wind_speed} m/s
                </div>
              </div>
              <div
                className={`backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center border transition-all hover:scale-105 ${
                  isDark
                    ? "bg-yellow-500/10 border-yellow-400/20"
                    : "bg-yellow-50 border-yellow-200/50"
                }`}
              >
                <div className="text-2xl sm:text-3xl mb-2 sm:mb-3">👁️</div>
                <div
                  className={`text-xs sm:text-sm mb-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}
                >
                  Visibility
                </div>
                <div
                  className={`text-xl sm:text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}
                >
                  {(currentWeather.visibility / 1000).toFixed(1)} km
                </div>
              </div>
              <div
                className={`backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center border transition-all hover:scale-105 ${
                  isDark
                    ? "bg-purple-500/10 border-purple-400/20"
                    : "bg-purple-50 border-purple-200/50"
                }`}
              >
                <div className="text-2xl sm:text-3xl mb-2 sm:mb-3">🌡️</div>
                <div
                  className={`text-xs sm:text-sm mb-1 ${isDark ? "text-gray-400" : "text-gray-600"}`}
                >
                  UV Index
                </div>
                <div
                  className={`text-xl sm:text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}
                >
                  {currentWeather.uvi}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* View Selector - Hourly/Daily */}
        <div className="flex flex-col items-center mb-6 sm:mb-8 gap-3">
          {/* Current Date/Time Display */}
          <div
            className={`text-center px-4 sm:px-6 py-2.5 sm:py-3.5 rounded-xl backdrop-blur-md border shadow-lg ${
              isDark
                ? "bg-gray-800/90 border-gray-700/50"
                : "bg-white/90 border-gray-200/50"
            }`}
          >
            <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">🕐</span>
                <p
                  className={`text-sm sm:text-base font-semibold ${isDark ? "text-white" : "text-gray-900"}`}
                >
                  {cityTimezoneName
                    ? currentDateTime.toLocaleString("en-US", {
                        timeZone: cityTimezoneName,
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })
                    : currentDateTime.toLocaleString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                </p>
              </div>
              <span
                className={`hidden sm:inline ${isDark ? "text-gray-600" : "text-gray-400"}`}
              >
                •
              </span>
              <p
                className={`text-xs sm:text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}
              >
                {selectedView === "hourly"
                  ? "24-hour forecast"
                  : "7-day forecast"}
              </p>
            </div>
          </div>

          <div
            className={`inline-flex rounded-xl sm:rounded-2xl p-1 backdrop-blur-md border ${
              isDark
                ? "bg-gray-800/90 border-gray-700/50"
                : "bg-white/90 border-gray-200/50"
            }`}
          >
            <button
              onClick={() => setSelectedView("hourly")}
              className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl font-medium transition-all duration-300 text-sm sm:text-base ${
                selectedView === "hourly"
                  ? isDark
                    ? "bg-blue-600 text-white shadow-lg"
                    : "bg-blue-500 text-white shadow-lg"
                  : isDark
                    ? "text-gray-400 hover:text-white"
                    : "text-gray-600 hover:text-gray-900"
              }`}
            >
              📊 Hourly (24h)
            </button>
            <button
              onClick={() => setSelectedView("daily")}
              className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl font-medium transition-all duration-300 text-sm sm:text-base ${
                selectedView === "daily"
                  ? isDark
                    ? "bg-blue-600 text-white shadow-lg"
                    : "bg-blue-500 text-white shadow-lg"
                  : isDark
                    ? "text-gray-400 hover:text-white"
                    : "text-gray-600 hover:text-gray-900"
              }`}
            >
              📅 Daily (7 days)
            </button>
          </div>
        </div>

        {/* Charts Grid - Responsive */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 md:gap-8 mb-6 sm:mb-8">
          {/* Temperature Chart */}
          <div
            className={`rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 ${
              isDark ? "bg-gray-800/90" : "bg-white"
            }`}
          >
            <h3
              className={`text-lg sm:text-xl font-bold mb-4 ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              {selectedView === "hourly"
                ? "24-Hour Temperature Trend"
                : "7-Day Temperature Forecast"}
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              {selectedView === "hourly" ? (
                <LineChart data={hourly}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={isDark ? "#374151" : "#E5E7EB"}
                  />
                  <XAxis
                    dataKey="time"
                    stroke={isDark ? "#9CA3AF" : "#6B7280"}
                    style={{ fontSize: "12px" }}
                  />
                  <YAxis
                    stroke={isDark ? "#9CA3AF" : "#6B7280"}
                    style={{ fontSize: "12px" }}
                  />
                  <Tooltip
                    formatter={(value) => [
                      `${value}°${temperatureUnit}`,
                      "Temperature",
                    ]}
                    contentStyle={{
                      backgroundColor: isDark ? "#1F2937" : "#FFFFFF",
                      border: `1px solid ${isDark ? "#374151" : "#E5E7EB"}`,
                      borderRadius: "8px",
                      color: isDark ? "#FFFFFF" : "#111827",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="temperature"
                    stroke={isDark ? "#60A5FA" : "#3B82F6"}
                    strokeWidth={3}
                    dot={{
                      fill: isDark ? "#60A5FA" : "#3B82F6",
                      strokeWidth: 2,
                    }}
                  />
                </LineChart>
              ) : (
                <AreaChart data={daily}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={isDark ? "#374151" : "#E5E7EB"}
                  />
                  <XAxis
                    dataKey="day"
                    stroke={isDark ? "#9CA3AF" : "#6B7280"}
                    style={{ fontSize: "12px" }}
                  />
                  <YAxis
                    stroke={isDark ? "#9CA3AF" : "#6B7280"}
                    style={{ fontSize: "12px" }}
                  />
                  <Tooltip
                    formatter={(value) => [
                      `${value}°${temperatureUnit}`,
                      "Temperature",
                    ]}
                    contentStyle={{
                      backgroundColor: isDark ? "#1F2937" : "#FFFFFF",
                      border: `1px solid ${isDark ? "#374151" : "#E5E7EB"}`,
                      borderRadius: "8px",
                      color: isDark ? "#FFFFFF" : "#111827",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="high"
                    stackId="1"
                    stroke={isDark ? "#F87171" : "#EF4444"}
                    fill={isDark ? "#7F1D1D" : "#FEE2E2"}
                    name="High"
                  />
                  <Area
                    type="monotone"
                    dataKey="low"
                    stackId="1"
                    stroke={isDark ? "#60A5FA" : "#3B82F6"}
                    fill={isDark ? "#1E3A8A" : "#DBEAFE"}
                    name="Low"
                  />
                </AreaChart>
              )}
            </ResponsiveContainer>
          </div>

          {/* Precipitation Chart */}
          <div
            className={`rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 ${
              isDark ? "bg-gray-800/90" : "bg-white"
            }`}
          >
            <h3
              className={`text-lg sm:text-xl font-bold mb-4 ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              Precipitation Probability
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart
                data={selectedView === "hourly" ? hourly.slice(0, 12) : daily}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={isDark ? "#374151" : "#E5E7EB"}
                />
                <XAxis
                  dataKey={selectedView === "hourly" ? "time" : "day"}
                  stroke={isDark ? "#9CA3AF" : "#6B7280"}
                  style={{ fontSize: "12px" }}
                />
                <YAxis
                  stroke={isDark ? "#9CA3AF" : "#6B7280"}
                  style={{ fontSize: "12px" }}
                />
                <Tooltip
                  formatter={(value) => [`${value}%`, "Precipitation"]}
                  contentStyle={{
                    backgroundColor: isDark ? "#1F2937" : "#FFFFFF",
                    border: `1px solid ${isDark ? "#374151" : "#E5E7EB"}`,
                    borderRadius: "8px",
                    color: isDark ? "#FFFFFF" : "#111827",
                  }}
                />
                <Bar
                  dataKey="precipitation"
                  fill={isDark ? "#22D3EE" : "#06B6D4"}
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Additional Charts Row */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
          {/* Humidity Chart */}
          <div
            className={`rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 ${
              isDark ? "bg-gray-800/90" : "bg-white"
            }`}
          >
            <h3
              className={`text-lg sm:text-xl font-bold mb-4 ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              Humidity Levels
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart
                data={selectedView === "hourly" ? hourly.slice(0, 12) : daily}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={isDark ? "#374151" : "#E5E7EB"}
                />
                <XAxis
                  dataKey={selectedView === "hourly" ? "time" : "day"}
                  stroke={isDark ? "#9CA3AF" : "#6B7280"}
                  style={{ fontSize: "12px" }}
                />
                <YAxis
                  stroke={isDark ? "#9CA3AF" : "#6B7280"}
                  style={{ fontSize: "12px" }}
                />
                <Tooltip
                  formatter={(value) => [`${value}%`, "Humidity"]}
                  contentStyle={{
                    backgroundColor: isDark ? "#1F2937" : "#FFFFFF",
                    border: `1px solid ${isDark ? "#374151" : "#E5E7EB"}`,
                    borderRadius: "8px",
                    color: isDark ? "#FFFFFF" : "#111827",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="humidity"
                  stroke={isDark ? "#A78BFA" : "#8B5CF6"}
                  strokeWidth={3}
                  dot={{ fill: isDark ? "#A78BFA" : "#8B5CF6", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Wind Speed Chart */}
          <div
            className={`rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 ${
              isDark ? "bg-gray-800/90" : "bg-white"
            }`}
          >
            <h3
              className={`text-lg sm:text-xl font-bold mb-4 ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              Wind Speed {selectedView === "daily" && "(m/s)"}
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              {selectedView === "daily" ? (
                <LineChart data={daily}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={isDark ? "#374151" : "#E5E7EB"}
                  />
                  <XAxis
                    dataKey="day"
                    stroke={isDark ? "#9CA3AF" : "#6B7280"}
                    style={{ fontSize: "12px" }}
                  />
                  <YAxis
                    stroke={isDark ? "#9CA3AF" : "#6B7280"}
                    style={{ fontSize: "12px" }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isDark ? "#1F2937" : "#FFFFFF",
                      border: `1px solid ${isDark ? "#374151" : "#E5E7EB"}`,
                      borderRadius: "8px",
                      color: isDark ? "#FFFFFF" : "#111827",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="windSpeed"
                    stroke={isDark ? "#34D399" : "#10B981"}
                    name="Wind Speed (m/s)"
                    strokeWidth={3}
                    dot={{
                      fill: isDark ? "#34D399" : "#10B981",
                      strokeWidth: 2,
                    }}
                  />
                </LineChart>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p
                    className={`text-center ${isDark ? "text-gray-400" : "text-gray-600"}`}
                  >
                    Wind speed data available in daily view
                  </p>
                </div>
              )}
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CityDetails;
