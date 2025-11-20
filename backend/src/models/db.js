// src/models/db.js (fixed for lowdb v6+ that requires default data)
const { Low } = require('lowdb');
const { JSONFile } = require('lowdb/node');
const path = require('path');
const fs = require('fs');

// Path to db.json file
const DB_PATH = path.join(__dirname, '../../db.json');

// Ensure db.json exists on disk (so adapter can read it)
if (!fs.existsSync(DB_PATH)) {
  fs.writeFileSync(DB_PATH, JSON.stringify({ tasks: [], logs: [] }, null, 2));
}

const adapter = new JSONFile(DB_PATH);

// Provide default data object as second argument per lowdb v6+ requirement
const defaultData = { tasks: [], logs: [] };
const db = new Low(adapter, defaultData);

// Initialize database defaults (safe to call multiple times)
async function initDB() {
  await db.read();
  // If adapter didn't set data, apply defaults
  db.data = db.data || defaultData;
  await db.write();
}

module.exports = { db, initDB };
