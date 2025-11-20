// src/controllers/tasksController.js
const sanitizeHtml = require('sanitize-html');
const { db } = require('../models/db');
const { addAudit, currentTimestamp } = require('../utils/audit');

/**
 * Helper: sanitize input and trim to max length
 */
function sanitizeInput(value, max = 500) {
  if (typeof value !== 'string') return '';
  return sanitizeHtml(value, { allowedTags: [], allowedAttributes: {} }).trim().slice(0, max);
}

/**
 * GET /api/tasks
 * Query: page (default 1), limit (default 5), q (search), sort (e.g., -createdAt)
 */
async function listTasks(req, res) {
  await db.read();
  let { page = 1, limit = 5, q = '', sort = '-createdAt' } = req.query;
  page = Number(page) || 1;
  limit = Number(limit) || 5;

  let items = Array.isArray(db.data.tasks) ? [...db.data.tasks] : [];

  if (q && String(q).trim()) {
    const s = String(q).trim().toLowerCase();
    items = items.filter(t =>
      (t.title && t.title.toLowerCase().includes(s)) ||
      (t.description && t.description.toLowerCase().includes(s))
    );
  }

  // Sorting
  const sortKey = String(sort || '-createdAt');
  const key = sortKey.startsWith('-') ? sortKey.slice(1) : sortKey;
  const desc = sortKey.startsWith('-');

  items.sort((a, b) => {
    const A = a[key] || '';
    const B = b[key] || '';
    if (key === 'createdAt') {
      return desc ? (new Date(B) - new Date(A)) : (new Date(A) - new Date(B));
    }
    return desc ? (B.toString().localeCompare(A.toString())) : (A.toString().localeCompare(B.toString()));
  });

  const total = items.length;
  const start = (page - 1) * limit;
  const paged = items.slice(start, start + limit);

  return res.json({
    meta: { total, page, limit, pages: Math.ceil(total / limit) },
    data: paged
  });
}

/**
 * POST /api/tasks
 * Body: { title, description }
 */
async function createTask(req, res) {
  await db.read();

  const rawTitle = req.body.title;
  const rawDesc = req.body.description;

  const title = sanitizeInput(rawTitle, 100);
  const description = sanitizeInput(rawDesc, 500);

  if (!title || !description) {
    return res.status(400).json({ error: 'Title and description must not be empty after sanitization' });
  }

  const newId = db.data.tasks.length ? Math.max(...db.data.tasks.map(t => Number(t.id))) + 1 : 1;
  const newTask = {
    id: newId,
    title,
    description,
    createdAt: currentTimestamp()
  };

  db.data.tasks.unshift(newTask);
  await db.write();

  // Audit log: include full object for Create
  await addAudit({ action: 'Create Task', taskId: newTask.id, updatedContent: { ...newTask } });

  return res.status(201).json({ message: 'Task created', data: newTask });
}

/**
 * PUT /api/tasks/:id
 * Body: { title?, description? }
 * Log only changed fields
 */
async function updateTask(req, res) {
  await db.read();
  const id = Number(req.params.id);
  const task = db.data.tasks.find(t => Number(t.id) === id);
  if (!task) return res.status(404).json({ error: 'Task not found' });

  const updatedFields = {};

  if (Object.prototype.hasOwnProperty.call(req.body, 'title')) {
    const t = sanitizeInput(req.body.title, 100);
    if (!t) return res.status(400).json({ error: 'Title must not be empty after sanitization' });
    if (t !== task.title) updatedFields.title = t;
  }

  if (Object.prototype.hasOwnProperty.call(req.body, 'description')) {
    const d = sanitizeInput(req.body.description, 500);
    if (!d) return res.status(400).json({ error: 'Description must not be empty after sanitization' });
    if (d !== task.description) updatedFields.description = d;
  }

  if (Object.keys(updatedFields).length === 0) {
    return res.status(400).json({ error: 'No changes detected' });
  }

  Object.assign(task, updatedFields, { updatedAt: currentTimestamp() });
  await db.write();

  // Audit log: include only changed fields
  await addAudit({ action: 'Update Task', taskId: task.id, updatedContent: updatedFields });

  return res.json({ message: 'Task updated', data: task });
}

/**
 * DELETE /api/tasks/:id
 */
async function deleteTask(req, res) {
  await db.read();
  const id = Number(req.params.id);
  const idx = db.data.tasks.findIndex(t => Number(t.id) === id);
  if (idx === -1) return res.status(404).json({ error: 'Task not found' });

  const [removed] = db.data.tasks.splice(idx, 1);
  await db.write();

  // Audit: Delete has updatedContent = null
  await addAudit({ action: 'Delete Task', taskId: id, updatedContent: null });

  return res.json({ message: 'Task deleted', data: removed });
}

module.exports = {
  listTasks,
  createTask,
  updateTask,
  deleteTask
};
