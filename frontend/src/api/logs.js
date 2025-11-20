// frontend/src/api/logs.js
import api from "../api.js";   // <- explicitly point to src/api.js
export function fetchLogs(params = {}) {
  return api.get("/api/logs", { params });
}
