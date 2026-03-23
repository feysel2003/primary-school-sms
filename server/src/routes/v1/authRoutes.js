const express = require('express');
const { login } = require('../../controllers/authController');

const router = express.Router();

// POST request to /api/v1/auth/login
router.post('/login', login);

module.exports = router;