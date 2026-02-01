const API_KEY = import.meta.env.VITE_WEATHER_API_KEY; 
const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const GEO_URL = 'https://api.openweathermap.org/geo/1.0';

export const weatherAPI = {
  getCurrentWeather: async (cityName) => {
    try {
      const response = await fetch(`${BASE_URL}/weather?q=${cityName}&appid=${API_KEY}&units=metric`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
      
    } catch (error) {
      throw new Error(`Failed to fetch weather for ${cityName}: ${error.message}`);
    }
  },

  getDetailedWeather: async (lat, lon) => {
    try {
      const [currentResponse, forecastResponse] = await Promise.all([
        fetch(`${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`),
        fetch(`${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`)
      ]);

      if (!currentResponse.ok || !forecastResponse.ok) {
        throw new Error(`HTTP error! Current: ${currentResponse.status}, Forecast: ${forecastResponse.status}`);
      }

      const currentData = await currentResponse.json();
      const forecastData = await forecastResponse.json();

      const transformedData = {
        current: {
          temp: currentData.main.temp,
          feels_like: currentData.main.feels_like,
          humidity: currentData.main.humidity,
          pressure: currentData.main.pressure,
          visibility: currentData.visibility || 10000,
          uvi: 5, 
          wind_speed: currentData.wind.speed,
          wind_deg: currentData.wind.deg,
          weather: currentData.weather
        },
        hourly: forecastData.list.slice(0, 24).map(item => ({
          dt: item.dt,
          temp: item.main.temp,
          weather: item.weather,
          pop: item.pop || 0
        })),
        daily: [] 
      };

      const dailyMap = {};
      forecastData.list.forEach(item => {
        const date = new Date(item.dt * 1000).toDateString();
        if (!dailyMap[date]) {
          dailyMap[date] = {
            dt: item.dt,
            temp: { min: item.main.temp, max: item.main.temp, day: item.main.temp },
            weather: item.weather,
            humidity: item.main.humidity,
            wind_speed: currentData.wind.speed,
            pop: item.pop || 0
          };
        } else {
          dailyMap[date].temp.min = Math.min(dailyMap[date].temp.min, item.main.temp);
          dailyMap[date].temp.max = Math.max(dailyMap[date].temp.max, item.main.temp);
        }
      });
      
      transformedData.daily = Object.values(dailyMap).slice(0, 7);
      return transformedData;
      
    } catch (error) {
      throw new Error(`Failed to fetch detailed weather: ${error.message}`);
    }
  },

  searchCities: async (query) => {
    try {
      const response = await fetch(`${GEO_URL}/direct?q=${query}&limit=5&appid=${API_KEY}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error(`Failed to search cities: ${error.message}`);
    }
  },

  getCoordinates: async (cityName) => {
    try {
      const response = await fetch(`${GEO_URL}/direct?q=${cityName}&limit=1&appid=${API_KEY}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data[0] || { lat: 0, lon: 0 };
      
    } catch (error) {
      throw new Error(`Failed to fetch coordinates for ${cityName}: ${error.message}`);
    }
  }
};

export const formatTemperature = (temp, unit = 'C') => {
  if (unit === 'F') {
    return Math.round((temp * 9/5) + 32);
  }
  return Math.round(temp);
};

export const getWeatherIcon = (iconCode) => {
  const iconMap = {
    '01d': '☀️', '01n': '🌙',
    '02d': '⛅', '02n': '☁️',
    '03d': '☁️', '03n': '☁️',
    '04d': '☁️', '04n': '☁️',
    '09d': '🌧️', '09n': '🌧️',
    '10d': '🌦️', '10n': '🌧️',
    '11d': '⛈️', '11n': '⛈️',
    '13d': '❄️', '13n': '❄️',
    '50d': '🌫️', '50n': '🌫️'
  };
  return iconMap[iconCode] || '🌤️';
};