import api from "./apiClient";

// GET /api/tasks?page=&limit=&q=
export function fetchTasks(params = {}) {
  return api.get("/tasks", { params });
}

// POST /api/tasks
export function createTask(data) {
  return api.post("/tasks", data);
}

// PUT /api/tasks/:id
export function updateTask(id, data) {
  return api.put(`/tasks/${id}`, data);
}

// DELETE /api/tasks/:id
export function deleteTask(id) {
  return api.delete(`/tasks/${id}`);
}
