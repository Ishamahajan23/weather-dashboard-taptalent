import React, { useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  Home,
  LucideSettings,
  RefreshCw,
  Sun,
  Moon,
  Menu,
  X,
  User,
} from "lucide-react";
import { setTemperatureUnit, setTheme } from "../features/settingsSlice";
import {
  forceRefreshWeather,
  fetchWeather,
} from "../features/weather/weatherSlice";
import AuthModal from "./AuthModal";

const Navbar = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { temperatureUnit, theme } = useSelector((state) => state.settings);
  const { cities: favoriteCities } = useSelector((state) => state.favorites);
  const { current } = useSelector((state) => state.weather);
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const isDark = theme === "dark";

  const lastUpdated = useMemo(() => {
    const timestamps = Object.values(current).map((c) => c?.lastUpdated || 0);
    const latestTimestamp = timestamps.length > 0 ? Math.max(...timestamps) : 0;
    return latestTimestamp > 0 ? new Date(latestTimestamp) : new Date();
  }, [current]);

  const navItems = [
    { path: "/", label: "Dashboard", icon: <Home className="w-4 h-4" /> },
    {
      path: "/settings",
      label: "Settings",
      icon: <LucideSettings className="w-4 h-4" />,
    },
  ];

  const toggleTemperatureUnit = () => {
    const newUnit = temperatureUnit === "C" ? "F" : "C";
    dispatch(setTemperatureUnit(newUnit));
    favoriteCities.forEach((city) => {
      dispatch(forceRefreshWeather(city));
      dispatch(fetchWeather({ city, unit: newUnit }));
    });
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    favoriteCities.forEach((city) => {
      dispatch(forceRefreshWeather(city));
      dispatch(fetchWeather({ city, unit: temperatureUnit }));
    });
    setTimeout(() => setIsRefreshing(false), 2000);
  };

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    dispatch(setTheme(newTheme));
  };

  return (
    <>
      <nav
        className={`backdrop-blur-md border-b shadow-lg transition-colors duration-300 sticky top-0 z-50 ${
          isDark
            ? "bg-gray-900/95 border-gray-700/50"
            : "bg-white/95 border-gray-200/50"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <h1
                className={`text-lg sm:text-xl font-bold drop-shadow-lg transition-colors ${
                  isDark ? "text-blue-400" : "text-blue-600"
                }`}
              >
                🌤️ <span className="hidden xs:inline">WeatherApp</span>
              </h1>

              <div className="hidden md:flex space-x-2 lg:space-x-4">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`px-3 lg:px-4 py-2 flex items-center rounded-lg text-sm font-medium transition-all duration-300 ${
                      location.pathname === item.path
                        ? isDark
                          ? "bg-blue-600/30 text-blue-300 shadow-lg transform scale-105 border border-blue-500/30"
                          : "bg-blue-100 text-blue-700 shadow-lg transform scale-105 border border-blue-300"
                        : isDark
                          ? "text-gray-300 hover:bg-gray-800 hover:text-white"
                          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    }`}
                  >
                    <span className="mr-2">{item.icon}</span>
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-2 lg:space-x-3">
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className={`p-2.5 rounded-full transition-all duration-300 hover:scale-110 relative ${
                  isAuthenticated
                    ? isDark
                      ? "bg-green-600/20 hover:bg-green-600/30 text-green-400 border border-green-500/30"
                      : "bg-green-100 hover:bg-green-200 text-green-700 border border-green-300"
                    : isDark
                      ? "bg-gray-800 hover:bg-gray-700 text-gray-400"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-600"
                }`}
                title={isAuthenticated ? "Manage account" : "Sign in to sync"}
              >
                {user?.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt="Profile"
                    className="w-5 h-5 rounded-full"
                  />
                ) : isAuthenticated && user ? (
                  <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                    {user.displayName?.charAt(0)?.toUpperCase() ||
                      user.email?.charAt(0)?.toUpperCase() ||
                      "U"}
                  </div>
                ) : (
                  <User className="w-5 h-5" />
                )}
                {isAuthenticated && (
                  <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                )}
              </button>

              <button
                onClick={toggleTheme}
                className={`p-2.5 rounded-full transition-all duration-300 hover:scale-110 ${
                  isDark
                    ? "bg-gray-800 hover:bg-gray-700 text-yellow-400"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                }`}
                title={`Switch to ${isDark ? "light" : "dark"} mode`}
              >
                {isDark ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </button>

              <button
                onClick={toggleTemperatureUnit}
                className={`backdrop-blur-sm px-3 py-1.5 rounded-full border transition-all duration-300 hover:scale-105 cursor-pointer ${
                  isDark
                    ? "bg-gray-800/80 border-gray-600/50 hover:bg-gray-700"
                    : "bg-gray-100/80 border-gray-300/50 hover:bg-gray-200"
                }`}
                title={`Switch to °${temperatureUnit === "C" ? "F" : "C"}`}
              >
                <span
                  className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}
                >
                  Unit:{" "}
                </span>
                <span
                  className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}
                >
                  °{temperatureUnit}
                </span>
              </button>

              <div
                className={`flex items-center space-x-2 backdrop-blur-sm px-3 py-1.5 rounded-full border ${
                  isDark
                    ? "bg-gray-800/80 border-gray-600/50"
                    : "bg-gray-100/80 border-gray-300/50"
                }`}
              >
                <div>
                  <span
                    className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}
                  >
                    Updated:{" "}
                  </span>
                  <span
                    className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}
                  >
                    {lastUpdated.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <button
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className={`p-1 rounded-full transition-all duration-300 ${
                    isRefreshing ? "animate-spin" : "hover:scale-110"
                  } ${isDark ? "hover:bg-gray-700" : "hover:bg-gray-200"}`}
                  title="Refresh weather data"
                >
                  <RefreshCw
                    className={`w-4 h-4 ${
                      isDark ? "text-blue-400" : "text-blue-600"
                    } ${isRefreshing ? "opacity-60" : ""}`}
                  />
                </button>
              </div>
            </div>

            <div className="flex md:hidden items-center space-x-2">
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className={`p-2 rounded-full transition-all duration-300 relative ${
                  isAuthenticated
                    ? isDark
                      ? "bg-green-600/20 text-green-400 border border-green-500/30"
                      : "bg-green-100 text-green-700 border border-green-300"
                    : isDark
                      ? "bg-gray-800 text-gray-400"
                      : "bg-gray-100 text-gray-600"
                }`}
                title={isAuthenticated ? "Account" : "Sign in"}
              >
                {user?.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt="Profile"
                    className="w-5 h-5 rounded-full"
                  />
                ) : isAuthenticated && user ? (
                  <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                    {user.displayName?.charAt(0)?.toUpperCase() ||
                      user.email?.charAt(0)?.toUpperCase() ||
                      "U"}
                  </div>
                ) : (
                  <User className="w-5 h-5" />
                )}
                {isAuthenticated && (
                  <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border border-white"></div>
                )}
              </button>

              <button
                onClick={toggleTheme}
                className={`p-2 rounded-full transition-all duration-300 ${
                  isDark
                    ? "bg-gray-800 hover:bg-gray-700 text-yellow-400"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                }`}
                title={`Switch to ${isDark ? "light" : "dark"} mode`}
              >
                {isDark ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </button>

              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className={`p-2 rounded-full transition-all duration-300 ${
                  isRefreshing ? "animate-spin" : ""
                } ${
                  isDark
                    ? "bg-gray-800 hover:bg-gray-700 text-blue-400"
                    : "bg-gray-100 hover:bg-gray-200 text-blue-600"
                }`}
                title="Refresh weather data"
              >
                <RefreshCw className="w-5 h-5" />
              </button>

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`p-2 rounded-full transition-all duration-300 ${
                  isDark
                    ? "bg-gray-800 hover:bg-gray-700 text-white"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-900"
                }`}
                title="Menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {isMobileMenuOpen && (
        <div
          className={`md:hidden backdrop-blur-md border-b shadow-lg transition-all duration-300 sticky top-16 z-40 ${
            isDark
              ? "bg-gray-900/95 border-gray-700/50"
              : "bg-white/95 border-gray-200/50"
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 py-4 space-y-3">
            <div className="space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`w-full px-4 py-3 flex items-center rounded-lg text-sm font-medium transition-all duration-300 ${
                    location.pathname === item.path
                      ? isDark
                        ? "bg-blue-600/30 text-blue-300 shadow-lg border border-blue-500/30"
                        : "bg-blue-100 text-blue-700 shadow-lg border border-blue-300"
                      : isDark
                        ? "text-gray-300 hover:bg-gray-800 hover:text-white"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </div>

            <div
              className={`flex items-center justify-between p-3 rounded-lg border ${
                isDark
                  ? "bg-gray-800/50 border-gray-700/50"
                  : "bg-gray-50 border-gray-200/50"
              }`}
            >
              <span
                className={`text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}
              >
                Temperature Unit
              </span>
              <button
                onClick={toggleTemperatureUnit}
                className={`px-4 py-2 rounded-full border transition-all duration-300 hover:scale-105 ${
                  isDark
                    ? "bg-gray-700 border-gray-600 hover:bg-gray-600"
                    : "bg-white border-gray-300 hover:bg-gray-100"
                }`}
              >
                <span
                  className={`font-bold ${isDark ? "text-white" : "text-gray-900"}`}
                >
                  °{temperatureUnit}
                </span>
              </button>
            </div>

            <div
              className={`flex items-center justify-between p-3 rounded-lg border ${
                isDark
                  ? "bg-gray-800/50 border-gray-700/50"
                  : "bg-gray-50 border-gray-200/50"
              }`}
            >
              <span
                className={`text-sm font-medium ${isDark ? "text-gray-300" : "text-gray-700"}`}
              >
                Last Updated
              </span>
              <span
                className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}
              >
                {lastUpdated.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>
        </div>
      )}

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </>
  );
};

export default Navbar;
