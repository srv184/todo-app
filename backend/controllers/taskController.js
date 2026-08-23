const Task = require('../models/Task');
const { computePriorityScore } = require('../utils/priorityScore');

exports.createTask = async (req, res) => {
  try {
    const { title, description, dateTime, deadline, priority, category, tags } = req.body;
    if (!title || !dateTime || !deadline) {
      return res.status(400).json({ message: 'title, dateTime and deadline are required' });
    }
    const priorityScore = computePriorityScore({ priority, deadline, completed: false });

    const task = await Task.create({
      user: req.userId,
      title,
      description,
      dateTime,
      deadline,
      priority,
      category,
      tags,
      priorityScore,
    });
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create task', error: err.message });
  }
};

exports.getTasks = async (req, res) => {
  try {
    const { sortBy = 'smart', category, completed } = req.query;
    const filter = { user: req.userId };
    if (category) filter.category = category;
    if (completed !== undefined) filter.completed = completed === 'true';

    let tasks = await Task.find(filter).lean();

    // Refresh priority score at read-time so urgency reflects "now", not creation time
    tasks = tasks.map((t) => ({
      ...t,
      priorityScore: computePriorityScore(t),
    }));

    // Bonus: sort/filter algorithm mixing time, deadline and priority
    if (sortBy === 'smart') {
      tasks.sort((a, b) => b.priorityScore - a.priorityScore);
    } else if (sortBy === 'deadline') {
      tasks.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
    } else if (sortBy === 'priority') {
      const order = { high: 0, medium: 1, low: 2 };
      tasks.sort((a, b) => order[a.priority] - order[b.priority]);
    }

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch tasks', error: err.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.userId });
    if (!task) return res.status(404).json({ message: 'Task not found' });

    Object.assign(task, req.body);
    task.priorityScore = computePriorityScore(task);
    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update task', error: err.message });
  }
};

exports.toggleComplete = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.userId });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    task.completed = !task.completed;
    task.priorityScore = computePriorityScore(task);
    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update task', error: err.message });
  }
};

// Creative Feature 2: log focus-session minutes against a task (from Focus Mode timer)
exports.logFocusMinutes = async (req, res) => {
  try {
    const { minutes } = req.body;
    const task = await Task.findOne({ _id: req.params.id, user: req.userId });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    task.focusMinutes += Number(minutes) || 0;
    await task.save();
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: 'Failed to log focus time', error: err.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete task', error: err.message });
  }
};
