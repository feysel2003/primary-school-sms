const express = require('express');
const { getStudentsBySchool } = require('../../controllers/studentController');
const { verifyToken } = require('../../middlewares/auth'); // We will create this security guard next!

const router = express.Router();

// GET request to /api/v1/students (Protected by JWT token)
router.get('/', verifyToken, getStudentsBySchool);

module.exports = router;