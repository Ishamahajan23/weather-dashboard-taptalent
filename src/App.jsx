import React from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import Dashboard from "./page/Dashboard";
import CityDetails from "./page/CityDetails";
import Settings from "./page/Settings";
import Navbar from "./components/Navbar";

function App() {
  const { theme } = useSelector((state) => state.settings);
  const isDark = theme === "dark";

  return (
    <div
      className={`min-h-screen relative overflow-hidden transition-colors duration-500 ${
        isDark
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
          : "bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"
      }`}
    >
      {/* Animated background elements */}
      <div
        className={`absolute inset-0 transition-opacity duration-500 ${
          isDark
            ? "bg-gradient-to-br from-blue-900/10 via-purple-900/10 to-pink-900/10"
            : "bg-gradient-to-br from-sky-400/10 via-blue-500/10 to-purple-600/10"
        }`}
      ></div>

      <div className="absolute top-0 left-0 w-full h-full opacity-30">
        <div
          className={`absolute top-10 left-10 w-72 h-72 rounded-full blur-3xl transition-colors duration-1000 ${
            isDark ? "bg-blue-600/20" : "bg-white/40"
          }`}
        ></div>
        <div
          className={`absolute top-40 right-20 w-96 h-96 rounded-full blur-3xl transition-colors duration-1000 ${
            isDark ? "bg-purple-600/20" : "bg-blue-400/20"
          }`}
        ></div>
        <div
          className={`absolute bottom-20 left-1/3 w-80 h-80 rounded-full blur-3xl transition-colors duration-1000 ${
            isDark ? "bg-pink-600/20" : "bg-purple-400/20"
          }`}
        ></div>
      </div>

      <div className="relative z-10">
        <Navbar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/city/:cityName" element={<CityDetails />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
