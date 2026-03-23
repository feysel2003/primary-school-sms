const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../config/db');

const login = async (req, res) => {
  try {
    const { phone, password } = req.body;

    // 1. Find the user AND include their children!
    const user = await prisma.user.findUnique({
      where: { phone: phone },
      include: { children: true } // <-- THIS IS NEW! It tells PostgreSQL to join the tables!
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid phone number or password' });
    }

    // 2. Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid phone number or password' });
    }

    // 3. Generate Token
    const token = jwt.sign(
      { id: user.id, role: user.role, tenantId: user.tenantId },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    // 4. Send token, user data, AND children to React
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        role: user.role,
        language: user.language,
        tenantId: user.tenantId,
        children: user.children // <-- WE SEND ABEBE TO REACT HERE!
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { login };