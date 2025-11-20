// frontend/src/api.js
import axios from "axios";

const BASE = import.meta.env.VITE_API_URL || "";

const api = axios.create({
  baseURL: BASE,
  timeout: 10000,
  headers: { "Content-Type": "application/json" }
});

const user = import.meta.env.VITE_AUTH_USER;
const pass = import.meta.env.VITE_AUTH_PASS;
if (user && pass) {
  const token =
    typeof window !== "undefined"
      ? btoa(`${user}:${pass}`)
      : Buffer.from(`${user}:${pass}`).toString("base64");
  api.defaults.headers.common["Authorization"] = `Basic ${token}`;
}

export default api;
