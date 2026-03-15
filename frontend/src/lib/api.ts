import axios from "axios";
import { getToken } from "./storage";

const baseURL = import.meta.env.VITE_API_BASE_URL || "/api";

// Create an Axios instance with default settings
<<<<<<< HEAD
// Axios is an HTTP client library for making requests, similar to fetch but with more features.
=======
>>>>>>> 3021c2567a6c53da578b52677e4f94c9ea73a29f
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
