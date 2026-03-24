const express = require('express');
const { getStudentsBySchool, getSetupData, registerStudent } = require('../../controllers/studentController');
const { verifyToken } = require('../../middlewares/auth');
const { authorizeRoles } = require('../../middlewares/roleCheck');

const router = express.Router();

// GET: Teacher fetches students for roll call
router.get('/', verifyToken, authorizeRoles('TEACHER', 'SCHOOL_ADMIN'), getStudentsBySchool);

// GET: Admin fetches school setup data (Years, Grades, Sections)
router.get('/setup', verifyToken, authorizeRoles('SCHOOL_ADMIN', 'REGISTRAR'), getSetupData);

// POST: Admin officially registers and enrolls a student
router.post('/register', verifyToken, authorizeRoles('SCHOOL_ADMIN', 'REGISTRAR'), registerStudent);

module.exports = router;