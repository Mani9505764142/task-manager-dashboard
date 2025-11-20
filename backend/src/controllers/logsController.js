// src/controllers/logsController.js
const { db } = require('../models/db');

/**
 * GET /api/logs
 * Query: page (default 1), limit (default 10), action, taskId
 */
async function listLogs(req, res) {
  await db.read();
  let { page = 1, limit = 10, action, taskId } = req.query;
  page = Number(page) || 1;
  limit = Number(limit) || 10;

  let items = Array.isArray(db.data.logs) ? [...db.data.logs] : [];

  if (action) {
    const a = String(action).toLowerCase();
    items = items.filter(l => String(l.action).toLowerCase() === a);
  }

  if (taskId !== undefined && taskId !== null && String(taskId).trim() !== '') {
    items = items.filter(l => Number(l.taskId) === Number(taskId));
  }

  const total = items.length;
  const start = (page - 1) * limit;
  const paged = items.slice(start, start + limit);

  return res.json({
    meta: { total, page, limit, pages: Math.ceil(total / limit) },
    data: paged
  });
}

module.exports = { listLogs };
