const express = require('express');
const { createUser } = require('../../controllers/userController');
const { verifyToken } = require('../../middlewares/auth');
const { authorizeRoles } = require('../../middlewares/roleCheck');

const router = express.Router();

// POST request to create a user (Only School Admins can do this)
router.post('/', verifyToken, authorizeRoles('SCHOOL_ADMIN'), createUser);

module.exports = router;