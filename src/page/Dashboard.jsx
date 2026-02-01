import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWeather } from '../features/weather/weatherSlice';
import { addFavorite } from '../features/favoritesSlice';
import WeatherCard from '../components/WeatherCard';
import SearchBar from '../components/SearchBar';

const Dashboard = () => {
  const dispatch = useDispatch();
  const [currentIndex, setCurrentIndex] = useState(0);  
  const { current: weatherData, status, error } = useSelector(state => state.weather);
  const { cities: favoriteCities } = useSelector(state => state.favorites);
  const { temperatureUnit } = useSelector(state => state.settings);

  useEffect(() => {
    favoriteCities.forEach(city => {
      dispatch(fetchWeather({ city, unit: temperatureUnit }));
    });
  }, [dispatch, favoriteCities, temperatureUnit]);

  const handleCitySelect = (cityName) => {
    dispatch(addFavorite(cityName));
  };

  const nextCity = () => {
    setCurrentIndex((prev) => (prev + 1) % favoriteCities.length);
  };

  const prevCity = () => {
    setCurrentIndex((prev) => (prev - 1 + favoriteCities.length) % favoriteCities.length);
  };

  const getWeatherForCity = (city) => {
    return weatherData[city]?.data;
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-md mx-auto pt-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <h2 className="text-xl font-bold text-red-800 mb-2">Error Loading Weather</h2>
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  const currentCity = favoriteCities[currentIndex];

  return (
    <div className="min-h-screen ">
      <div className="max-w-md mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Weather</h1>
          <SearchBar onCitySelect={handleCitySelect} />
        </div>

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
              <div className="flex justify-between items-center backdrop-blur-md bg-white/10 rounded-2xl p-4 border border-white/20">
                <button
                  onClick={prevCity}
                  className="group p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-110 text-white font-bold text-xl"
                >
                  <span className="group-hover:-translate-x-1 transition-transform duration-300 inline-block">←</span>
                </button>
                <div className="text-center">
                  <div className="flex space-x-2 mb-2">
                    {favoriteCities.map((_, index) => (
                      <div
                        key={index}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                          index === currentIndex 
                            ? 'bg-gradient-to-r from-blue-400 to-purple-500 scale-125' 
                            : 'bg-white/40 hover:bg-white/60'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-white/80 text-sm font-medium">
                    {currentIndex + 1} of {favoriteCities.length}
                  </span>
                </div>
                <button
                  onClick={nextCity}
                  className="group p-4 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-110 text-white font-bold text-xl"
                >
                  <span className="group-hover:translate-x-1 transition-transform duration-300 inline-block">→</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-16 backdrop-blur-md bg-white/5 rounded-3xl border border-white/20">
            <div className="text-8xl mb-6 animate-bounce">🌤️</div>
            <h3 className="text-2xl font-bold text-white mb-3 drop-shadow-lg">No cities added yet</h3>
            <p className="text-white/70 text-lg">Search above to add your first city</p>
            <div className="mt-6 w-32 h-1 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full mx-auto"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;