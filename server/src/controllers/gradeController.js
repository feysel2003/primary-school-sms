const prisma = require('../config/db');

// --- TEACHER: Save Grades ---
const saveGrades = async (req, res) => {
  try {
    // records looks like: { "enrollment_uuid": 85, "enrollment_uuid_2": 92 }
    const { subjectId, assessmentType, term, records } = req.body; 

    // Convert the records object into an array formatted for the new Schema
    const gradeData = Object.keys(records).map((enrollmentId) => ({
      enrollmentId: enrollmentId,
      subjectId: subjectId,
      assessmentType: assessmentType,
      score: parseFloat(records[enrollmentId]), 
      maxScore: 100,
      term: term
    }));

    if (gradeData.length === 0) {
      return res.status(400).json({ message: 'No grades provided.' });
    }

    // Bulk insert into the Grade table
    const savedGrades = await prisma.grade.createMany({
      data: gradeData,
    });

    res.json({ message: 'Grades saved successfully!', count: savedGrades.count });

  } catch (error) {
    console.error("GRADE_SAVE_ERROR:", error);
    res.status(500).json({ message: 'Server Error saving grades' });
  }
};

// --- PARENT: Get Grades ---
const getParentGrades = async (req, res) => {
  try {
    const parentId = req.user.id; 

    const recentGrades = await prisma.grade.findMany({
      where: {
        enrollment: {
          student: { parentId: parentId } // Drills down through Enrollment to Student
        }
      },
      include: { 
        enrollment: { include: { student: true } },
        subject: true 
      },
      orderBy: { createdAt: 'desc' },
      take: 15
    });

    res.json(recentGrades);
  } catch (error) {
    console.error("GRADE_FETCH_ERROR:", error);
    res.status(500).json({ message: 'Server Error fetching grades' });
  }
};

module.exports = { saveGrades, getParentGrades };