const prisma = require('../config/db');

// 1. Fetch data for the Admin Dropdowns
const getAssignmentSetupData = async (req, res) => {
  try {
    const tenantId = req.user.tenantId;

    const activeYear = await prisma.academicYear.findFirst({ where: { tenantId, isActive: true } });
    
    // Get all Teachers in this school
    const teachers = await prisma.user.findMany({
      where: { tenantId, role: 'TEACHER' },
      select: { id: true, phone: true } // We just need their ID and phone number
    });

    const subjects = await prisma.subject.findMany({ where: { tenantId } });

    // Get Sections and include the Grade Level name (e.g. "Grade 9 - Section A")
    const sections = await prisma.section.findMany({
      where: { gradeLevel: { tenantId } },
      include: { gradeLevel: true }
    });

    res.json({ activeYear, teachers, subjects, sections });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching academic setup data' });
  }
};

// 2. Assign the Teacher to a Class!
const assignTeacher = async (req, res) => {
  try {
    const { teacherId, subjectId, sectionId, academicYearId } = req.body;

    // Check if this exact assignment already exists
    const existing = await prisma.teacherAssignment.findFirst({
      where: { teacherId, subjectId, sectionId, academicYearId }
    });

    if (existing) {
      return res.status(400).json({ message: 'This teacher is already assigned to this subject and class.' });
    }

    // Save the assignment
    await prisma.teacherAssignment.create({
      data: { teacherId, subjectId, sectionId, academicYearId }
    });

    res.status(201).json({ message: '✅ Teacher successfully assigned to the class!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error assigning teacher' });
  }
};

module.exports = { getAssignmentSetupData, assignTeacher };