require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');

// Initialize the Express application that hosts the mobile API.
const app = express();
app.set('trust proxy', 1); // needed behind Render's reverse proxy
app.use(cors()); // mobile app clients don't send an Origin header, so this is safe wide-open
// Configure cross-origin access and JSON parsing before routes consume requests.
app.use(express.json());

// Register public authentication and JWT-protected task route groups.
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 5000;

// Connect before accepting traffic so routes operate only with a ready database.
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    // Start listening only after MongoDB initializes successfully.
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  });
