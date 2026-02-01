import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Home, LucideSettings } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  const { temperatureUnit } = useSelector(state => state.settings);

  const navItems = [
    { path: '/', label: 'Dashboard', icon: <Home className='w-4 h-4'/> },
    { path: '/settings', label: 'Settings', icon: <LucideSettings className='w-4 h-4' /> }
  ];

  return (
    <nav className="backdrop-blur-md bg-white/10 border-b border-white/20 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-sky-400 drop-shadow-lg">
              🌤️ WeatherApp
            </h1>
            <div className="hidden md:flex space-x-4">
              {navItems.map(item => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-4 py-2 flex items-center rounded-lg text-sm font-medium transition-all duration-300 ${
                    location.pathname === item.path
                      ? 'bg-white/20 text-white shadow-lg transform scale-105'
                      : 'text-white/80 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <span className="mr-2 ">{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="backdrop-blur-sm bg-white/10 px-3 py-1 rounded-full border border-white/20">
              <span className="text-white/80 text-sm">Unit: </span>
              <span className="font-semibold text-white">°{temperatureUnit}</span>
            </div>
            <div className="backdrop-blur-sm bg-white/10 px-3 py-1 rounded-full border border-white/20">
              <span className="text-white/80 text-sm">Updated: </span>
              <span className="font-semibold text-white">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;