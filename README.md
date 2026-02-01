# Weather Dashboard

A modern, responsive weather application built with React and Firebase. Get real-time weather updates, manage favorite cities, and sync your preferences across devices.

## Features

- **Real-time Weather Data** - Current conditions and detailed forecasts
- **City Search** - Find weather for any location worldwide
- **Favorites Management** - Save and organize your favorite cities
- **Interactive Charts** - Visualize temperature, humidity, precipitation, and wind speed
- **Dark/Light Mode** - Switch between themes
- **User Authentication** - Sign in with Google to sync data across devices
- **Cloud Sync** - Automatically save favorites and settings to the cloud
- **Responsive Design** - Works seamlessly on mobile, tablet, and desktop

## Tech Stack

- React 19
- Redux Toolkit
- Firebase (Auth & Firestore)
- Recharts
- React Router
- Tailwind CSS
- Vite

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- OpenWeatherMap API key
- Firebase project

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd weather-dashboard-taptalent
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env` file in the root directory with your API keys:
```env
VITE_WEATHER_API_KEY=your_openweathermap_api_key
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
```

4. Start the development server
```bash
npm run dev
```

5. Open [http://localhost:5173](http://localhost:5173) in your browser

## Build for Production

```bash
npm run build
```

The production build will be in the `dist` folder.

## Usage

1. **Search for Cities** - Use the search bar to find any city
2. **Add Favorites** - Click the heart icon to save cities
3. **View Details** - Click on a city card to see detailed weather info and charts
4. **Sign In** - Sign in with Google to sync your data across devices
5. **Customize** - Switch between Celsius/Fahrenheit and dark/light themes

## License

MIT
