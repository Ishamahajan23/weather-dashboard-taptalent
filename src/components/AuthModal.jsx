import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signInWithPopup, signOut as firebaseSignOut } from "firebase/auth";
import { auth, googleProvider } from "../firebase/config";
import { setUser, signOut, setError } from "../features/authSlice";
import {
  loadAllUserData,
  syncFavoritesToFirestore,
  syncSettingsToFirestore,
} from "../firebase/firestore";
import { LogIn, LogOut, X } from "lucide-react";

const AuthModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { theme } = useSelector((state) => state.settings);
  const { cities: favorites } = useSelector((state) => state.favorites);
  const settings = useSelector((state) => state.settings);
  const [isLoading, setIsLoading] = useState(false);
  const isDark = theme === "dark";

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const userData = {
        uid: result.user.uid,
        email: result.user.email,
        displayName: result.user.displayName,
        photoURL: result.user.photoURL,
      };

      dispatch(setUser(userData));

      await loadAllUserData(result.user.uid);

      if (favorites && favorites.length > 0) {
        await syncFavoritesToFirestore(result.user.uid, favorites);
      }
      if (settings) {
        await syncSettingsToFirestore(result.user.uid, settings);
      }

      onClose();
    } catch (error) {
      console.error("Error signing in with Google:", error);
      dispatch(setError(error.message));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      if (user?.uid) {
        await syncFavoritesToFirestore(user.uid, favorites);
        await syncSettingsToFirestore(user.uid, settings);
      }

      await firebaseSignOut(auth);
      dispatch(signOut());
      onClose();
    } catch (error) {
      console.error("Error signing out:", error);
      dispatch(setError(error.message));
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div
        className={`relative w-full max-w-md rounded-2xl shadow-2xl border ${
          isDark
            ? "bg-gray-800/95 border-gray-700/50"
            : "bg-white/95 border-gray-200/50"
        }`}
      >
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 p-2 rounded-lg transition-all ${
            isDark
              ? "hover:bg-gray-700 text-gray-400 hover:text-white"
              : "hover:bg-gray-100 text-gray-600 hover:text-gray-900"
          }`}
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8">
          {!isAuthenticated ? (
            <>
              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <LogIn className="w-8 h-8 text-white" />
                </div>
                <h2
                  className={`text-2xl font-bold mb-2 ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  Sign In to Sync
                </h2>
                <p
                  className={`text-sm ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Save your favorites and settings across all devices
                </p>
              </div>

              <div className="space-y-4">
                <button
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                  className={`w-full flex items-center justify-center gap-3 px-6 py-3 rounded-xl font-medium transition-all duration-300 border ${
                    isDark
                      ? "bg-white text-gray-900 border-white hover:bg-gray-100"
                      : "bg-white text-gray-900 border-gray-300 hover:bg-gray-50"
                  } disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 shadow-lg`}
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-gray-400 border-t-gray-900 rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                      <span>Continue with Google</span>
                    </>
                  )}
                </button>

                <div
                  className={`text-xs text-center ${isDark ? "text-gray-500" : "text-gray-500"}`}
                >
                  By signing in, you agree to sync your data with our secure
                  cloud storage
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="text-center mb-6">
                <div className="relative w-20 h-20 mx-auto mb-4">
                  {user?.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName}
                      className="w-full h-full rounded-full border-4 border-blue-500"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                      {user?.displayName?.charAt(0) ||
                        user?.email?.charAt(0) ||
                        "U"}
                    </div>
                  )}
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                <h2
                  className={`text-xl font-bold mb-1 ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  {user?.displayName || "User"}
                </h2>
                <p
                  className={`text-sm ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {user?.email}
                </p>
              </div>

              <div
                className={`rounded-xl p-4 mb-6 ${
                  isDark
                    ? "bg-green-500/10 border border-green-500/20"
                    : "bg-green-50 border border-green-200"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  <span
                    className={`text-sm font-medium ${isDark ? "text-green-400" : "text-green-700"}`}
                  >
                    Synced to Cloud
                  </span>
                </div>
                <p
                  className={`text-xs ${isDark ? "text-green-300/70" : "text-green-600"}`}
                >
                  Your favorites and settings are automatically saved
                </p>
              </div>

              <button
                onClick={handleSignOut}
                disabled={isLoading}
                className={`w-full flex items-center justify-center gap-3 px-6 py-3 rounded-xl font-medium transition-all duration-300 border ${
                  isDark
                    ? "bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20"
                    : "bg-red-50 text-red-600 border-red-200 hover:bg-red-100"
                } disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105`}
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-red-400 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <LogOut className="w-5 h-5" />
                    <span>Sign Out</span>
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
