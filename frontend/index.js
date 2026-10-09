
const { LogBox } = require("react-native");

// Suppress React Native LogBox notifications.
LogBox.ignoreAllLogs(true);

// Load Expo Router after configuring LogBox.
require("expo-router/entry");