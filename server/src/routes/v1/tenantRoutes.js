const express = require('express');
const { getSystemOverview } = require('../../controllers/tenantController');
const { verifyToken } = require('../../middlewares/auth');
const { authorizeRoles } = require('../../middlewares/roleCheck');

const router = express.Router();

// Only the SUPER_ADMIN can see all schools!
router.get('/overview', verifyToken, authorizeRoles('SUPER_ADMIN'), getSystemOverview);

module.exports = router;