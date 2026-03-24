const prisma = require('../config/db');
const bcrypt = require('bcryptjs');

// 1. Get Setup Data for the Frontend Dropdowns (Grades, Sections, Active Year)
const getSetupData = async (req, res) => {
  try {
    const tenantId = req.user.tenantId;

    const activeYear = await prisma.academicYear.findFirst({
      where: { tenantId, isActive: true }
    });

    const gradeLevels = await prisma.gradeLevel.findMany({
      where: { tenantId },
      include: { sections: true } // Bring the sections with the grades!
    });

    res.json({ activeYear, gradeLevels });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching setup data' });
  }
};

// 2. The Massive Registration & Enrollment Engine
const registerStudent = async (req, res) => {
  try {
    const tenantId = req.user.tenantId;
    const { 
      studentId, firstName, lastName, gender, 
      parentPhone, studentPhone, 
      academicYearId, sectionId 
    } = req.body;

    const defaultPassword = await bcrypt.hash('password123', 10);

    // Use a Prisma Transaction to ensure everything succeeds together!
    const result = await prisma.$transaction(async (tx) => {
      
      // A. Handle the Parent Account
      let parent = await tx.user.findUnique({ where: { phone: parentPhone } });
      if (!parent) {
        parent = await tx.user.create({
          data: { phone: parentPhone, password: defaultPassword, role: 'PARENT', tenantId }
        });
      }

      // B. Handle the Student Account (Only if they are older and provided a phone)
      let studentUser = null;
      if (studentPhone) {
        studentUser = await tx.user.findUnique({ where: { phone: studentPhone } });
        if (!studentUser) {
          studentUser = await tx.user.create({
            data: { phone: studentPhone, password: defaultPassword, role: 'STUDENT', tenantId }
          });
        }
      }

      // C. Create the Student Profile
      const newStudent = await tx.student.create({
        data: {
          studentId, firstName, lastName, gender, tenantId,
          parentId: parent.id,
          userId: studentUser ? studentUser.id : null
        }
      });

      // D. Officially Enroll the Student in the Class!
      const enrollment = await tx.enrollment.create({
        data: {
          studentId: newStudent.id,
          academicYearId: academicYearId,
          sectionId: sectionId,
          status: 'ACTIVE'
        }
      });

      return newStudent;
    });

    res.status(201).json({ message: '✅ Student successfully registered and enrolled!', student: result });

  } catch (error) {
    console.error(error);
    if (error.code === 'P2002') {
      return res.status(400).json({ message: '❌ Error: That School ID or Phone Number is already in use.' });
    }
    res.status(500).json({ message: '❌ Server Error during registration.' });
  }
};

// 3. Keep the old function we made for the Teacher's roll call
const getStudentsBySchool = async (req, res) => {
  try {
    const tenantId = req.user.tenantId;
    const students = await prisma.student.findMany({
      where: { tenantId },
      orderBy: { firstName: 'asc' }
    });
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: 'Server Error fetching students' });
  }
};

module.exports = { getSetupData, registerStudent, getStudentsBySchool };