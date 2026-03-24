const prisma = require('../config/db');
const bcrypt = require('bcryptjs');

const createUser = async (req, res) => {
  try {
    const { firstName, lastName, phone, password, role } = req.body;
    
    // Security: Get the tenantId from the currently logged-in Admin
    const tenantId = req.user.tenantId;

    // 1. Check if phone number already exists
    const existingUser = await prisma.user.findUnique({ where: { phone } });
    if (existingUser) {
      return res.status(400).json({ message: 'Phone number already registered in the system.' });
    }

    // 2. Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Create the User inside the Admin's School!
    const newUser = await prisma.user.create({
      data: {
        phone,
        password: hashedPassword,
        role,
        tenantId,
      }
    });

    res.status(201).json({ 
      message: `${role} successfully registered!`, 
      user: { id: newUser.id, phone: newUser.phone, role: newUser.role }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error creating user' });
  }
};

module.exports = { createUser };