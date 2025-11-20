// frontend/src/api/logs.js
// Ensure this uses the API client we created at frontend/src/api.js
import api from "../api";

export function fetchLogs(params = {}) {
  // Backend expects /api/logs — keep the /api prefix so requests go to Render
  return api.get("/api/logs", { params });
}
