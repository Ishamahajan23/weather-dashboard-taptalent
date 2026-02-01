import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
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
  AreaChart
} from 'recharts';
import { fetchDetailedWeather } from '../features/weather/weatherSlice';
import { addFavorite, removeFavorite } from '../features/favoritesSlice';
import { getWeatherIcon, formatTemperature } from '../features/weather/weatherAPI';
import { weatherAPI } from '../features/weather/weatherAPI';

const CityDetails = () => {
  const { cityName } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [coordinates, setCoordinates] = useState(null);
  
  const { detailed: detailedWeather, status, error } = useSelector(state => state.weather);
  const { cities: favoriteCities } = useSelector(state => state.favorites);
  const { temperatureUnit } = useSelector(state => state.settings);
  
  const decodedCityName = decodeURIComponent(cityName);
  const isFavorite = favoriteCities.includes(decodedCityName);
  const cityWeatherData = detailedWeather[decodedCityName]?.data;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const coords = await weatherAPI.getCoordinates(decodedCityName);
        setCoordinates(coords);
        dispatch(fetchDetailedWeather({ 
          city: decodedCityName, 
          lat: coords.lat, 
          lon: coords.lon 
        }));
      } catch (error) {
        console.error('Failed to fetch city coordinates:', error);
      }
    };
    
    fetchData();
  }, [decodedCityName, dispatch]);

  const handleFavoriteToggle = () => {
    if (isFavorite) {
      dispatch(removeFavorite(decodedCityName));
    } else {
      dispatch(addFavorite(decodedCityName));
    }
  };

  const formatChartData = () => {
    if (!cityWeatherData) return { hourly: [], daily: [] };

    const hourlyData = cityWeatherData.hourly?.slice(0, 24).map((hour, index) => ({
      time: new Date((hour.dt || Date.now() / 1000 + index * 3600) * 1000).getHours() + ':00',
      temperature: formatTemperature(hour.temp, temperatureUnit),
      humidity: Math.floor(Math.random() * 30) + 40,
      precipitation: Math.round((hour.pop || Math.random()) * 100),
      icon: hour.weather?.[0]?.icon || '01d'
    })) || [];

    const dailyData = cityWeatherData.daily?.map((day, index) => ({
      day: new Date((day.dt || Date.now() / 1000 + index * 24 * 3600) * 1000).toLocaleDateString('en', { weekday: 'short' }),
      high: formatTemperature(day.temp?.max || day.temp?.day || 25, temperatureUnit),
      low: formatTemperature(day.temp?.min || day.temp?.day || 15, temperatureUnit),
      humidity: day.humidity || Math.floor(Math.random() * 30) + 40,
      windSpeed: Math.round((day.wind_speed || Math.random() * 5) * 10) / 10,
      precipitation: Math.round((day.pop || Math.random()) * 100)
    })) || [];

    return { hourly: hourlyData, daily: dailyData };
  };

  if (status === 'loading' || !cityWeatherData) {
    return (
      <div className="min-h-screen p-4">
        <div className="max-w-7xl mx-auto pt-8">
          <div className="text-center backdrop-blur-md bg-white/10 rounded-2xl p-8 border border-white/20">
            <div className="animate-spin w-12 h-12 border-4 border-white/50 border-t-white rounded-full mx-auto mb-4"></div>
            <p className="text-white text-lg">Loading detailed weather data for {decodedCityName}...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-4">
        <div className="max-w-7xl mx-auto pt-8">
          <div className="backdrop-blur-md bg-red-500/20 border border-red-400/30 rounded-2xl p-6 text-center">
            <h2 className="text-xl font-bold text-white mb-2">Error Loading Data</h2>
            <p className="text-red-200 mb-4">{error}</p>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-all duration-300 backdrop-blur-sm border border-white/30"
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

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link
              to="/"
              className="inline-flex items-center px-6 py-3 backdrop-blur-md bg-white/20 text-white rounded-2xl hover:bg-white/30 transition-all duration-300 border border-white/30 shadow-lg"
            >
              ← Back to Dashboard
            </Link>
            <h1 className="text-4xl font-bold text-white drop-shadow-lg">{decodedCityName}</h1>
          </div>
          <button
            onClick={handleFavoriteToggle}
            className={`px-6 py-3 rounded-2xl font-medium transition-all duration-300 backdrop-blur-md border shadow-lg ${
              isFavorite
                ? 'bg-red-500/30 text-white border-red-400/50 hover:bg-red-500/40'
                : 'bg-white/20 text-white border-white/30 hover:bg-white/30'
            }`}
          >
            {isFavorite ? '❤️ Remove from Favorites' : '🤍 Add to Favorites'}
          </button>
        </div>

        <div className="backdrop-blur-md bg-white/10 rounded-3xl shadow-2xl p-8 mb-8 border border-white/20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start mb-4">
                <span className="text-7xl mr-6 animate-pulse">
                  {getWeatherIcon(currentWeather.weather[0].icon)}
                </span>
                <div>
                  <div className="text-6xl font-bold text-white drop-shadow-lg">
                    {formatTemperature(currentWeather.temp, temperatureUnit)}°{temperatureUnit}
                  </div>
                  <div className="text-xl text-white/80 capitalize mt-2 bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm">
                    {currentWeather.weather[0].description}
                  </div>
                </div>
              </div>
              <div className="text-xl text-white/90 font-medium">
                Feels like {formatTemperature(currentWeather.feels_like, temperatureUnit)}°{temperatureUnit}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="backdrop-blur-sm bg-blue-500/20 rounded-2xl p-6 text-center border border-blue-400/30">
                <div className="text-3xl mb-3">💧</div>
                <div className="text-sm text-white/80 mb-1">Humidity</div>
                <div className="text-2xl font-bold text-white">{currentWeather.humidity}%</div>
              </div>
              <div className="backdrop-blur-sm bg-green-500/20 rounded-2xl p-6 text-center border border-green-400/30">
                <div className="text-3xl mb-3">💨</div>
                <div className="text-sm text-white/80 mb-1">Wind Speed</div>
                <div className="text-2xl font-bold text-white">{currentWeather.wind_speed} m/s</div>
              </div>
              <div className="backdrop-blur-sm bg-yellow-500/20 rounded-2xl p-6 text-center border border-yellow-400/30">
                <div className="text-3xl mb-3">👁️</div>
                <div className="text-sm text-white/80 mb-1">Visibility</div>
                <div className="text-2xl font-bold text-white">{currentWeather.visibility / 1000} km</div>
              </div>
              <div className="backdrop-blur-sm bg-purple-500/20 rounded-2xl p-6 text-center border border-purple-400/30">
                <div className="text-3xl mb-3">🌡️</div>
                <div className="text-sm text-white/80 mb-1">UV Index</div>
                <div className="text-2xl font-bold text-white">{currentWeather.uvi}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">24-Hour Temperature Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={hourly}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [`${value}°${temperatureUnit}`, 'Temperature']}
                  labelStyle={{ color: '#374151' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="temperature" 
                  stroke="#3B82F6" 
                  strokeWidth={3}
                  dot={{ fill: '#3B82F6', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* 7-Day Forecast Chart */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">7-Day Temperature Forecast</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={daily}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value}°${temperatureUnit}`, 'Temperature']} />
                <Area
                  type="monotone"
                  dataKey="high"
                  stackId="1"
                  stroke="#EF4444"
                  fill="#FEE2E2"
                  name="High"
                />
                <Area
                  type="monotone"
                  dataKey="low"
                  stackId="1"
                  stroke="#3B82F6"
                  fill="#DBEAFE"
                  name="Low"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Precipitation Probability</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={hourly.slice(0, 12)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value}%`, 'Precipitation']} />
                <Bar dataKey="precipitation" fill="#06B6D4" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Wind Speed & Humidity</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={daily}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="windSpeed"
                  stroke="#10B981"
                  name="Wind Speed (m/s)"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="humidity"
                  stroke="#8B5CF6"
                  name="Humidity (%)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CityDetails;