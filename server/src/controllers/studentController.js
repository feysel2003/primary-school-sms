const prisma = require('../config/db');

// Get all students for a specific school
const getStudentsBySchool = async (req, res) => {
  try {
    // We will get the tenantId from the logged-in teacher's JWT token!
    const tenantId = req.user.tenantId; 

    const students = await prisma.student.findMany({
      where: { tenantId: tenantId },
      orderBy: { firstName: 'asc' } // Alphabetical order for the roll call
    });

    res.json(students);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error fetching students' });
  }
};

module.exports = { getStudentsBySchool };