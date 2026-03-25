import { useState, useEffect } from 'react';
import { BookOpen, Users, ArrowLeft, CheckCircle, XCircle, Save, User as UserIcon, Calendar, FileSpreadsheet } from 'lucide-react';
import apiClient from '../../utils/apiClient';

const TeacherDashboard = () => {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [roster, setRoster] = useState([]);
  
  // TABS: 'INPUT_ATTENDANCE', 'INPUT_GRADES', 'HISTORY_ATTENDANCE', 'HISTORY_GRADES'
  const [activeTab, setActiveTab] = useState('INPUT_ATTENDANCE'); 
  
  // Data States
  const [attendanceRecords, setAttendanceRecords] = useState({});
  const[gradeRecords, setGradeRecords] = useState({});
  const [assessmentType, setAssessmentType] = useState('Midterm');
  const[historicalGrades, setHistoricalGrades] = useState([]);
  const [historicalAttendance, setHistoricalAttendance] = useState([]);
  
  const [loading, setLoading] = useState(true);

  // 1. Load Classes
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await apiClient.get('/teacher/my-classes');
        setClasses(response.data);
      } catch (error) { console.error('Failed to fetch classes'); } 
      finally { setLoading(false); }
    };
    fetchClasses();
  }, new Array(0));

  // 2. Load Roster AND Historical Data when a class is selected
  const handleSelectClass = async (classItem) => {
    setSelectedClass(classItem);
    setLoading(true);
    try {
      // Fetch Roster
      const rosterRes = await apiClient.get(`/teacher/roster/${classItem.sectionId}`);
      setRoster(rosterRes.data);
      
      // Fetch Historical Data
      const gradesRes = await apiClient.get(`/teacher/gradebook/${classItem.sectionId}/${classItem.subjectId}`);
      setHistoricalGrades(gradesRes.data);

      const attRes = await apiClient.get(`/teacher/attendance-history/${classItem.sectionId}`);
      setHistoricalAttendance(attRes.data);

      // Reset Inputs
      setAttendanceRecords({}); setGradeRecords({});
    } catch (error) { console.error('Failed to fetch class data'); } 
    finally { setLoading(false); }
  };

  // 3. Submit Handlers
  const handleSaveAttendance = async () => {
    if(Object.keys(attendanceRecords).length === 0) return alert("Please mark attendance.");
    try {
      await apiClient.post('/attendance', { records: attendanceRecords, date: new Date().toISOString() });
      alert("✅ Attendance saved! Parents notified.");
      handleSelectClass(selectedClass); // Refresh history
    } catch (error) { alert("❌ Failed to save."); }
  };

  const handleSaveGrades = async () => {
  if(Object.keys(gradeRecords).length === 0) return alert("Please enter grades.");
  try {
    await apiClient.post('/grades', {
      subjectId: selectedClass.subjectId, // Send the ID, not the name
      assessmentType: assessmentType, 
      term: 'Term 1', 
      records: gradeRecords // These are enrollment IDs from your roster map
    });
    alert("✅ Grades published!");
    handleSelectClass(selectedClass); 
  } catch (error) { alert("❌ Failed to save."); }
};

  if (loading && !selectedClass) return <div className="p-10 text-center text-gray-500 font-bold">Loading your classes...</div>;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      
      {/* HEADER */}
      <div className="flex items-center space-x-3 border-b border-gray-200 dark:border-gray-700 pb-4">
        <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-primary dark:text-blue-400 rounded-lg">
          <BookOpen size={28} />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Teacher Portal</h1>
          <p className="text-gray-500 dark:text-gray-400">
            {selectedClass ? `${selectedClass.subject.name} • ${selectedClass.section.gradeLevel.name} ${selectedClass.section.name}` : 'Select a class to manage.'}
          </p>
        </div>
      </div>

      {/* VIEW 1: CLASS SELECTION */}
      {!selectedClass ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.length === 0 && !loading && (
             <div className="col-span-full p-8 text-center bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-200">
               <p className="text-gray-500">You are not assigned to any classes this year.</p>
             </div>
          )}
          {classes.map((cls) => (
            <div key={cls.id} onClick={() => handleSelectClass(cls)} className="bg-white dark:bg-slate-800 rounded-2xl shadow-md border border-gray-200 p-6 cursor-pointer hover:shadow-xl transition-all group">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-primary/10 text-primary rounded-xl group-hover:bg-primary group-hover:text-white transition"><BookOpen size={24} /></div>
              </div>
              <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">{cls.subject.name}</h2>
              <p className="text-gray-500 font-medium mt-2">{cls.section.gradeLevel.name} - {cls.section.name}</p>
            </div>
          ))}
        </div>
      ) : (
        
        /* VIEW 2: CLASS MANAGEMENT */
        <div className="space-y-6">
          <button onClick={() => setSelectedClass(null)} className="flex items-center space-x-2 text-primary font-bold hover:underline mb-2">
            <ArrowLeft size={20} /> <span>Back to Classes</span>
          </button>

          {/* 4 PROFESSIONAL TABS */}
          <div className="flex flex-wrap gap-2 sm:gap-4 border-b border-gray-200 dark:border-gray-700 pb-4">
            <button onClick={() => setActiveTab('INPUT_ATTENDANCE')} className={`px-4 py-2 rounded-lg font-bold transition flex items-center gap-2 ${activeTab === 'INPUT_ATTENDANCE' ? 'bg-primary text-white' : 'bg-white dark:bg-slate-800 text-gray-600 hover:bg-gray-50'}`}><CheckCircle size={18}/> Take Roll</button>
            <button onClick={() => setActiveTab('INPUT_GRADES')} className={`px-4 py-2 rounded-lg font-bold transition flex items-center gap-2 ${activeTab === 'INPUT_GRADES' ? 'bg-secondary text-white' : 'bg-white dark:bg-slate-800 text-gray-600 hover:bg-gray-50'}`}><Save size={18}/> Enter Grades</button>
            <button onClick={() => setActiveTab('HISTORY_ATTENDANCE')} className={`px-4 py-2 rounded-lg font-bold transition flex items-center gap-2 ${activeTab === 'HISTORY_ATTENDANCE' ? 'bg-purple-600 text-white' : 'bg-white dark:bg-slate-800 text-gray-600 hover:bg-gray-50'}`}><Calendar size={18}/> Attendance History</button>
            <button onClick={() => setActiveTab('HISTORY_GRADES')} className={`px-4 py-2 rounded-lg font-bold transition flex items-center gap-2 ${activeTab === 'HISTORY_GRADES' ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-slate-800 text-gray-600 hover:bg-gray-50'}`}><FileSpreadsheet size={18}/> Gradebook</button>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-md border border-gray-200 overflow-hidden">
            
            {/* TAB 1: INPUT GRADES SPECIFIC HEADER */}
            {activeTab === 'INPUT_GRADES' && (
              <div className="bg-gray-50 dark:bg-slate-900/50 p-4 border-b border-gray-200 flex gap-4 items-center">
                <label className="text-xs font-bold text-gray-500 uppercase">Assessment</label>
                <select value={assessmentType} onChange={(e) => setAssessmentType(e.target.value)} className="w-48 p-2 border rounded-lg outline-none dark:bg-slate-800 dark:text-white">
                  <option>Midterm</option><option>Final Exam</option><option>Test 1</option><option>Project</option>
                </select>
              </div>
            )}

            {/* TAB 1 & 2: DATA ENTRY (Input modes) */}
            {(activeTab === 'INPUT_ATTENDANCE' || activeTab === 'INPUT_GRADES') && (
              <div className="divide-y divide-gray-100 dark:divide-gray-700">
                {roster.map((enrollment) => (
                  <div key={enrollment.id} className="p-4 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-slate-700/50">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500"><UserIcon size={20} /></div>
                      <div>
                        <h3 className="font-bold dark:text-white">{enrollment.student.firstName} {enrollment.student.lastName}</h3>
                        <p className="text-xs text-gray-500">{enrollment.student.studentId}</p>
                      </div>
                    </div>
                    <div>
                      {activeTab === 'INPUT_ATTENDANCE' ? (
                        <div className="flex space-x-2">
                          <button onClick={() => setAttendanceRecords({...attendanceRecords, [enrollment.id]: 'PRESENT'})} className={`px-4 py-2 rounded-lg font-bold border ${attendanceRecords[enrollment.id] === 'PRESENT' ? 'bg-green-100 border-green-500 text-green-700' : 'bg-white'}`}>Present</button>
                          <button onClick={() => setAttendanceRecords({...attendanceRecords, [enrollment.id]: 'ABSENT'})} className={`px-4 py-2 rounded-lg font-bold border ${attendanceRecords[enrollment.id] === 'ABSENT' ? 'bg-red-100 border-red-500 text-red-700' : 'bg-white'}`}>Absent</button>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <input type="number" placeholder="0" min="0" max="100" value={gradeRecords[enrollment.id] || ''} onChange={(e) => setGradeRecords({...gradeRecords, [enrollment.id]: e.target.value})} className="w-20 px-3 py-2 border rounded-lg text-center font-bold dark:bg-slate-900 dark:text-white outline-none"/>
                          <span className="text-gray-500 font-bold">/ 100</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                <div className="p-6 bg-gray-50 dark:bg-slate-900 flex justify-end">
                  <button onClick={activeTab === 'INPUT_ATTENDANCE' ? handleSaveAttendance : handleSaveGrades} className="bg-primary text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-blue-900">
                    Submit Data
                  </button>
                </div>
              </div>
            )}

            {/* TAB 3: ATTENDANCE HISTORY */}
            {activeTab === 'HISTORY_ATTENDANCE' && (
              <div className="p-6">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b-2 border-gray-200 dark:border-gray-700 text-gray-500">
                      <th className="py-3 font-bold">Date</th>
                      <th className="py-3 font-bold">Student Name</th>
                      <th className="py-3 font-bold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historicalAttendance.map(record => (
                      <tr key={record.id} className="border-b border-gray-100 dark:border-gray-700">
                        <td className="py-4 font-medium dark:text-gray-300">{new Date(record.date).toDateString()}</td>
                        <td className="py-4 font-bold dark:text-white">{record.enrollment.student.firstName} {record.enrollment.student.lastName}</td>
                        <td className="py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${record.status === 'PRESENT' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{record.status}</span>
                        </td>
                      </tr>
                    ))}
                    {historicalAttendance.length === 0 && <tr><td colSpan="3" className="py-6 text-center text-gray-500">No attendance records found for this class.</td></tr>}
                  </tbody>
                </table>
              </div>
            )}

            {/* TAB 4: GRADEBOOK HISTORY */}
            {activeTab === 'HISTORY_GRADES' && (
              <div className="p-6">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b-2 border-gray-200 dark:border-gray-700 text-gray-500">
                      <th className="py-3 font-bold">Assessment</th>
                      <th className="py-3 font-bold">Student Name</th>
                      <th className="py-3 font-bold">Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historicalGrades.map(grade => (
                      <tr key={grade.id} className="border-b border-gray-100 dark:border-gray-700">
                        <td className="py-4 font-medium dark:text-gray-300">{grade.assessmentType} ({grade.term})</td>
                        <td className="py-4 font-bold dark:text-white">{grade.enrollment.student.firstName} {grade.enrollment.student.lastName}</td>
                        <td className="py-4 font-extrabold text-primary">{grade.score} / {grade.maxScore}</td>
                      </tr>
                    ))}
                    {historicalGrades.length === 0 && <tr><td colSpan="3" className="py-6 text-center text-gray-500">No grades have been published for this class yet.</td></tr>}
                  </tbody>
                </table>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherDashboard;