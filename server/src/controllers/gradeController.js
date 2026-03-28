const prisma = require('../config/db');

// --- TEACHER: Save Grades ---
const saveGrades = async (req, res) => {
  try {
    // We now extract maxScore from the React request!
    const { subjectId, assessmentType, term, maxScore, records } = req.body; 

    const enrollmentIds = Object.keys(records);

    if (enrollmentIds.length === 0) {
      return res.status(400).json({ message: 'No grades provided.' });
    }

    // 🔥 ENTERPRISE UPGRADE: Prevent Duplicate Grades!
    // If the teacher is fixing a mistake and re-saving the "Midterm", 
    // we delete the old Midterm records for these students first.
    await prisma.grade.deleteMany({
      where: {
        subjectId: subjectId,
        assessmentType: assessmentType,
        term: term,
        enrollmentId: { in: enrollmentIds }
      }
    });

    // Convert the records object into an array formatted for the database
    const gradeData = enrollmentIds.map((enrollmentId) => ({
      enrollmentId: enrollmentId,
      subjectId: subjectId,
      assessmentType: assessmentType,
      score: parseFloat(records[enrollmentId]), 
      maxScore: parseFloat(maxScore) || 100, // <-- 🔥 DYNAMIC MAX SCORE!
      term: term
    }));

    // Bulk insert the new, correct grades!
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
          student: { parentId: parentId } 
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