// src/routes/logs.js
const express = require('express');
const router = express.Router();

const { listLogs } = require('../controllers/logsController');
const { queryListRules, handleValidation } = require('../middlewares/validators');

// GET /api/logs (list + filters)
router.get('/', queryListRules, handleValidation, listLogs);

module.exports = router;
