import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Users, CheckCircle, XCircle, User as UserIcon, Save, BookOpen, CalendarCheck } from 'lucide-react';
import apiClient from '../../utils/apiClient';

const TeacherDashboard = () => {
  const { t } = useTranslation();
  
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // UI Toggle State
  const[activeTab, setActiveTab] = useState('ATTENDANCE'); // 'ATTENDANCE' or 'GRADES'

  // Form States
  const [attendanceRecords, setAttendanceRecords] = useState({});
  const[gradeRecords, setGradeRecords] = useState({});
  const [subject, setSubject] = useState('Math');
  const[assessmentType, setAssessmentType] = useState('Midterm');
  const [term, setTerm] = useState('Term 1');

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

  // --- ATTENDANCE LOGIC ---
  const markAttendance = (studentId, status) => {
    setAttendanceRecords((prev) => ({ ...prev, [studentId]: status }));
  };

  const handleSaveAttendance = async () => {
    if (Object.keys(attendanceRecords).length === 0) return alert("Please mark attendance first.");
    try {
      const response = await apiClient.post('/attendance', {
        records: attendanceRecords,
        date: new Date().toISOString()
      });
      alert(`✅ ${response.data.message}`);
    } catch (error) {
      alert("❌ Failed to save attendance.");
    }
  };

  // --- GRADES LOGIC ---
  const handleGradeChange = (studentId, score) => {
    setGradeRecords((prev) => ({ ...prev, [studentId]: score }));
  };

  const handleSaveGrades = async () => {
    if (Object.keys(gradeRecords).length === 0) return alert("Please enter at least one grade.");
    try {
      const response = await apiClient.post('/grades', {
        subject,
        assessmentType,
        term,
        records: gradeRecords
      });
      alert(`✅ ${response.data.message}`);
    } catch (error) {
      alert("❌ Failed to save grades.");
    }
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
          <p className="text-gray-500 dark:text-gray-400">Manage your classroom data.</p>
        </div>
      </div>

      {/* TAB TOGGLES */}
      <div className="flex space-x-4 mb-6">
        <button 
          onClick={() => setActiveTab('ATTENDANCE')}
          className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-bold transition ${activeTab === 'ATTENDANCE' ? 'bg-primary text-white shadow-md' : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-slate-700'}`}
        >
          <CalendarCheck size={20} />
          <span>Daily Attendance</span>
        </button>
        <button 
          onClick={() => setActiveTab('GRADES')}
          className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-bold transition ${activeTab === 'GRADES' ? 'bg-secondary text-white shadow-md' : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-slate-700'}`}
        >
          <BookOpen size={20} />
          <span>Input Grades</span>
        </button>
      </div>

      {loading ? (
        <div className="text-center py-10 text-gray-500">Loading students...</div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
          
          {/* GRADES CONFIGURATION BAR (Only shows in Grades mode) */}
          {activeTab === 'GRADES' && (
            <div className="bg-gray-50 dark:bg-slate-900/50 p-4 border-b border-gray-200 dark:border-gray-700 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Subject</label>
                <select value={subject} onChange={(e) => setSubject(e.target.value)} className="w-full p-2 border rounded-lg dark:bg-slate-800 dark:border-gray-600 dark:text-white">
                  <option>Math</option>
                  <option>English</option>
                  <option>Amharic</option>
                  <option>Science</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Assessment</label>
                <select value={assessmentType} onChange={(e) => setAssessmentType(e.target.value)} className="w-full p-2 border rounded-lg dark:bg-slate-800 dark:border-gray-600 dark:text-white">
                  <option>Midterm</option>
                  <option>Final Exam</option>
                  <option>Test 1</option>
                  <option>Homework</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Term</label>
                <select value={term} onChange={(e) => setTerm(e.target.value)} className="w-full p-2 border rounded-lg dark:bg-slate-800 dark:border-gray-600 dark:text-white">
                  <option>Term 1</option>
                  <option>Term 2</option>
                  <option>Term 3</option>
                </select>
              </div>
            </div>
          )}

          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {students.map((student) => (
              <div key={student.id} className="p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                
                <div className="flex items-center space-x-4 w-full sm:w-auto">
                  <div className="w-10 h-10 bg-gray-100 dark:bg-slate-600 rounded-full flex items-center justify-center text-gray-500 dark:text-gray-300">
                    <UserIcon size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">{student.firstName} {student.lastName}</h3>
                  </div>
                </div>

                {/* DYNAMIC INPUT (Changes based on tab) */}
                <div className="w-full sm:w-auto">
                  {activeTab === 'ATTENDANCE' ? (
                    <div className="flex space-x-2">
                      <button onClick={() => markAttendance(student.id, 'PRESENT')} className={`px-4 py-2 rounded-lg font-bold border transition ${attendanceRecords[student.id] === 'PRESENT' ? 'bg-green-100 border-green-500 text-green-700' : 'bg-white border-gray-200 text-gray-600'}`}>Present</button>
                      <button onClick={() => markAttendance(student.id, 'ABSENT')} className={`px-4 py-2 rounded-lg font-bold border transition ${attendanceRecords[student.id] === 'ABSENT' ? 'bg-red-100 border-red-500 text-red-700' : 'bg-white border-gray-200 text-gray-600'}`}>Absent</button>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <input 
                        type="number" 
                        placeholder="0"
                        min="0" max="100"
                        value={gradeRecords[student.id] || ''}
                        onChange={(e) => handleGradeChange(student.id, e.target.value)}
                        className="w-20 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-center font-bold dark:bg-slate-900 dark:text-white focus:ring-2 focus:ring-secondary focus:outline-none"
                      />
                      <span className="text-gray-500 font-bold">/ 100</span>
                    </div>
                  )}
                </div>

              </div>
            ))}
          </div>

          <div className="p-6 bg-gray-50 dark:bg-slate-900 border-t flex justify-end">
            {activeTab === 'ATTENDANCE' ? (
              <button onClick={handleSaveAttendance} className="flex items-center space-x-2 bg-primary hover:bg-blue-900 text-white px-6 py-3 rounded-xl font-bold shadow-lg transition">
                <Save size={20} /><span>Submit Roll Call</span>
              </button>
            ) : (
              <button onClick={handleSaveGrades} className="flex items-center space-x-2 bg-secondary hover:bg-green-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg transition">
                <Save size={20} /><span>Publish Grades</span>
              </button>
            )}
          </div>

        </div>
      )}
    </div>
  );
};

export default TeacherDashboard;