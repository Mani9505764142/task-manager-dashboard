// src/utils/audit.js
const { nanoid } = require('nanoid');
const { db } = require('../models/db');

function currentTimestamp() {
  return new Date().toISOString();
}

/**
 * addAudit({ action, taskId, updatedContent, notes })
 * - action: "Create Task" | "Update Task" | "Delete Task"
 * - taskId: number|null
 * - updatedContent: object|null (for Create -> full object, Update -> changed fields, Delete -> null)
 * - notes: optional string
 *
 * The function prepends the new log entry so newest entries appear first.
 */
async function addAudit({ action, taskId = null, updatedContent = null, notes = null }) {
  await db.read();
  const entry = {
    id: nanoid(),
    timestamp: currentTimestamp(),
    action,
    taskId,
    updatedContent: updatedContent || null,
    notes: notes || null
  };

  // ensure logs array exists
  db.data.logs = db.data.logs || [];
  db.data.logs.unshift(entry);
  await db.write();
  return entry;
}

module.exports = { addAudit, currentTimestamp };
