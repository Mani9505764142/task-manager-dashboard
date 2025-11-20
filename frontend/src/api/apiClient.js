import axios from "axios";

// Your backend credentials (Basic Auth)
const USERNAME = "admin";
const PASSWORD = "password123";

// Encode to base64: admin:password123
const basicAuthToken = btoa(`${USERNAME}:${PASSWORD}`);

const api = axios.create({
  baseURL: "/api", // vite proxy will redirect this to http://localhost:4000/api
  headers: {
    "Content-Type": "application/json",
    Authorization: `Basic ${basicAuthToken}`,
  },
});

// Optional: Add interceptor for errors (useful for debugging)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error?.response || error);
    return Promise.reject(error);
  }
);

export default api;
