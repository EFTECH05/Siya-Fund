import { ProfileChanges } from "../models/User";
import { getUserProfile, logoutUser, updateUserProfile } from "../services/AuthService";

export const loadProfile = getUserProfile;
export const saveProfile = (changes: ProfileChanges) => updateUserProfile(changes);
export const logout = logoutUser;
