const prisma = require('../config/db');

// --- TEACHER: Save Grades for a class ---
const saveGrades = async (req, res) => {
  try {
    // records will look like: { "abebe_id": 85, "sara_id": 92 }
    const { subject, assessmentType, term, records } = req.body; 
    const tenantId = req.user.tenantId; 

    // Convert the records object into an array for Prisma
    const gradeData = Object.keys(records).map((studentId) => ({
      studentId: studentId,
      subject: subject,
      assessmentType: assessmentType,
      score: parseFloat(records[studentId]), // Convert to decimal number
      term: term,
      tenantId: tenantId
    }));

    if (gradeData.length === 0) {
      return res.status(400).json({ message: 'No grades provided.' });
    }

    // Bulk insert all grades into PostgreSQL!
    const savedGrades = await prisma.grade.createMany({
      data: gradeData,
    });

    res.json({ message: 'Grades saved successfully!', count: savedGrades.count });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error saving grades' });
  }
};

// --- PARENT: Get Grades for their children ---
const getParentGrades = async (req, res) => {
  try {
    const parentId = req.user.id; 

    const recentGrades = await prisma.grade.findMany({
      where: {
        student: { parentId: parentId }
      },
      include: { student: true }, // Include student name
      orderBy: { createdAt: 'desc' }, // Newest grades first
      take: 15
    });

    res.json(recentGrades);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error fetching grades' });
  }
};

module.exports = { saveGrades, getParentGrades };