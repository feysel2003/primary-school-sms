const express = require('express');
const { exportMoEReport } = require('../../controllers/moeController');
const { verifyToken } = require('../../middlewares/auth');
const { authorizeRoles } = require('../../middlewares/roleCheck');

const router = express.Router();

// GET request to download CSV. 
// 1. Must be logged in (verifyToken)
// 2. MUST be a SCHOOL_ADMIN (authorizeRoles)
router.get('/export', verifyToken, authorizeRoles('SCHOOL_ADMIN', 'SUPER_ADMIN'), exportMoEReport);

module.exports = router;