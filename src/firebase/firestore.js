import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "./config";

export const saveUserDataToFirestore = async (userId, data) => {
  try {
    const userRef = doc(db, "users", userId);
    await setDoc(userRef, data, { merge: true });
    return { success: true };
  } catch (error) {
    console.error("Error saving user data to Firestore:", error);
    return { success: false, error: error.message };
  }
};

export const loadUserDataFromFirestore = async (userId) => {
  try {
    const userRef = doc(db, "users", userId);
    const docSnap = await getDoc(userRef);

    if (docSnap.exists()) {
      return { success: true, data: docSnap.data() };
    } else {
      return { success: false, error: "No user data found" };
    }
  } catch (error) {
    console.error("Error loading user data from Firestore:", error);
    return { success: false, error: error.message };
  }
};

export const syncFavoritesToFirestore = async (userId, favorites) => {
  return saveUserDataToFirestore(userId, { favorites });
};

export const syncSettingsToFirestore = async (userId, settings) => {
  return saveUserDataToFirestore(userId, { settings });
};

export const loadAllUserData = async (userId) => {
  const result = await loadUserDataFromFirestore(userId);
  if (result.success) {
    return {
      favorites: result.data.favorites || null,
      settings: result.data.settings || null,
    };
  }
  return null;
};
