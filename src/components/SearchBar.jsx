import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { searchCities, clearSearchResults } from '../features/weather/weatherSlice';
import { addFavorite } from '../features/favoritesSlice';

const SearchBar = ({ onCitySelect }) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const searchRef = useRef(null);
  const resultsRef = useRef(null);
  
  const { searchResults, searchStatus } = useSelector(state => state.weather);

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

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCitySelect = (city) => {
    setQuery('');
    setIsOpen(false);
    dispatch(clearSearchResults());
    
    if (onCitySelect) {
      onCitySelect(city.name);
    } else {
      // Add to favorites if no specific handler provided
      dispatch(addFavorite(city.name));
    }
  };

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      setQuery('');
    } else if (e.key === 'Enter' && searchResults.length > 0) {
      handleCitySelect(searchResults[0]);
    }
  };

  return (
    <div className="relative w-full max-w-md mx-auto">
      <div className="relative">
        <input
          ref={searchRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => query.length > 2 && setIsOpen(true)}
          placeholder="Search cities... (e.g., London, Paris, Tokyo)"
          className="w-full pl-12 pr-4 py-4 rounded-2xl backdrop-blur-md bg-white/20 border border-black/30 text-black placeholder-black/70 focus:ring-2 focus:ring-black/50 focus:border-black/50 shadow-lg transition-all duration-300 focus:scale-105"
        />
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
          {searchStatus === 'loading' ? (
            <div className="animate-spin w-6 h-6 border-2 border-black/50 border-t-black rounded-full"></div>
          ) : (
            <span className="text-white/80 text-2xl">🔍</span>
          )}
        </div>
      </div>

      {isOpen && searchResults.length > 0 && (
        <div
          ref={resultsRef}
          className="absolute top-full left-0 right-0 mt-3 backdrop-blur-md bg-white/10 border border-white/30 rounded-2xl shadow-2xl z-50 max-h-60 overflow-y-auto"
        >
          {searchResults.map((city, index) => (
            <button
              key={`${city.name}-${city.country}-${index}`}
              onClick={() => handleCitySelect(city)}
              className="w-full px-6 py-4 text-left hover:bg-white/20 transition-all duration-300 flex items-center justify-between border-b border-white/10 last:border-b-0 first:rounded-t-2xl last:rounded-b-2xl"
            >
              <div>
                <div className="font-semibold text-white">{city.name}</div>
                <div className="text-sm text-white/70">{city.country}</div>
              </div>
              <div className="text-white/60">
                <span className="text-lg">📍</span>
              </div>
            </button>
          ))}
        </div>
      )}

      {isOpen && query.length > 2 && searchResults.length === 0 && searchStatus !== 'loading' && (
        <div className="absolute top-full left-0 right-0 mt-3 backdrop-blur-md bg-white/10 border border-white/30 rounded-2xl shadow-2xl z-50 p-6 text-center">
          <div className="text-4xl mb-2">😔</div>
          <p className="text-white/80">No cities found. Try a different search term.</p>
        </div>
      )}
    </div>
  );
};

export default SearchBar;