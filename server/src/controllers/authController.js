const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();

const login = async (req, res) => {
  try {
    const { phone, password } = req.body;

    // 1. Find the user by their phone number
    const user = await prisma.user.findUnique({
      where: { phone: phone }
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid phone number or password' });
    }

    // 2. Check if the password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid phone number or password' });
    }

    // 3. Generate a JWT Token
    const token = jwt.sign(
      { id: user.id, role: user.role, tenantId: user.tenantId },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    // 4. Send the token and user data back to React
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        role: user.role,
        language: user.language,
        tenantId: user.tenantId
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { login };