import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Users, CheckCircle, XCircle, User as UserIcon, Save } from 'lucide-react';
import apiClient from '../../utils/apiClient'; // Our secure messenger!

const TeacherDashboard = () => {
  const { t } = useTranslation();
  
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // This state remembers who is Present and who is Absent before we click "Save"
  const [attendanceRecords, setAttendanceRecords] = useState({});

  // When the dashboard loads, fetch the students from the backend!
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await apiClient.get('/students');
        setStudents(response.data);
      } catch (error) {
        console.error('Failed to fetch students', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  },[]);

  // Helper function when a teacher clicks a Present or Absent button
  const markAttendance = (studentId, status) => {
    setAttendanceRecords((prev) => ({
      ...prev,
      [studentId]: status,
    }));
  };

  // Helper function to simulate saving (We will build the real backend save next)
  const handleSaveAttendance = () => {
    console.log("Data ready to send to backend:", attendanceRecords);
    alert("Attendance marked successfully! (Backend save coming next!)");
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Header Section */}
      <div className="flex items-center space-x-3 border-b border-gray-200 dark:border-gray-700 pb-4">
        <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-primary dark:text-blue-400 rounded-lg">
          <Users size={28} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Teacher Portal</h1>
          <p className="text-gray-500 dark:text-gray-400">Daily Roll Call: {new Date().toLocaleDateString()}</p>
        </div>
      </div>

      {/* Loading Spinner */}
      {loading ? (
        <div className="text-center py-10 text-gray-500 dark:text-gray-400 font-medium">
          Loading students...
        </div>
      ) : students.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm text-center border border-gray-200 dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400">No students found in your classroom.</p>
        </div>
      ) : (
        /* The Student List Grid */
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
          
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {students.map((student) => (
              <div key={student.id} className="p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition">
                
                {/* Student Info */}
                <div className="flex items-center space-x-4 w-full sm:w-auto">
                  <div className="w-12 h-12 bg-gray-100 dark:bg-slate-600 rounded-full flex items-center justify-center text-gray-500 dark:text-gray-300">
                    <UserIcon size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      {student.firstName} {student.lastName}
                    </h3>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {student.grade} • {student.gender}
                    </p>
                  </div>
                </div>

                {/* Attendance Action Buttons */}
                <div className="flex items-center w-full sm:w-auto space-x-2">
                  <button 
                    onClick={() => markAttendance(student.id, 'PRESENT')}
                    className={`flex-1 sm:flex-none flex items-center justify-center space-x-1 px-4 py-2 rounded-lg font-bold border transition ${
                      attendanceRecords[student.id] === 'PRESENT' 
                        ? 'bg-green-100 border-green-500 text-green-700 dark:bg-green-900/40 dark:border-green-400 dark:text-green-400' 
                        : 'bg-white border-gray-200 text-gray-600 hover:bg-green-50 dark:bg-slate-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-slate-700'
                    }`}
                  >
                    <CheckCircle size={18} />
                    <span>Present</span>
                  </button>

                  <button 
                    onClick={() => markAttendance(student.id, 'ABSENT')}
                    className={`flex-1 sm:flex-none flex items-center justify-center space-x-1 px-4 py-2 rounded-lg font-bold border transition ${
                      attendanceRecords[student.id] === 'ABSENT' 
                        ? 'bg-red-100 border-red-500 text-red-700 dark:bg-red-900/40 dark:border-red-400 dark:text-red-400' 
                        : 'bg-white border-gray-200 text-gray-600 hover:bg-red-50 dark:bg-slate-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-slate-700'
                    }`}
                  >
                    <XCircle size={18} />
                    <span>Absent</span>
                  </button>
                </div>

              </div>
            ))}
          </div>

          {/* Submit Button */}
          <div className="p-6 bg-gray-50 dark:bg-slate-900 border-t border-gray-200 dark:border-gray-700 flex justify-end">
            <button 
              onClick={handleSaveAttendance}
              className="flex items-center space-x-2 bg-primary hover:bg-blue-900 text-white px-6 py-3 rounded-xl font-bold shadow-lg transition"
            >
              <Save size={20} />
              <span>Submit Roll Call</span>
            </button>
          </div>

        </div>
      )}

    </div>
  );
};

export default TeacherDashboard;