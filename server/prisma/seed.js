const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // 1. Create a Test School (Tenant)
  const school = await prisma.tenant.create({
    data: {
      name: 'Hilawe Primary School',
      subdomain: 'hilawe',
      status: 'ACTIVE',
    },
  });
  console.log(`✅ School Created: ${school.name}`);

  // 2. Create a Test Parent
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  const parent = await prisma.user.create({
    data: {
      phone: '+251911234567',
      password: hashedPassword,
      role: 'PARENT',
      language: 'en',
      tenantId: school.id,
    },
  });
  console.log(`✅ Parent Created: ${parent.phone}`);

  // 3. NEW: Create a Test Student belonging to that Parent and School!
  const student = await prisma.student.create({
    data: {
      firstName: 'Abebe',
      lastName: 'Kebede',
      gender: 'MALE',
      grade: 'Grade 3',
      parentId: parent.id,    // Links Abebe to the Parent we just made
      tenantId: school.id,    // Links Abebe to Hilawe School
    }
  });
  console.log(`✅ Student Enrolled: ${student.firstName} ${student.lastName} in ${student.grade}`);
// --- ADD THIS BELOW THE PARENT CODE ---
  
  // 4. Create a Test Teacher
  const teacher = await prisma.user.create({
    data: {
      phone: '+251922000000', // Teacher Phone
      password: hashedPassword, // 'password123'
      role: 'TEACHER',
      language: 'en',
      tenantId: school.id,
    },
  });
  console.log(`✅ Teacher Created: ${teacher.phone}`);

  // 5. Create a Test School Admin
  const admin = await prisma.user.create({
    data: {
      phone: '+251933000000', // Admin Phone
      password: hashedPassword, // 'password123'
      role: 'SCHOOL_ADMIN',
      language: 'en',
      tenantId: school.id,
    },
  });
  console.log(`✅ Admin Created: ${admin.phone}`);
  
  console.log('🎉 Seeding finished successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });