const prisma = require('../config/db');

// 1. Get all classes assigned to this specific teacher
const getMyClasses = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const tenantId = req.user.tenantId;

    // Find the currently active academic year
    const activeYear = await prisma.academicYear.findFirst({
      where: { tenantId, isActive: true }
    });

    if (!activeYear) return res.status(400).json({ message: 'No active academic year found.' });

    // Find classes assigned to this teacher
    const assignments = await prisma.teacherAssignment.findMany({
      where: { teacherId, academicYearId: activeYear.id },
      include: {
        subject: true,
        section: {
          include: { gradeLevel: true } // Bring the Grade Level (e.g., Grade 9)
        }
      }
    });

    res.json(assignments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching teacher classes' });
  }
};

// 2. Get the specific students (Enrollments) for a Section
const getClassRoster = async (req, res) => {
  try {
    const { sectionId } = req.params;
    const tenantId = req.user.tenantId;

    const activeYear = await prisma.academicYear.findFirst({
      where: { tenantId, isActive: true }
    });

    // We fetch ENROLLMENTS, not just students, because grades/attendance attach to enrollments!
    const roster = await prisma.enrollment.findMany({
      where: { sectionId, academicYearId: activeYear.id, status: 'ACTIVE' },
      include: {
        student: true // Include the actual student details (Name, ID)
      },
      orderBy: { student: { firstName: 'asc' } } // Alphabetical roll call
    });

    res.json(roster);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching class roster' });
  }
};
// 3. Get the Gradebook (All past grades for a specific class & subject)
const getClassGradebook = async (req, res) => {
  try {
    const { sectionId, subjectId } = req.params;
    
    const grades = await prisma.grade.findMany({
      where: {
        enrollment: { sectionId: sectionId, status: 'ACTIVE' },
        subjectId: subjectId
      },
      include: {
        enrollment: { include: { student: true } } // Get student names
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(grades);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching gradebook' });
  }
};

// 4. Get Attendance History (Past week/month for a specific class)
const getClassAttendanceHistory = async (req, res) => {
  try {
    const { sectionId } = req.params;

    const attendance = await prisma.attendance.findMany({
      where: {
        enrollment: { sectionId: sectionId, status: 'ACTIVE' }
      },
      include: {
        enrollment: { include: { student: true } }
      },
      orderBy: { date: 'desc' } // Newest dates first
    });

    res.json(attendance);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching attendance history' });
  }
};

// DON'T FORGET TO EXPORT ALL 4 FUNCTIONS NOW!
module.exports = { getMyClasses, getClassRoster, getClassGradebook, getClassAttendanceHistory };