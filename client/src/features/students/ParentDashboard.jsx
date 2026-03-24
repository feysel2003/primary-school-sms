import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { GraduationCap, User, CheckCircle, XCircle, BookOpen, Award } from 'lucide-react';
import apiClient from '../../utils/apiClient';

const ParentDashboard = () => {
  const { t } = useTranslation();
  
  const user = useSelector((state) => state.auth.user);
  const children = user?.children ||[];

  // State to hold BOTH Attendance and Grades
  const [recentAttendance, setRecentAttendance] = useState([]);
  const [recentGrades, setRecentGrades] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch both attendance and grades at the same time!
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

  useEffect(() => {
    fetchDashboardData();
  }, new Array(0)); // Our trusty trick!

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
          Welcome back!
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Here is the latest update on your children.
        </p>
      </div>

      {/* CHILDREN PROFILE CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {children.length > 0 ? (
          children.map((child) => (
            <div key={child.id} className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border-t-4 border-secondary overflow-hidden">
              <div className="p-6 flex items-center space-x-4">
                <div className="w-14 h-14 bg-green-100 dark:bg-green-900/30 text-secondary rounded-full flex items-center justify-center">
                  <User size={28} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                    {child.firstName} {child.lastName}
                  </h2>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1 space-x-1">
                    <GraduationCap size={16} />
                    <span>{child.grade}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full bg-white dark:bg-slate-800 p-8 rounded-2xl text-center border border-gray-200 dark:border-gray-700">
            <p className="text-gray-500 dark:text-gray-400">No children linked to this account.</p>
          </div>
        )}
      </div>

      {/* TWO-COLUMN LAYOUT FOR DATA */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* === LEFT COLUMN: RECENT GRADES === */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-md p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2 mb-6 border-b border-gray-100 dark:border-gray-700 pb-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-primary rounded-lg">
              <BookOpen size={20} />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Grades</h2>
          </div>
          
          {loading ? (
            <p className="text-gray-500 dark:text-gray-400 font-medium">Loading grades...</p>
          ) : recentGrades.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 font-medium bg-gray-50 dark:bg-slate-900 p-4 rounded-lg">No grades published yet.</p>
          ) : (
            <div className="space-y-4">
              {recentGrades.map((grade) => (
                <div key={grade.id} className="flex justify-between items-center p-4 bg-gray-50 dark:bg-slate-700/50 rounded-xl border border-gray-100 dark:border-gray-600 transition hover:shadow-sm">
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white flex items-center space-x-2">
                      <span>{grade.subject}</span>
                      <span className="text-xs font-bold text-primary bg-blue-100 dark:bg-blue-900/50 px-2 py-0.5 rounded-full">{grade.assessmentType}</span>
                    </p>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-1">
                      {grade.student.firstName} • {grade.term}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`text-2xl font-extrabold ${grade.score >= 80 ? 'text-green-600 dark:text-green-400' : grade.score >= 50 ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'}`}>
                      {grade.score}
                    </p>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Out of {grade.maxScore}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* === RIGHT COLUMN: ATTENDANCE HISTORY === */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-md p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2 mb-6 border-b border-gray-100 dark:border-gray-700 pb-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 text-secondary rounded-lg">
              <CheckCircle size={20} />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Attendance History</h2>
          </div>
          
          {loading ? (
            <p className="text-gray-500 dark:text-gray-400 font-medium">Loading attendance...</p>
          ) : recentAttendance.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 font-medium bg-gray-50 dark:bg-slate-900 p-4 rounded-lg">No attendance records found yet.</p>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {recentAttendance.map((record) => (
                <div key={record.id} className="py-3 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-slate-700/50 px-2 rounded-lg transition">
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white">
                      {record.student.firstName} {record.student.lastName}
                    </p>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {new Date(record.date).toDateString()}
                    </p>
                  </div>
                  <div>
                    {record.status === 'PRESENT' ? (
                      <span className="flex items-center text-green-700 bg-green-100 dark:bg-green-900/40 dark:text-green-400 px-3 py-1 rounded-full text-sm font-bold border border-green-200 dark:border-green-800">
                        <CheckCircle size={16} className="mr-1" /> Present
                      </span>
                    ) : (
                      <span className="flex items-center text-red-700 bg-red-100 dark:bg-red-900/40 dark:text-red-400 px-3 py-1 rounded-full text-sm font-bold border border-red-200 dark:border-red-800">
                        <XCircle size={16} className="mr-1" /> Absent
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
};

export default ParentDashboard;