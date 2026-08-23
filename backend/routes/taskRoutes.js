const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  createTask,
  getTasks,
  updateTask,
  toggleComplete,
  deleteTask,
  logFocusMinutes,
} = require('../controllers/taskController');

router.use(auth); // every task route requires a valid JWT

router.post('/', createTask);
router.get('/', getTasks);
router.patch('/:id', updateTask);
router.patch('/:id/toggle', toggleComplete);
router.patch('/:id/focus', logFocusMinutes);
router.delete('/:id', deleteTask);

module.exports = router;
