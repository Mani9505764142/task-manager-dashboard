// src/routes/tasks.js
const express = require('express');
const router = express.Router();

const {
  listTasks,
  createTask,
  updateTask,
  deleteTask
} = require('../controllers/tasksController');

const {
  taskCreateRules,
  taskUpdateRules,
  queryListRules,
  handleValidation
} = require('../middlewares/validators');

// GET /api/tasks (list + search + pagination)
router.get('/', queryListRules, handleValidation, listTasks);

// POST /api/tasks (create)
router.post('/', taskCreateRules, handleValidation, createTask);

// PUT /api/tasks/:id (update)
router.put('/:id', taskUpdateRules, handleValidation, updateTask);

// DELETE /api/tasks/:id (delete)
router.delete('/:id', deleteTask);

module.exports = router;
