// src/middlewares/auth.js
const basicAuth = require('basic-auth');

const AUTH_USER = process.env.AUTH_USER || 'admin';
const AUTH_PASS = process.env.AUTH_PASS || 'password123';

function requireBasicAuth(req, res, next) {
  const credentials = basicAuth(req);
  if (!credentials || credentials.name !== AUTH_USER || credentials.pass !== AUTH_PASS) {
    // Force browser to prompt for credentials and return consistent error JSON
    res.set('WWW-Authenticate', 'Basic realm="TaskManager"');
    return res.status(401).json({ error: 'Unauthorized access. Please provide valid credentials.' });
  }
  return next();
}

module.exports = { requireBasicAuth };
