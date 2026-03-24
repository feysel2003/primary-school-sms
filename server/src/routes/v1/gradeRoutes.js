const express = require('express');
const { saveGrades, getParentGrades } = require('../../controllers/gradeController');
const { verifyToken } = require('../../middlewares/auth');

const router = express.Router();

// POST request to save grades (Teacher)
router.post('/', verifyToken, saveGrades);

// GET request to view grades (Parent)
router.get('/parent', verifyToken, getParentGrades);

module.exports = router;