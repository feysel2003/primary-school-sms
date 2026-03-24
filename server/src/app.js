const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/v1/authRoutes'); // <-- Import  routes
const studentRoutes = require('./routes/v1/studentRoutes'); // <-- Import it
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/v1/auth', authRoutes); // <-- Connect the routes here!

app.get('/api/health', (req, res) => {
  res.json({ status: 'success', message: 'Ethiopian SMS API is running!' });
});

// Add it to our app
app.use('/api/v1/students', studentRoutes); // <-- Connect it!

module.exports = app;