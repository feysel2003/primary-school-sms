const prisma = require('../config/db');
const { sendTelegramAlert } = require('../utils/telegramBot');

const saveAttendance = async (req, res) => {
  try {
    const { records, date } = req.body; 

    const attendanceData = Object.keys(records).map((enrollmentId) => ({
      enrollmentId: enrollmentId,
      status: records[enrollmentId],
      date: new Date(date)
    }));

    if (attendanceData.length === 0) {
      return res.status(400).json({ message: 'No attendance data provided.' });
    }

    const savedRecords = await prisma.attendance.createMany({
      data: attendanceData,
    });

    // --- UPGRADED TELEGRAM LOGIC ---
    for (const record of attendanceData) {
      // Find the parent via the Enrollment chain
      const enrollment = await prisma.enrollment.findUnique({
        where: { id: record.enrollmentId },
        include: { 
          student: { include: { parent: true } } 
        }
      });

      if (enrollment?.student?.parent?.telegramChatId) {
        const emoji = record.status === 'PRESENT' ? '✅' : '❌';
        const message = `${emoji} School Alert:\n${enrollment.student.firstName} ${enrollment.student.lastName} was marked ${record.status} today.`;
        
        await sendTelegramAlert(enrollment.student.parent.telegramChatId, message);
      }
    }

    res.json({ message: 'Attendance saved successfully!' });

  } catch (error) {
    console.error("ATTENDANCE_SAVE_ERROR:", error);
    res.status(500).json({ message: 'Server Error saving attendance' });
  }
};

const getParentAttendance = async (req, res) => {
  try {
    const parentId = req.user.id;

    const recentAttendance = await prisma.attendance.findMany({
      where: {
        enrollment: {
          student: { parentId: parentId }
        }
      },
      include: { 
        enrollment: { include: { student: true } } 
      },
      orderBy: { date: 'desc' },
      take: 10
    });

    res.json(recentAttendance);
  } catch (error) {
    console.error("ATTENDANCE_FETCH_ERROR:", error);
    res.status(500).json({ message: 'Server Error fetching attendance' });
  }
};

module.exports = { saveAttendance, getParentAttendance };