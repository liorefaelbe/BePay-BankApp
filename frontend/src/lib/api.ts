import axios from "axios";
import { getToken } from "./storage";

const baseURL = import.meta.env.VITE_API_BASE_URL || "/api";

// Create an Axios instance with default settings
// Axios is an HTTP client library for making requests, similar to fetch but with more features.
export const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Attach Bearer token when present.
 * Note: if you later switch to cookie-based auth, remove this and enable withCredentials.
 */
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
