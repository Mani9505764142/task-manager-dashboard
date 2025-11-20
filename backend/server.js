// server.js — entry point
const express = require('express');
const path = require('path');

const app = express();
app.use(express.json());

// Try to load Basic Auth middleware if present (safe if file not created yet)
let requireBasicAuth = null;
try {
  requireBasicAuth = require('./src/middlewares/auth').requireBasicAuth;
} catch (err) {
  // middleware not present yet — we'll allow requests but warn in console
  console.warn('[WARN] auth middleware not found. API routes will be unprotected until you create src/middlewares/auth.js');
}

// If auth middleware exists, protect /api/* routes
if (requireBasicAuth) {
  app.use('/api', requireBasicAuth);
}

// Try to mount tasks and logs routers if they exist — otherwise mount placeholder handlers
try {
  const tasksRouter = require('./src/routes/tasks');
  app.use('/api/tasks', tasksRouter);
} catch (err) {
  app.use('/api/tasks', (req, res) => {
    res.status(501).json({ error: 'Tasks routes not implemented yet. Create src/routes/tasks.js' });
  });
}

try {
  const logsRouter = require('./src/routes/logs');
  app.use('/api/logs', logsRouter);
} catch (err) {
  app.use('/api/logs', (req, res) => {
    res.status(501).json({ error: 'Logs routes not implemented yet. Create src/routes/logs.js' });
  });
}

// Health check
app.get('/health', (req, res) => {
  res.json({ ok: true, time: new Date().toISOString() });
});

// Root info (helpful when you open the API in a browser)
app.get('/', (req, res) => {
  res.send(
    `<h2>Task Manager API</h2>
     <p>Server running. Available endpoints (placeholders until routes are created):</p>
     <ul>
       <li>GET /health</li>
       <li>/api/tasks</li>
       <li>/api/logs</li>
     </ul>
     <p>Next: create auth middleware, models, controllers, and routes in <code>src/</code>.</p>`
  );
});

// Generic error handler — do not leak stack traces to clients
app.use((err, req, res, next) => {
  console.error('Server error:', err && err.stack ? err.stack : err);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Task Manager API listening on port ${PORT}`));
