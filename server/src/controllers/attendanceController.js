const prisma = require('../config/db');

const saveAttendance = async (req, res) => {
  try {
    // React will send us the records object and the date
    // records looks like: { "abebe_id": "PRESENT", "sara_id": "ABSENT" }
    const { records, date } = req.body; 
    const tenantId = req.user.tenantId; // Securely get school ID from Token

    // 1. Convert the object into an array so Prisma can read it easily
    const attendanceData = Object.keys(records).map((studentId) => ({
      studentId: studentId,
      status: records[studentId],
      date: new Date(date),
      tenantId: tenantId
    }));

    // 2. Stop if they didn't mark anyone
    if (attendanceData.length === 0) {
      return res.status(400).json({ message: 'No attendance data provided.' });
    }

    // 3. Bulk insert all attendance records into PostgreSQL at once!
    const savedRecords = await prisma.attendance.createMany({
      data: attendanceData,
    });

    res.json({ 
      message: 'Attendance saved successfully!', 
      count: savedRecords.count 
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error saving attendance' });
  }
};

const getParentAttendance = async (req, res) => {
  try {
    const parentId = req.user.id; // Get the logged-in parent's ID from the JWT token

    // Find the last 10 attendance records for this parent's children
    const recentAttendance = await prisma.attendance.findMany({
      where: {
        student: {
          parentId: parentId // Only get attendance if the student belongs to this parent!
        }
      },
      include: {
        student: true // Include the student's name so we know who it is
      },
      orderBy: {
        date: 'desc' // Show the newest records first
      },
      take: 10
    });

    res.json(recentAttendance);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error fetching attendance' });
  }
};

module.exports = { saveAttendance, getParentAttendance };