const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true, default: '' },
    dateTime: { type: Date, required: true }, // when the task is scheduled/created for
    deadline: { type: Date, required: true },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    category: { type: String, trim: true, default: 'General' }, // bonus: categories/tags
    tags: [{ type: String, trim: true }],
    completed: { type: Boolean, default: false },
    // Creative feature 1: Smart Priority Score, precomputed & stored for fast sorting/filtering
    priorityScore: { type: Number, default: 0 },
    // Creative feature 2: cumulative focus time logged via in-app Focus Mode (minutes)
    focusMinutes: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Task', taskSchema);
