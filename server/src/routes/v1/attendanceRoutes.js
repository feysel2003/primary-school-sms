const express = require('express');
const { saveAttendance, getParentAttendance } = require('../../controllers/attendanceController');
const { verifyToken } = require('../../middlewares/auth');

const router = express.Router();

// POST request to save attendance (Protected by JWT)
router.post('/', verifyToken, saveAttendance);
// GET request to view attendance (Parent)
router.get('/parent', verifyToken, getParentAttendance);

module.exports = router;