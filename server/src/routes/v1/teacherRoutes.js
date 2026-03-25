const express = require('express');
const { getMyClasses, getClassRoster, getClassGradebook, getClassAttendanceHistory } = require('../../controllers/teacherController');
const { verifyToken } = require('../../middlewares/auth');
const { authorizeRoles } = require('../../middlewares/roleCheck');

const router = express.Router();

// Get the logged-in teacher's classes
router.get('/my-classes', verifyToken, authorizeRoles('TEACHER'), getMyClasses);

// Get the students in a specific section
router.get('/roster/:sectionId', verifyToken, authorizeRoles('TEACHER'), getClassRoster);
router.get('/gradebook/:sectionId/:subjectId', verifyToken, authorizeRoles('TEACHER'), getClassGradebook);
router.get('/attendance-history/:sectionId', verifyToken, authorizeRoles('TEACHER'), getClassAttendanceHistory);

module.exports = router;