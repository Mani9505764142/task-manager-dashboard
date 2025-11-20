// server.js — entry point
const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(express.json());

// ----------------------------------------------------
// CORS SETUP  ✅
// ----------------------------------------------------
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:5173';

app.use(
  cors({
    origin: FRONTEND_ORIGIN,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

// ----------------------------------------------------
// BASIC AUTH (OPTIONAL) — loads only if file exists
// ----------------------------------------------------
let requireBasicAuth = null;
try {
  requireBasicAuth = require('./src/middlewares/auth').requireBasicAuth;
} catch (err) {
  console.warn(
    '[WARN] auth middleware not found. API routes will not require login locally.'
  );
}

// Protect /api routes only if middleware exists
if (requireBasicAuth) {
  app.use('/api', requireBasicAuth);
}

// ----------------------------------------------------
// ROUTES: TASKS + LOGS
// ----------------------------------------------------
try {
  const tasksRouter = require('./src/routes/tasks');
  app.use('/api/tasks', tasksRouter);
} catch (err) {
  app.use('/api/tasks', (req, res) => {
    res.status(501).json({
      error: 'Tasks routes not implemented. Create src/routes/tasks.js',
    });
  });
}

try {
  const logsRouter = require('./src/routes/logs');
  app.use('/api/logs', logsRouter);
} catch (err) {
  app.use('/api/logs', (req, res) => {
    res.status(501).json({
      error: 'Logs routes not implemented. Create src/routes/logs.js',
    });
  });
}

// ----------------------------------------------------
// HEALTH CHECK & ROOT
// ----------------------------------------------------
app.get('/health', (req, res) => {
  res.json({ ok: true, time: new Date().toISOString() });
});

app.get('/', (req, res) => {
  res.send(`
    <h2>Task Manager API</h2>
    <p>Server running on port ${process.env.PORT || 4000}</p>
    <p>Available endpoints:</p>
    <ul>
      <li>GET /health</li>
      <li>GET /api/tasks</li>
      <li>GET /api/logs</li>
    </ul>
  `);
});

// ----------------------------------------------------
// GLOBAL ERROR HANDLER
// ----------------------------------------------------
app.use((err, req, res, next) => {
  console.error('Server error:', err?.stack || err);
  res.status(500).json({ error: 'Internal server error' });
});

// ----------------------------------------------------
// START SERVER
// ----------------------------------------------------
const PORT = process.env.PORT || 4000;
app.listen(PORT, () =>
  console.log(`Task Manager API listening on port ${PORT}`)
);
