// frontend/src/api/logs.js
import api from "../api.js";

export function fetchLogs(params = {}) {
  return api.get("/api/logs", { params });
}
