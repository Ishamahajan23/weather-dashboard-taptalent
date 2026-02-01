import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { getWeatherIcon, formatTemperature } from '../features/weather/weatherAPI';
import { addFavorite, removeFavorite } from '../features/favoritesSlice';

const WeatherCard = ({ city, weatherData, isFavorite = false }) => {
  const dispatch = useDispatch();
  const { temperatureUnit } = useSelector(state => state.settings);

  const handleFavoriteToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isFavorite) {
      dispatch(removeFavorite(city));
    } else {
      dispatch(addFavorite(city));
    }
  };

  if (!weatherData) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-full"></div>
      </div>
    );
  }

  const { main, weather, wind } = weatherData;
  const weatherCondition = weather[0];

  return (
    <Link to={`/city/${encodeURIComponent(city)}`} className="block group">
      <div className="backdrop-blur-md bg-gradient-to-br from-white/20 to-white/10 border border-white/30 rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 transform group-hover:-translate-y-2 overflow-hidden">
        <div className="p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-2xl font-bold text-white mb-2 drop-shadow-lg">{city}</h3>
              <p className="text-white/80 text-sm capitalize bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
                {weatherCondition.description}
              </p>
            </div>
            <button
              onClick={handleFavoriteToggle}
              className={`p-3 rounded-full transition-all duration-300 backdrop-blur-sm hover:scale-110 ${
                isFavorite 
                  ? 'bg-red-500/30 text-red-200 hover:bg-red-500/50 shadow-lg' 
                  : 'bg-white/20 text-white/60 hover:text-red-300 hover:bg-red-500/30'
              }`}
              title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <span className="text-xl">{isFavorite ? '❤️' : '🤍'}</span>
            </button>
          </div>

          <div className="flex items-center justify-center mb-8">
            <div className="text-center">
              <div className="text-7xl mb-4 animate-pulse">
                {getWeatherIcon(weatherCondition.icon)}
              </div>
              <div className="flex items-baseline justify-center">
                <span className="text-5xl font-bold text-white drop-shadow-lg">
                  {formatTemperature(main.temp, temperatureUnit)}
                </span>
                <span className="text-2xl text-white/80 ml-1">°{temperatureUnit}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="backdrop-blur-sm bg-white/10 rounded-2xl p-4 border border-white/20">
              <div className="flex items-center mb-2">
                <span className="text-2xl mr-3">🌡️</span>
                <span className="text-white/80 text-sm">Feels like</span>
              </div>
              <span className="text-white font-semibold text-lg">
                {formatTemperature(main.feels_like, temperatureUnit)}°
              </span>
            </div>
            <div className="backdrop-blur-sm bg-white/10 rounded-2xl p-4 border border-white/20">
              <div className="flex items-center mb-2">
                <span className="text-2xl mr-3">💧</span>
                <span className="text-white/80 text-sm">Humidity</span>
              </div>
              <span className="text-white font-semibold text-lg">{main.humidity}%</span>
            </div>
            <div className="backdrop-blur-sm bg-white/10 rounded-2xl p-4 border border-white/20">
              <div className="flex items-center mb-2">
                <span className="text-2xl mr-3">💨</span>
                <span className="text-white/80 text-sm">Wind</span>
              </div>
              <span className="text-white font-semibold text-lg">{wind.speed} m/s</span>
            </div>
            <div className="backdrop-blur-sm bg-white/10 rounded-2xl p-4 border border-white/20">
              <div className="flex items-center mb-2">
                <span className="text-2xl mr-3">⏰</span>
                <span className="text-white/80 text-sm">Updated</span>
              </div>
              <span className="text-white font-semibold text-lg">
                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-blue-500/30 to-purple-500/30 backdrop-blur-sm px-8 py-4 border-t border-white/20">
          <p className="text-white/90 text-center font-medium group-hover:text-white transition-colors duration-300">
            Tap for detailed forecast →
          </p>
        </div>
      </div>
    </Link>
  );
};

export default WeatherCard;