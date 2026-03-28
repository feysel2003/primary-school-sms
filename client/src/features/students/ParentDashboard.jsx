import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { GraduationCap, User, CheckCircle, XCircle, BookOpen, Clock, AlertTriangle, Calendar, Award, Activity } from 'lucide-react';
import apiClient from '../../utils/apiClient';

const ParentDashboard = () => {
  const { t } = useTranslation();
  const user = useSelector((state) => state.auth.user);
  const children = user?.children || [];

  const[recentAttendance, setRecentAttendance] = useState([]);
  const [recentGrades, setRecentGrades] = useState([]);
  const [loading, setLoading] = useState(true);

  // NEW: State to track which child the parent is currently viewing!
  const [selectedChildId, setSelectedChildId] = useState(children.length > 0 ? children[0].id : null);
  const [activeTab, setActiveTab] = useState('REPORT_CARD'); // REPORT_CARD or ATTENDANCE

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [attendanceRes, gradesRes] = await Promise.all([
          apiClient.get('/attendance/parent'),
          apiClient.get('/grades/parent')
        ]);
        setRecentAttendance(attendanceRes.data);
        setRecentGrades(gradesRes.data);
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, new Array(0));

  // ==========================================
  // DATA PROCESSING (Filtering for Selected Child)
  // ==========================================
  
  // 1. Filter raw data for the selected child
  const childGrades = recentGrades.filter(g => g.enrollment.student.id === selectedChildId);
  const childAttendance = recentAttendance.filter(a => a.enrollment.student.id === selectedChildId);

  // 2. Calculate Attendance Analytics
  const attendanceStats = { present: 0, absent: 0, late: 0, excused: 0 };
  childAttendance.forEach(a => {
    if (a.status === 'PRESENT') attendanceStats.present++;
    if (a.status === 'ABSENT') attendanceStats.absent++;
    if (a.status === 'LATE') attendanceStats.late++;
    if (a.status === 'EXCUSED') attendanceStats.excused++;
  });

  // 3. Build the Digital Report Card (Group grades by Subject)
  const reportCard = {};
  childGrades.forEach(g => {
    const subjectName = g.subject.name;
    if (!reportCard[subjectName]) {
      reportCard[subjectName] = { subject: subjectName, assessments:[], totalScore: 0, outOf: 0 };
    }
    reportCard[subjectName].assessments.push(g);
    reportCard[subjectName].totalScore += g.score;
    reportCard[subjectName].outOf += g.maxScore;
  });

  const selectedChildObj = children.find(c => c.id === selectedChildId);

  if (loading) return <div className="p-10 text-center text-gray-500 font-bold">Loading secure student data...</div>;

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      
      {/* HEADER & CHILD SELECTOR */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-md p-6 border border-gray-200 dark:border-gray-700">
        <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-4">Select Child Profile</h1>
        
        <div className="flex flex-wrap gap-4">
          {children.length === 0 ? (
            <p className="text-red-500 font-bold">No children linked to your account. Contact the school.</p>
          ) : (
            children.map(child => (
              <button 
                key={child.id}
                onClick={() => setSelectedChildId(child.id)}
                className={`flex items-center space-x-4 p-4 rounded-xl border-2 transition-all duration-300 ${
                  selectedChildId === child.id 
                    ? 'border-primary bg-blue-50 dark:bg-blue-900/20 shadow-md' 
                    : 'border-transparent bg-gray-50 dark:bg-slate-700 hover:border-gray-300'
                }`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                  selectedChildId === child.id ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600 dark:bg-slate-600 dark:text-gray-300'
                }`}>
                  {child.firstName.charAt(0)}
                </div>
                <div className="text-left">
                  <h2 className={`font-extrabold text-lg ${selectedChildId === child.id ? 'text-primary dark:text-blue-400' : 'text-gray-800 dark:text-white'}`}>
                    {child.firstName} {child.lastName}
                  </h2>
                  <p className="text-sm font-medium text-gray-500 flex items-center gap-1">
                    <GraduationCap size={14} /> {child.grade}
                  </p>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {selectedChildId && (
        <div className="space-y-6">
          
          {/* TABS */}
          <div className="flex space-x-4 border-b border-gray-200 dark:border-gray-700 pb-4">
            <button 
              onClick={() => setActiveTab('REPORT_CARD')} 
              className={`px-6 py-3 rounded-xl font-bold transition flex items-center gap-2 ${activeTab === 'REPORT_CARD' ? 'bg-primary text-white shadow-md' : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50'}`}
            >
              <Award size={20}/> Digital Report Card
            </button>
            <button 
              onClick={() => setActiveTab('ATTENDANCE')} 
              className={`px-6 py-3 rounded-xl font-bold transition flex items-center gap-2 ${activeTab === 'ATTENDANCE' ? 'bg-secondary text-white shadow-md' : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50'}`}
            >
              <Calendar size={20}/> Attendance & Analytics
            </button>
          </div>

          {/* === VIEW 1: DIGITAL REPORT CARD === */}
          {activeTab === 'REPORT_CARD' && (
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="p-6 bg-blue-50/50 dark:bg-slate-900/50 border-b border-gray-200 dark:border-gray-700 flex items-center gap-3">
                <BookOpen className="text-primary" size={28} />
                <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">Academic Performance</h2>
              </div>

              {Object.keys(reportCard).length === 0 ? (
                <div className="p-10 text-center text-gray-500 font-medium">No grades have been published for {selectedChildObj?.firstName} yet.</div>
              ) : (
                <div className="p-6 space-y-6">
                  {Object.values(reportCard).map((subjectData) => {
                    // Calculate Subject Average
                    const percentage = subjectData.outOf > 0 ? Math.round((subjectData.totalScore / subjectData.outOf) * 100) : 0;
                    
                    return (
                      <div key={subjectData.subject} className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                        
                        {/* Subject Header */}
                        <div className="bg-gray-50 dark:bg-slate-900 p-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
                          <h3 className="text-xl font-extrabold text-gray-800 dark:text-white">{subjectData.subject}</h3>
                          <div className={`px-4 py-1.5 rounded-lg font-extrabold text-lg ${
                            percentage >= 80 ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400' : 
                            percentage >= 50 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400' : 
                            'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400'
                          }`}>
                            Average: {percentage}%
                          </div>
                        </div>

                        {/* Assessments Breakdown */}
                        <div className="divide-y divide-gray-100 dark:divide-gray-700 bg-white dark:bg-slate-800">
                          {subjectData.assessments.map((assessment) => (
                            <div key={assessment.id} className="p-4 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-slate-700/50 transition">
                              <div>
                                <p className="font-bold text-gray-900 dark:text-white">{assessment.assessmentType}</p>
                                <p className="text-xs text-gray-500">{new Date(assessment.createdAt).toDateString()}</p>
                              </div>
                              <div className="text-right">
                                <span className="text-xl font-extrabold text-gray-800 dark:text-white">{assessment.score}</span>
                                <span className="text-sm font-bold text-gray-400"> / {assessment.maxScore}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* === VIEW 2: ATTENDANCE & ANALYTICS === */}
          {activeTab === 'ATTENDANCE' && (
            <div className="space-y-6">
              
              {/* Analytics KPI Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border-b-4 border-green-500">
                  <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Present</p>
                  <p className="text-3xl font-extrabold text-gray-900 dark:text-white">{attendanceStats.present}</p>
                </div>
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border-b-4 border-red-500">
                  <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Absent</p>
                  <p className="text-3xl font-extrabold text-gray-900 dark:text-white">{attendanceStats.absent}</p>
                </div>
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border-b-4 border-yellow-500">
                  <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Late</p>
                  <p className="text-3xl font-extrabold text-gray-900 dark:text-white">{attendanceStats.late}</p>
                </div>
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border-b-4 border-blue-500">
                  <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Excused</p>
                  <p className="text-3xl font-extrabold text-gray-900 dark:text-white">{attendanceStats.excused}</p>
                </div>
              </div>

              {/* History Log */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="p-6 bg-gray-50 dark:bg-slate-900/50 border-b border-gray-200 dark:border-gray-700 flex items-center gap-3">
                  <Activity className="text-secondary" size={28} />
                  <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">Recent Attendance Log</h2>
                </div>
                
                {childAttendance.length === 0 ? (
                  <div className="p-10 text-center text-gray-500 font-medium">No attendance records found.</div>
                ) : (
                  <div className="divide-y divide-gray-100 dark:divide-gray-700">
                    {childAttendance.map((record) => (
                      <div key={record.id} className="p-4 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-slate-700/50 transition">
                        <div className="flex items-center gap-3">
                          <Clock size={20} className="text-gray-400" />
                          <span className="font-bold text-gray-800 dark:text-white">{new Date(record.date).toDateString()}</span>
                        </div>
                        <div>
                          {record.status === 'PRESENT' && <span className="bg-green-100 text-green-700 px-4 py-1.5 rounded-full text-sm font-bold">Present</span>}
                          {record.status === 'ABSENT' && <span className="bg-red-100 text-red-700 px-4 py-1.5 rounded-full text-sm font-bold">Absent</span>}
                          {record.status === 'LATE' && <span className="bg-yellow-100 text-yellow-700 px-4 py-1.5 rounded-full text-sm font-bold">Late</span>}
                          {record.status === 'EXCUSED' && <span className="bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-sm font-bold">Excused</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          )}

        </div>
      )}
    </div>
  );
};

export default ParentDashboard;