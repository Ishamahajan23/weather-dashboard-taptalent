import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  searchCities,
  clearSearchResults,
} from "../features/weather/weatherSlice";
import { addFavorite } from "../features/favoritesSlice";
import { Search, X } from "lucide-react";

const SearchBar = ({ onCitySelect }) => {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const dispatch = useDispatch();
  const searchRef = useRef(null);
  const resultsRef = useRef(null);

  const { searchResults, searchStatus } = useSelector((state) => state.weather);
  const { theme } = useSelector((state) => state.settings);

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      if (query.length > 2) {
        dispatch(searchCities(query));
        setIsOpen(true);
      } else {
        dispatch(clearSearchResults());
        setIsOpen(false);
      }
    }, 300);

    return () => clearTimeout(delayedSearch);
  }, [query, dispatch]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target) &&
        resultsRef.current &&
        !resultsRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCitySelect = (city) => {
    setQuery("");
    setIsOpen(false);
    dispatch(clearSearchResults());

    if (onCitySelect) {
      onCitySelect(city.name);
    } else {
      dispatch(addFavorite(city.name));
    }
  };

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      setIsOpen(false);
      setQuery("");
      setIsFocused(false);
    } else if (e.key === "Enter" && searchResults.length > 0) {
      handleCitySelect(searchResults[0]);
    }
  };

  const handleClear = () => {
    setQuery("");
    setIsOpen(false);
    dispatch(clearSearchResults());
  };

  const isDark = theme === "dark";

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div
        className={`relative group transition-all duration-300 ${isFocused ? "scale-105" : ""}`}
      >
        <input
          ref={searchRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            setIsFocused(true);
            query.length > 2 && setIsOpen(true);
          }}
          onBlur={() => setIsFocused(false)}
          placeholder="Search for cities... (e.g., London, Paris, New York)"
          className={`w-full pl-14 pr-12 py-5 rounded-3xl backdrop-blur-lg border-2 shadow-2xl transition-all duration-300 text-lg font-medium placeholder:font-normal focus:outline-none ${
            isDark
              ? "bg-gray-800/90 border-gray-600/50 text-white placeholder-gray-400 focus:border-blue-500 focus:bg-gray-800"
              : "bg-white/95 border-gray-300/50 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:bg-white"
          }`}
        />
        <div className="absolute left-5 top-1/2 transform -translate-y-1/2">
          {searchStatus === "loading" ? (
            <div
              className={`animate-spin w-6 h-6 border-3 rounded-full ${
                isDark
                  ? "border-blue-400/30 border-t-blue-400"
                  : "border-blue-500/30 border-t-blue-500"
              }`}
            ></div>
          ) : (
            <Search
              className={`w-6 h-6 ${isDark ? "text-blue-400" : "text-blue-600"} transition-colors`}
            />
          )}
        </div>
        {query && (
          <button
            onClick={handleClear}
            className={`absolute right-5 top-1/2 transform -translate-y-1/2 p-1 rounded-full transition-all duration-200 ${
              isDark
                ? "hover:bg-gray-700 text-gray-400 hover:text-white"
                : "hover:bg-gray-200 text-gray-500 hover:text-gray-900"
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {isOpen && searchResults.length > 0 && (
        <div
          ref={resultsRef}
          className={`absolute top-full left-0 right-0 mt-4 backdrop-blur-xl rounded-3xl shadow-2xl z-50 max-h-96 overflow-hidden border-2 ${
            isDark
              ? "bg-gray-800/95 border-gray-600/50"
              : "bg-white/98 border-gray-300/50"
          }`}
        >
          <div
            className={`px-4 py-3 border-b ${isDark ? "border-gray-700" : "border-gray-200"}`}
          >
            <p
              className={`text-sm font-semibold ${isDark ? "text-gray-300" : "text-gray-600"}`}
            >
              {searchResults.length}{" "}
              {searchResults.length === 1 ? "city" : "cities"} found
            </p>
          </div>
          <div className="max-h-80 overflow-y-auto custom-scrollbar">
            {searchResults.map((city, index) => (
              <button
                key={`${city.name}-${city.country}-${index}`}
                onClick={() => handleCitySelect(city)}
                className={`w-full px-6 py-4 text-left transition-all duration-200 flex items-center justify-between group ${
                  isDark
                    ? "hover:bg-blue-600/20 border-gray-700/50"
                    : "hover:bg-blue-50 border-gray-200/50"
                } border-b last:border-b-0`}
              >
                <div className="flex-1">
                  <div
                    className={`font-bold text-lg mb-1 ${isDark ? "text-white" : "text-gray-900"}`}
                  >
                    {city.name}
                  </div>
                  <div
                    className={`text-sm flex items-center space-x-2 ${isDark ? "text-gray-400" : "text-gray-600"}`}
                  >
                    <span>📍</span>
                    <span>{city.country}</span>
                    {city.state && <span>• {city.state}</span>}
                  </div>
                </div>
                <div
                  className={`text-2xl transform group-hover:scale-110 transition-transform ${
                    isDark
                      ? "opacity-60 group-hover:opacity-100"
                      : "opacity-50 group-hover:opacity-100"
                  }`}
                >
                  ➜
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {isOpen &&
        query.length > 2 &&
        searchResults.length === 0 &&
        searchStatus !== "loading" && (
          <div
            className={`absolute top-full left-0 right-0 mt-4 backdrop-blur-xl rounded-3xl shadow-2xl z-50 p-8 text-center border-2 ${
              isDark
                ? "bg-gray-800/95 border-gray-600/50"
                : "bg-white/98 border-gray-300/50"
            }`}
          >
            <div className="text-6xl mb-4 animate-bounce">�</div>
            <p
              className={`font-semibold text-lg mb-2 ${isDark ? "text-white" : "text-gray-900"}`}
            >
              No cities found
            </p>
            <p
              className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}
            >
              Try a different search term or check your spelling
            </p>
          </div>
        )}
    </div>
  );
};

export default SearchBar;
