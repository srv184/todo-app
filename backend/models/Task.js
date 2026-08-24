const mongoose = require('mongoose');

// Define a user's task, including scheduling, ranking, and focus-tracking data.
const taskSchema = new mongoose.Schema(
  {
    user: {
      // Ownership links every task to its authenticated creator for scoped queries.
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true, default: '' },
    // Scheduled time and deadline drive calendar display and urgency calculation.
    dateTime: { type: Date, required: true }, // when the task is scheduled/created for
    deadline: { type: Date, required: true },
    priority: {
      // Explicit priority, category, and tags support user organization and ranking.
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    category: { type: String, trim: true, default: 'General' }, // bonus: categories/tags
    tags: [{ type: String, trim: true }],
    // Completion removes the task from active work and gives it a zero smart score.
    completed: { type: Boolean, default: false },
    // Creative feature 1: Smart Priority Score, precomputed & stored for fast sorting/filtering
    priorityScore: { type: Number, default: 0 },
    // Creative feature 2: cumulative focus time logged via in-app Focus Mode (minutes)
    focusMinutes: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Task', taskSchema);
