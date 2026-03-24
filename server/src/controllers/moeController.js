const prisma = require('../config/db');
const { createObjectCsvStringifier } = require('csv-writer');

const exportMoEReport = async (req, res) => {
  try {
    const tenantId = req.user.tenantId;

    // 1. Fetch all students for this specific school
    const students = await prisma.student.findMany({
      where: { tenantId: tenantId },
      include: { parent: true }, // Include parent so we can get the phone number
      orderBy: [ { grade: 'asc' }, { firstName: 'asc' } ] // Group by grade, then alphabetically
    });

    if (students.length === 0) {
      return res.status(404).json({ message: 'No students found to export.' });
    }

    // 2. Define the exact columns the Ministry of Education wants
    const csvStringifier = createObjectCsvStringifier({
      header:[
        { id: 'studentId', title: 'Student ID' },
        { id: 'firstName', title: 'First Name' },
        { id: 'lastName', title: 'Last Name' },
        { id: 'gender', title: 'Gender' },
        { id: 'grade', title: 'Grade/Class' },
        { id: 'parentPhone', title: 'Parent Contact' },
        { id: 'registrationDate', title: 'Registration Date (GC)' }
      ]
    });

    // 3. Map our database records to match the columns perfectly
    const records = students.map((s) => ({
      studentId: s.id.substring(0, 8).toUpperCase(), // Make a clean 8-character ID
      firstName: s.firstName,
      lastName: s.lastName,
      gender: s.gender,
      grade: s.grade,
      parentPhone: s.parent?.phone || 'N/A',
      registrationDate: s.createdAt.toISOString().split('T')[0] // Format: YYYY-MM-DD
    }));

    // 4. Generate the CSV strings
    const header = csvStringifier.getHeaderString();
    const body = csvStringifier.stringifyRecords(records);

    // 5. Send the file directly to the browser as a download!
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="MoE_Student_Registration_Report_2026.csv"');
    res.status(200).send(header + body);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error generating MoE Report' });
  }
};

module.exports = { exportMoEReport };