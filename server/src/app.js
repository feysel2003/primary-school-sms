const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/v1/authRoutes'); // <-- Import  routes
const studentRoutes = require('./routes/v1/studentRoutes'); // <-- Import it
const attendanceRoutes = require('./routes/v1/attendanceRoutes'); // <-- Import it
const gradeRoutes = require('./routes/v1/gradeRoutes'); // <-- Import it
const moeRoutes = require('./routes/v1/moeRoutes'); // <-- Import it
const userRoutes = require('./routes/v1/userRoutes'); // <-- Import it
const tenantRoutes = require('./routes/v1/tenantRoutes'); // <-- Import it
const academicRoutes = require('./routes/v1/academicRoutes'); // <-- Import

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/v1/auth', authRoutes); // <-- Connect the routes here!

app.get('/api/health', (req, res) => {
  res.json({ status: 'success', message: 'Ethiopian SMS API is running!' });
});

app.use('/api/v1/attendance', attendanceRoutes); // <-- Connect it!
// Add it to our app
app.use('/api/v1/students', studentRoutes); // <-- Connect it!

app.use('/api/v1/grades', gradeRoutes); // <-- Connect it!

app.use('/api/v1/users', userRoutes); // <-- Connect it!

app.use('/api/v1/moe', moeRoutes); // <-- Connect it!

app.use('/api/v1/academics', academicRoutes); // <-- Connect

app.use('/api/v1/tenants', tenantRoutes);
module.exports = app;