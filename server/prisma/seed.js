const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Connect to the database
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

  // 2. Create a Test Parent (Hash the password first!)
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  const parent = await prisma.user.create({
    data: {
      phone: '+251911234567', // Our test phone number
      password: hashedPassword, // 'password123'
      role: 'PARENT',
      language: 'en',
      tenantId: school.id, // Link parent to Hilawe School
    },
  });
  console.log(`✅ Parent Created with Phone: ${parent.phone} and Password: password123`);

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