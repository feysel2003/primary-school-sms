const prisma = require('../config/db');

// Get all schools and system-wide stats
const getSystemOverview = async (req, res) => {
  try {
    // 1. Get all schools (Tenants)
    const schools = await prisma.tenant.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { students: true, users: true }
        }
      }
    });

    // 2. Calculate global stats
    const totalSchools = schools.length;
    const totalStudents = schools.reduce((sum, school) => sum + school._count.students, 0);
    const totalUsers = schools.reduce((sum, school) => sum + school._count.users, 0);

    res.json({
      stats: { totalSchools, totalStudents, totalUsers },
      schools
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error fetching system overview' });
  }
};

module.exports = { getSystemOverview };