const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const prisma = new PrismaClient(); // Back to the clean, stable way!

module.exports = prisma;