const express = require('express');
const { getAssignmentSetupData, assignTeacher } = require('../../controllers/academicController');
const { verifyToken } = require('../../middlewares/auth');
const { authorizeRoles } = require('../../middlewares/roleCheck');

const router = express.Router();

router.get('/setup', verifyToken, authorizeRoles('SCHOOL_ADMIN'), getAssignmentSetupData);
router.post('/assign', verifyToken, authorizeRoles('SCHOOL_ADMIN'), assignTeacher);

module.exports = router;