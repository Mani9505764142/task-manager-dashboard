import api from "./apiClient";

export function fetchLogs(params = {}) {
  return api.get("/logs", { params });
}
