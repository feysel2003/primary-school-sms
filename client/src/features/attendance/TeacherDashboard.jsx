import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { BookOpen, Users, ArrowLeft, CheckCircle, XCircle, Clock, FileText, Save, User as UserIcon, Calendar, CheckSquare, Award } from 'lucide-react';
import apiClient from '../../utils/apiClient';

const TeacherDashboard = () => {
  const { t } = useTranslation();
  
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const[roster, setRoster] = useState([]);
  
  const [activeTab, setActiveTab] = useState('HISTORY_GRADES'); // Default to the new Gradebook for testing
  
  // States
  const[attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]); 
  const[attendanceRecords, setAttendanceRecords] = useState({});
  const [gradeRecords, setGradeRecords] = useState({});
  
  // --- NEW: ADVANCED GRADE STATES ---
  const [assessmentType, setAssessmentType] = useState('Midterm');
  const [maxScore, setMaxScore] = useState(30); // Dynamic Max Score!
  
  const[historicalGrades, setHistoricalGrades] = useState([]);
  const [historicalAttendance, setHistoricalAttendance] = useState([]);
  const[loading, setLoading] = useState(true);

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

  // 2. Load Roster AND Historical Data
  const handleSelectClass = async (classItem) => {
    setSelectedClass(classItem);
    setLoading(true);
    try {
      const rosterRes = await apiClient.get(`/teacher/roster/${classItem.sectionId}`);
      setRoster(rosterRes.data);
      
      const gradesRes = await apiClient.get(`/teacher/gradebook/${classItem.sectionId}/${classItem.subjectId}`);
      setHistoricalGrades(gradesRes.data);

      const attRes = await apiClient.get(`/teacher/attendance-history/${classItem.sectionId}`);
      setHistoricalAttendance(attRes.data);

      setAttendanceRecords({}); setGradeRecords({});
    } catch (error) { console.error('Failed to fetch class data'); } 
    finally { setLoading(false); }
  };

  const handleMarkAllPresent = () => {
    const allPresent = {};
    roster.forEach(enrollment => { allPresent[enrollment.id] = 'PRESENT'; });
    setAttendanceRecords(allPresent);
  };

  const handleSaveAttendance = async () => {
    if(Object.keys(attendanceRecords).length === 0) return alert("Please mark attendance for at least one student.");
    try {
      await apiClient.post('/attendance', { records: attendanceRecords, date: attendanceDate });
      alert("✅ Attendance saved! Parents notified.");
      handleSelectClass(selectedClass); 
    } catch (error) { alert("❌ Failed to save."); }
  };

  const handleSaveGrades = async () => {
    if(Object.keys(gradeRecords).length === 0) return alert("Please enter grades.");
    try {
      // Send maxScore to the backend!
      await apiClient.post('/grades', {
        subjectId: selectedClass.subjectId, 
        assessmentType, 
        maxScore: maxScore, // Send the dynamic max score
        term: 'Term 1', 
        records: gradeRecords
      });
      alert("✅ Grades published!");
      handleSelectClass(selectedClass); // Refresh history
    } catch (error) { alert("❌ Failed to save."); }
  };

  // ==========================================
  // THE AUTOMATED RANKING ENGINE (THE BRAINS!)
  // ==========================================
  const calculateGradebook = () => {
    // 1. Find all unique assessment types for the columns (e.g., "Test 1", "Midterm")
    const assessments = [...new Set(historicalGrades.map(g => g.assessmentType))];
    
    // 2. Build the Student Map
    let studentStats = roster.map(enrollment => {
      let stats = { id: enrollment.id, student: enrollment.student, grades: {}, total: 0 };
      
      // Look through historical grades and attach them to this student
      historicalGrades.forEach(g => {
        if (g.enrollmentId === enrollment.id) {
          stats.grades[g.assessmentType] = { score: g.score, max: g.maxScore };
          stats.total += g.score; // Sum up the total!
        }
      });
      return stats;
    });

    // 3. Sort by Total Score (Highest to Lowest)
    studentStats.sort((a, b) => b.total - a.total);

    // 4. Calculate Standard Competition Ranking (e.g., 1, 1, 3, 4)
    let currentRank = 1;
    studentStats.forEach((student, index) => {
      if (index > 0 && student.total < studentStats[index - 1].total) {
        currentRank = index + 1;
      }
      student.rank = student.total > 0 ? currentRank : '-'; // Only rank if they have marks
    });

    return { assessments, studentStats };
  };

  const { assessments, studentStats } = selectedClass ? calculateGradebook() : { assessments: [], studentStats:[] };
  
  // Attendance Matrix logic
  const uniqueDates = [...new Set(historicalAttendance.map(record => record.date.split('T')[0]))].sort((a, b) => new Date(b) - new Date(a));
  const attendanceMatrix = {};
  historicalAttendance.forEach(record => {
    const studentId = record.enrollment.student.id;
    if (!attendanceMatrix[studentId]) { attendanceMatrix[studentId] = { student: record.enrollment.student, records: {} }; }
    attendanceMatrix[studentId].records[record.date.split('T')[0]] = record.status;
  });

  if (loading && !selectedClass) return <div className="p-10 text-center text-gray-500 font-bold">Loading your classes...</div>;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      
      {/* HEADER */}
      <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-primary dark:text-blue-400 rounded-lg"><BookOpen size={28} /></div>
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Teacher Portal</h1>
            <p className="text-gray-500 dark:text-gray-400">
              {selectedClass ? `${selectedClass.subject.name} • ${selectedClass.section.gradeLevel.name} ${selectedClass.section.name}` : 'Select a class to manage.'}
            </p>
          </div>
        </div>
      </div>

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
        <div className="space-y-6">
          <button onClick={() => setSelectedClass(null)} className="flex items-center space-x-2 text-primary font-bold hover:underline mb-2">
            <ArrowLeft size={20} /> <span>Back to Classes</span>
          </button>

          {/* TABS */}
          <div className="flex flex-wrap gap-2 border-b border-gray-200 dark:border-gray-700 pb-4">
            <button onClick={() => setActiveTab('INPUT_ATTENDANCE')} className={`px-4 py-2 rounded-lg font-bold transition flex items-center gap-2 ${activeTab === 'INPUT_ATTENDANCE' ? 'bg-primary text-white' : 'bg-white text-gray-600 dark:bg-slate-800 dark:text-gray-300'}`}><CheckSquare size={18}/> Take Roll</button>
            <button onClick={() => setActiveTab('HISTORY_ATTENDANCE')} className={`px-4 py-2 rounded-lg font-bold transition flex items-center gap-2 ${activeTab === 'HISTORY_ATTENDANCE' ? 'bg-purple-600 text-white' : 'bg-white text-gray-600 dark:bg-slate-800 dark:text-gray-300'}`}><Calendar size={18}/> Attendance Matrix</button>
            <button onClick={() => setActiveTab('INPUT_GRADES')} className={`px-4 py-2 rounded-lg font-bold transition flex items-center gap-2 ${activeTab === 'INPUT_GRADES' ? 'bg-secondary text-white' : 'bg-white text-gray-600 dark:bg-slate-800 dark:text-gray-300'}`}><Save size={18}/> Enter Grades</button>
            <button onClick={() => setActiveTab('HISTORY_GRADES')} className={`px-4 py-2 rounded-lg font-bold transition flex items-center gap-2 ${activeTab === 'HISTORY_GRADES' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600 dark:bg-slate-800 dark:text-gray-300'}`}><FileText size={18}/> Gradebook & Ranks</button>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
            
            {/* --- TAB 1: ADVANCED TAKE ROLL --- */}
            {activeTab === 'INPUT_ATTENDANCE' && (
              <>
                <div className="bg-gray-50 dark:bg-slate-900/50 p-4 border-b border-gray-200 dark:border-gray-700 flex flex-wrap justify-between items-center gap-4">
                  <div className="flex items-center space-x-3">
                    <label className="text-sm font-bold text-gray-500 uppercase">Date:</label>
                    <input type="date" value={attendanceDate} onChange={(e) => setAttendanceDate(e.target.value)} className="p-2 border rounded-lg font-bold dark:bg-slate-800 dark:text-white outline-none" />
                  </div>
                  <button onClick={handleMarkAllPresent} className="bg-green-100 hover:bg-green-200 text-green-700 border border-green-300 px-4 py-2 rounded-lg font-bold transition flex items-center gap-2">
                    <CheckCircle size={18} /> Mark All Present
                  </button>
                </div>

                <div className="divide-y divide-gray-100 dark:divide-gray-700">
                  {roster.map((enrollment) => (
                    <div key={enrollment.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-gray-50 dark:hover:bg-slate-700/50">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500"><UserIcon size={20} /></div>
                        <div>
                          <h3 className="font-bold dark:text-white">{enrollment.student.firstName} {enrollment.student.lastName}</h3>
                          <p className="text-xs text-gray-500">{enrollment.student.studentId}</p>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        <button onClick={() => setAttendanceRecords({...attendanceRecords, [enrollment.id]: 'PRESENT'})} className={`px-3 py-1.5 rounded-lg text-sm font-bold border transition ${attendanceRecords[enrollment.id] === 'PRESENT' ? 'bg-green-500 text-white border-green-600' : 'bg-white text-gray-600'}`}>Present</button>
                        <button onClick={() => setAttendanceRecords({...attendanceRecords, [enrollment.id]: 'ABSENT'})} className={`px-3 py-1.5 rounded-lg text-sm font-bold border transition ${attendanceRecords[enrollment.id] === 'ABSENT' ? 'bg-red-500 text-white border-red-600' : 'bg-white text-gray-600'}`}>Absent</button>
                        <button onClick={() => setAttendanceRecords({...attendanceRecords, [enrollment.id]: 'LATE'})} className={`px-3 py-1.5 rounded-lg text-sm font-bold border transition ${attendanceRecords[enrollment.id] === 'LATE' ? 'bg-yellow-500 text-white border-yellow-600' : 'bg-white text-gray-600'}`}>Late</button>
                        <button onClick={() => setAttendanceRecords({...attendanceRecords, [enrollment.id]: 'EXCUSED'})} className={`px-3 py-1.5 rounded-lg text-sm font-bold border transition ${attendanceRecords[enrollment.id] === 'EXCUSED' ? 'bg-blue-500 text-white border-blue-600' : 'bg-white text-gray-600'}`}>Excused</button>
                      </div>
                    </div>
                  ))}
                  <div className="p-6 bg-gray-50 dark:bg-slate-900 flex justify-end">
                    <button onClick={handleSaveAttendance} className="bg-primary text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-blue-900">Submit Roll Call</button>
                  </div>
                </div>
              </>
            )}

            {/* --- TAB 2: HISTORY ATTENDANCE MATRIX --- */}
            {activeTab === 'HISTORY_ATTENDANCE' && (
              <div className="overflow-x-auto p-4">
                {uniqueDates.length === 0 ? (
                  <div className="text-center py-10 text-gray-500">No attendance data recorded yet.</div>
                ) : (
                  <table className="w-full text-left border-collapse min-w-max">
                    <thead>
                      <tr>
                        <th className="p-3 border-b-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-900 font-extrabold text-gray-700 dark:text-gray-300 sticky left-0 z-10">Student Name</th>
                        {uniqueDates.map(date => (
                          <th key={date} className="p-3 border-b-2 border-gray-200 dark:border-gray-700 font-bold text-gray-500 text-center whitespace-nowrap">
                            {new Date(date).toLocaleDateString('en-GB', { month: 'short', day: 'numeric' })}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {Object.values(attendanceMatrix).map((row) => (
                        <tr key={row.student.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-slate-700/50">
                          <td className="p-3 font-bold dark:text-white bg-white dark:bg-slate-800 sticky left-0 z-10 border-r border-gray-100 dark:border-gray-700 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                            {row.student.firstName} {row.student.lastName}
                          </td>
                          {uniqueDates.map(date => {
                            const status = row.records[date];
                            return (
                              <td key={date} className="p-3 text-center">
                                {status === 'PRESENT' && <CheckCircle size={20} className="text-green-500 mx-auto" />}
                                {status === 'ABSENT' && <XCircle size={20} className="text-red-500 mx-auto" />}
                                {status === 'LATE' && <Clock size={20} className="text-yellow-500 mx-auto" />}
                                {status === 'EXCUSED' && <FileText size={20} className="text-blue-500 mx-auto" />}
                                {!status && <span className="text-gray-300">-</span>}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}

            {/* --- TAB 3: INPUT GRADES (With Max Score) --- */}
            {activeTab === 'INPUT_GRADES' && (
              <>
                <div className="bg-gray-50 dark:bg-slate-900/50 p-6 border-b border-gray-200 flex flex-wrap gap-6 items-center">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Assessment Type</label>
                    <select value={assessmentType} onChange={(e) => setAssessmentType(e.target.value)} className="w-48 p-2 border rounded-lg font-bold outline-none dark:bg-slate-800 dark:text-white">
                      <option>Test 1</option><option>Test 2</option><option>Midterm</option><option>Final Exam</option><option>Project</option>
                    </select>
                  </div>
                  {/* NEW: DYNAMIC MAX SCORE INPUT */}
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Max Score</label>
                    <div className="flex items-center">
                      <input type="number" min="1" value={maxScore} onChange={(e) => setMaxScore(e.target.value)} className="w-24 p-2 border rounded-lg font-bold text-center outline-none dark:bg-slate-800 dark:text-white" />
                      <span className="ml-2 font-bold text-gray-400">%</span>
                    </div>
                  </div>
                </div>

                <div className="divide-y divide-gray-100 dark:divide-gray-700">
                  {roster.map((enrollment) => (
                    <div key={enrollment.id} className="p-4 sm:p-6 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-slate-700/50">
                      <div className="font-bold dark:text-white flex items-center gap-4">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-500"><UserIcon size={20} /></div>
                        {enrollment.student.firstName} {enrollment.student.lastName}
                      </div>
                      <div className="flex items-center space-x-2">
                        {/* INPUT CAPPED AT MAX SCORE */}
                        <input type="number" placeholder="0" min="0" max={maxScore} value={gradeRecords[enrollment.id] || ''} onChange={(e) => setGradeRecords({...gradeRecords, [enrollment.id]: e.target.value})} className="w-20 px-3 py-2 border rounded-lg text-center font-bold text-primary dark:bg-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-secondary"/>
                        <span className="text-gray-500 font-bold">/ {maxScore}</span>
                      </div>
                    </div>
                  ))}
                  <div className="p-6 bg-gray-50 dark:bg-slate-900 flex justify-end">
                    <button onClick={handleSaveGrades} className="bg-secondary text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:bg-green-700 transition">Publish {assessmentType} Grades</button>
                  </div>
                </div>
              </>
            )}

            {/* --- TAB 4: THE ENTERPRISE GRADEBOOK MATRIX --- */}
            {activeTab === 'HISTORY_GRADES' && (
               <div className="overflow-x-auto p-4">
                {assessments.length === 0 ? (
                  <div className="text-center py-10 text-gray-500">No assessments have been recorded yet.</div>
                ) : (
                  <table className="w-full text-left border-collapse min-w-max">
                    <thead>
                      <tr>
                        <th className="p-4 border-b-4 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-900 font-extrabold text-gray-700 dark:text-gray-300 sticky left-0 z-10">Rank</th>
                        <th className="p-4 border-b-4 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-900 font-extrabold text-gray-700 dark:text-gray-300 sticky left-12 z-10">Student Name</th>
                        
                        {/* Dynamic Columns for each Assessment */}
                        {assessments.map(ass => (
                          <th key={ass} className="p-4 border-b-4 border-gray-200 dark:border-gray-700 font-bold text-gray-500 text-center">
                            {ass}
                          </th>
                        ))}
                        
                        {/* Total Score Column */}
                        <th className="p-4 border-b-4 border-secondary bg-green-50 dark:bg-green-900/20 text-secondary font-extrabold text-center">TOTAL</th>
                      </tr>
                    </thead>
                    <tbody>
                      {studentStats.map((row) => (
                        <tr key={row.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-slate-700/50">
                          
                          {/* RANK BADGE */}
                          <td className="p-4 font-extrabold sticky left-0 z-10 bg-white dark:bg-slate-800">
                            {row.rank === 1 ? <span className="flex items-center text-yellow-600 bg-yellow-100 px-2 py-1 rounded-lg"><Award size={16} className="mr-1"/> 1st</span> : <span className="text-gray-500">{row.rank}</span>}
                          </td>
                          
                          <td className="p-4 font-bold dark:text-white bg-white dark:bg-slate-800 sticky left-12 z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                            {row.student.firstName} {row.student.lastName}
                          </td>
                          
                          {/* DYNAMIC GRADE CELLS */}
                          {assessments.map(ass => {
                            const grade = row.grades[ass];
                            return (
                              <td key={ass} className="p-4 text-center font-medium dark:text-gray-300">
                                {grade ? `${grade.score} / ${grade.max}` : '-'}
                              </td>
                            );
                          })}
                          
                          {/* TOTAL SUM */}
                          <td className="p-4 text-center font-extrabold text-lg text-primary bg-blue-50/50 dark:bg-blue-900/10">
                            {row.total} <span className="text-xs text-gray-400">/ 100</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherDashboard;