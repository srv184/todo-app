import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../config';

// Backend URL is controlled from src/config.ts (dev vs prod switch lives there).
export const BASE_URL = API_BASE_URL;

// Generous timeout: Render's free tier sleeps after 15 min idle and takes
// 30-60s to wake on the first request after that. Don't lower this for prod.
export const api = axios.create({ baseURL: BASE_URL, timeout: 60000 });

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
