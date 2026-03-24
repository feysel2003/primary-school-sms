const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Enterprise Database Seeding...');
  const hashedPassword = await bcrypt.hash('password123', 10);

  // ==========================================
  // 1. SYSTEM OWNER (Super Admin)
  // ==========================================
  const systemTenant = await prisma.tenant.create({
    data: { name: 'Digital School SMS Platform', subdomain: 'system_admin' }
  });

  await prisma.user.create({
    data: { phone: '+251900000000', password: hashedPassword, role: 'SUPER_ADMIN', tenantId: systemTenant.id }
  });
  console.log('✅ Super Admin Created (+251900000000)');

  // ==========================================
  // 2. THE SCHOOL & ACADEMIC YEAR
  // ==========================================
  const school = await prisma.tenant.create({
    data: { name: 'Hilawe Primary & Secondary School', subdomain: 'hilawe', status: 'ACTIVE' }
  });
  console.log(`✅ School Created: ${school.name}`);

  const year2018 = await prisma.academicYear.create({
    data: { yearName: '2018 E.C.', isActive: true, tenantId: school.id }
  });

  // ==========================================
  // 3. GRADE LEVELS & SECTIONS (Cycles)
  // ==========================================
  const grade3 = await prisma.gradeLevel.create({
    data: { name: 'Grade 3', cycle: 'LOWER_PRIMARY', tenantId: school.id }
  });
  const grade3A = await prisma.section.create({
    data: { name: 'Section A', gradeLevelId: grade3.id }
  });

  const grade9 = await prisma.gradeLevel.create({
    data: { name: 'Grade 9', cycle: 'SECONDARY', tenantId: school.id }
  });
  const grade9A = await prisma.section.create({
    data: { name: 'Section A', gradeLevelId: grade9.id }
  });

  // ==========================================
  // 4. SUBJECTS
  // ==========================================
  const math = await prisma.subject.create({ data: { name: 'Mathematics', code: 'MATH-101', tenantId: school.id }});
  const physics = await prisma.subject.create({ data: { name: 'Physics', code: 'PHYS-201', tenantId: school.id }});

  // ==========================================
  // 5. SCHOOL STAFF (Admin & Teacher)
  // ==========================================
  const schoolAdmin = await prisma.user.create({
    data: { phone: '+251911000000', password: hashedPassword, role: 'SCHOOL_ADMIN', tenantId: school.id }
  });
  console.log('✅ School Admin Created (+251911000000)');

  const teacher = await prisma.user.create({
    data: { phone: '+251922000000', password: hashedPassword, role: 'TEACHER', tenantId: school.id }
  });
  console.log('✅ Teacher Created (+251922000000)');

  // Assign Teacher to teach Math to Grade 3A, and Physics to Grade 9A
  await prisma.teacherAssignment.createMany({
    data:[
      { teacherId: teacher.id, subjectId: math.id, sectionId: grade3A.id, academicYearId: year2018.id },
      { teacherId: teacher.id, subjectId: physics.id, sectionId: grade9A.id, academicYearId: year2018.id }
    ]
  });

  // ==========================================
  // 6. PARENTS & STUDENTS
  // ==========================================
  const parent = await prisma.user.create({
    data: { phone: '+251933000000', password: hashedPassword, role: 'PARENT', tenantId: school.id }
  });
  console.log('✅ Parent Created (+251933000000)');

  // Child 1: Abebe (Lower Primary) - No login for himself
  const abebe = await prisma.student.create({
    data: {
      studentId: 'ETS-001/18', firstName: 'Abebe', lastName: 'Kebede', gender: 'MALE', 
      parentId: parent.id, tenantId: school.id
    }
  });

  // Child 2: Sara (High School) - Gets her own Student Login!
  const saraUser = await prisma.user.create({
    data: { phone: '+251944000000', password: hashedPassword, role: 'STUDENT', tenantId: school.id }
  });
  console.log('✅ High School Student Login Created (+251944000000)');

  const sara = await prisma.student.create({
    data: {
      studentId: 'ETS-002/18', firstName: 'Sara', lastName: 'Kebede', gender: 'FEMALE',
      parentId: parent.id, userId: saraUser.id, tenantId: school.id
    }
  });

  // ==========================================
  // 7. ENROLLMENTS
  // ==========================================
  await prisma.enrollment.createMany({
    data:[
      { studentId: abebe.id, academicYearId: year2018.id, sectionId: grade3A.id, status: 'ACTIVE' },
      { studentId: sara.id, academicYearId: year2018.id, sectionId: grade9A.id, status: 'ACTIVE' }
    ]
  });
  console.log('✅ Students successfully enrolled in their sections for 2018 E.C.');

  console.log('🎉 Enterprise Database Seeding Finished Successfully!');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });