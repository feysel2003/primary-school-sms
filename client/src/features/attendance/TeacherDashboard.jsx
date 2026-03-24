import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { BookOpen, Users, ArrowLeft, CheckCircle, XCircle, Save, User as UserIcon } from 'lucide-react';
import apiClient from '../../utils/apiClient';

const TeacherDashboard = () => {
  const { t } = useTranslation();
  
  // States
  const[classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null); // The class they clicked on
  const [roster, setRoster] = useState([]); // The students in that class
  
  const [activeTab, setActiveTab] = useState('ATTENDANCE'); // ATTENDANCE or GRADES
  const [attendanceRecords, setAttendanceRecords] = useState({});
  const [gradeRecords, setGradeRecords] = useState({});
  const [assessmentType, setAssessmentType] = useState('Midterm');
  
  const[loading, setLoading] = useState(true);

  // 1. Fetch Teacher's Classes on Load
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await apiClient.get('/teachers/my-classes');
        setClasses(response.data);
      } catch (error) {
        console.error('Failed to fetch classes', error);
      } finally {
        setLoading(false);
      }
    };
    fetchClasses();
  }, new Array(0));

  // 2. Fetch Roster when a class is selected
  const handleSelectClass = async (classItem) => {
    setSelectedClass(classItem);
    setLoading(true);
    try {
      const response = await apiClient.get(`/teachers/roster/${classItem.sectionId}`);
      setRoster(response.data); // These are Enrollment records
      setAttendanceRecords({}); // Reset forms
      setGradeRecords({});
    } catch (error) {
      console.error('Failed to fetch roster', error);
    } finally {
      setLoading(false);
    }
  };

  // 3. Fake Submit Handlers (To protect our previous backend code until we fully upgrade the save endpoints)
  const handleSaveAttendance = () => {
    alert("✅ Attendance marked for " + selectedClass.section.name);
  };

  const handleSaveGrades = () => {
    alert(`✅ ${selectedClass.subject.name} Grades published successfully!`);
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
            {selectedClass ? `${selectedClass.subject.name} • ${selectedClass.section.gradeLevel.name} ${selectedClass.section.name}` : 'Select a class to manage attendance and grades.'}
          </p>
        </div>
      </div>

      {/* VIEW 1: CLASS SELECTION GRID */}
      {!selectedClass ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.length === 0 && !loading && (
             <div className="col-span-full p-8 text-center bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
               <p className="text-gray-500">You are not assigned to any classes this year.</p>
             </div>
          )}
          {classes.map((cls) => (
            <div 
              key={cls.id} 
              onClick={() => handleSelectClass(cls)}
              className="bg-white dark:bg-slate-800 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 p-6 cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-primary/10 text-primary rounded-xl group-hover:bg-primary group-hover:text-white transition">
                  <BookOpen size={24} />
                </div>
                <span className="bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 px-3 py-1 rounded-full text-xs font-bold">
                  {cls.subject.code || 'SUBJ'}
                </span>
              </div>
              <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">{cls.subject.name}</h2>
              <p className="text-gray-500 dark:text-gray-400 font-medium flex items-center gap-2 mt-2">
                <Users size={16} /> {cls.section.gradeLevel.name} - {cls.section.name}
              </p>
            </div>
          ))}
        </div>
      ) : (
        
        /* VIEW 2: ROSTER & DATA ENTRY */
        <div className="space-y-6">
          
          <button onClick={() => setSelectedClass(null)} className="flex items-center space-x-2 text-primary dark:text-blue-400 font-bold hover:underline mb-2">
            <ArrowLeft size={20} /> <span>Back to My Classes</span>
          </button>

          {/* TAB TOGGLES */}
          <div className="flex space-x-4">
            <button onClick={() => setActiveTab('ATTENDANCE')} className={`px-6 py-3 rounded-lg font-bold transition shadow-sm ${activeTab === 'ATTENDANCE' ? 'bg-primary text-white' : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50'}`}>Daily Attendance</button>
            <button onClick={() => setActiveTab('GRADES')} className={`px-6 py-3 rounded-lg font-bold transition shadow-sm ${activeTab === 'GRADES' ? 'bg-secondary text-white' : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50'}`}>Input Grades</button>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
            
            {activeTab === 'GRADES' && (
              <div className="bg-gray-50 dark:bg-slate-900/50 p-4 border-b border-gray-200 dark:border-gray-700">
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Assessment Type</label>
                <select value={assessmentType} onChange={(e) => setAssessmentType(e.target.value)} className="w-64 p-2 border rounded-lg dark:bg-slate-800 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-secondary outline-none">
                  <option>Midterm</option>
                  <option>Final Exam</option>
                  <option>Test 1</option>
                  <option>Project</option>
                </select>
              </div>
            )}

            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {loading ? (
                <div className="p-8 text-center text-gray-500">Loading roster...</div>
              ) : roster.length === 0 ? (
                <div className="p-8 text-center text-gray-500">No students enrolled in this section.</div>
              ) : roster.map((enrollment) => (
                <div key={enrollment.id} className="p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center space-x-4 w-full sm:w-auto">
                    <div className="w-10 h-10 bg-gray-100 dark:bg-slate-600 rounded-full flex items-center justify-center text-gray-500 dark:text-gray-300"><UserIcon size={20} /></div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">{enrollment.student.firstName} {enrollment.student.lastName}</h3>
                      <p className="text-xs text-gray-500 font-mono">{enrollment.student.studentId}</p>
                    </div>
                  </div>

                  <div className="w-full sm:w-auto">
                    {activeTab === 'ATTENDANCE' ? (
                      <div className="flex space-x-2">
                        <button onClick={() => setAttendanceRecords({...attendanceRecords, [enrollment.id]: 'PRESENT'})} className={`px-4 py-2 rounded-lg font-bold border transition ${attendanceRecords[enrollment.id] === 'PRESENT' ? 'bg-green-100 border-green-500 text-green-700' : 'bg-white border-gray-200 text-gray-600'}`}>Present</button>
                        <button onClick={() => setAttendanceRecords({...attendanceRecords, [enrollment.id]: 'ABSENT'})} className={`px-4 py-2 rounded-lg font-bold border transition ${attendanceRecords[enrollment.id] === 'ABSENT' ? 'bg-red-100 border-red-500 text-red-700' : 'bg-white border-gray-200 text-gray-600'}`}>Absent</button>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <input type="number" placeholder="0" min="0" max="100" value={gradeRecords[enrollment.id] || ''} onChange={(e) => setGradeRecords({...gradeRecords, [enrollment.id]: e.target.value})} className="w-20 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-center font-bold dark:bg-slate-900 dark:text-white focus:ring-2 focus:ring-secondary outline-none"/>
                        <span className="text-gray-500 font-bold">/ 100</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-6 bg-gray-50 dark:bg-slate-900 border-t flex justify-end">
              <button onClick={activeTab === 'ATTENDANCE' ? handleSaveAttendance : handleSaveGrades} className={`flex items-center space-x-2 text-white px-6 py-3 rounded-xl font-bold shadow-lg transition ${activeTab === 'ATTENDANCE' ? 'bg-primary hover:bg-blue-900' : 'bg-secondary hover:bg-green-700'}`}>
                <Save size={20} /><span>{activeTab === 'ATTENDANCE' ? 'Submit Roll Call' : 'Publish Grades'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherDashboard;