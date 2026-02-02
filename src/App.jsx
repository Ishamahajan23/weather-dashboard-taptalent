import React, { useEffect } from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase/config";
import { setUser, signOut } from "./features/authSlice";
import { loadAllUserData } from "./firebase/firestore";
import { loadFavoritesFromCloud } from "./features/favoritesSlice";
import { loadSettingsFromCloud } from "./features/settingsSlice";
import Dashboard from "./page/Dashboard";
import CityDetails from "./page/CityDetails";
import Settings from "./page/Settings";
import Navbar from "./components/Navbar";

function App() {
  const dispatch = useDispatch();
  const { theme } = useSelector((state) => state.settings);
  const isDark = theme === "dark";

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userData = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
        };
        dispatch(setUser(userData));

        const cloudData = await loadAllUserData(user.uid);
        if (cloudData) {
          if (cloudData.favorites) {
            dispatch(loadFavoritesFromCloud(cloudData.favorites));
          }
          if (cloudData.settings) {
            dispatch(loadSettingsFromCloud(cloudData.settings));
          }
        }
      } else {
        dispatch(signOut());
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  return (
    <div
      className={`min-h-screen relative overflow-hidden transition-colors duration-500 ${
        isDark
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
          : "bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"
      }`}
    >
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
