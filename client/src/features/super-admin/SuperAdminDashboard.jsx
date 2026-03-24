import { useState, useEffect } from 'react';
import { Building2, Users, GraduationCap, Activity, ShieldAlert } from 'lucide-react';
import apiClient from '../../utils/apiClient';

const SuperAdminDashboard = () => {
  const [data, setData] = useState({ stats: {}, schools: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const response = await apiClient.get('/tenants/overview');
        setData(response.data);
      } catch (error) {
        console.error("Failed to fetch system overview", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOverview();
  }, new Array(0));

  if (loading) return <div className="p-10 text-center font-bold text-gray-500">Loading System Core...</div>;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
      {/* HEADER */}
      <div className="flex items-center justify-between bg-gradient-to-r from-gray-900 to-slate-800 p-8 rounded-3xl shadow-2xl text-white">
        <div>
          <h1 className="text-3xl font-extrabold flex items-center gap-3">
            <ShieldAlert className="text-red-400" size={36} />
            System Owner Console
          </h1>
          <p className="text-gray-300 mt-2 font-medium">Global overview of the Digital School SMS Platform.</p>
        </div>
        <div className="hidden md:block text-right">
          <p className="text-sm text-gray-400 font-bold uppercase tracking-wider">System Status</p>
          <p className="text-2xl font-black text-green-400 flex items-center gap-2">
            <span className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></span> All Systems Operational
          </p>
        </div>
      </div>

      {/* GLOBAL STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 flex items-center space-x-4">
          <div className="p-4 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 rounded-full"><Building2 size={28} /></div>
          <div>
            <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Active Schools</p>
            <p className="text-3xl font-extrabold text-gray-900 dark:text-white">{data.stats.totalSchools}</p>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 flex items-center space-x-4">
          <div className="p-4 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full"><GraduationCap size={28} /></div>
          <div>
            <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Total Students</p>
            <p className="text-3xl font-extrabold text-gray-900 dark:text-white">{data.stats.totalStudents}</p>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 flex items-center space-x-4">
          <div className="p-4 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-full"><Users size={28} /></div>
          <div>
            <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Total User Accounts</p>
            <p className="text-3xl font-extrabold text-gray-900 dark:text-white">{data.stats.totalUsers}</p>
          </div>
        </div>
      </div>

      {/* SCHOOLS DATA TABLE */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-slate-900/50 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Activity className="text-secondary" /> Registered Tenants (Schools)
          </h2>
          <button className="bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-4 py-2 rounded-lg font-bold text-sm hover:opacity-80 transition">
            + Onboard New School
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-slate-900 text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">
                <th className="p-4 font-bold">School Name</th>
                <th className="p-4 font-bold">Subdomain</th>
                <th className="p-4 font-bold">Students</th>
                <th className="p-4 font-bold">Status</th>
                <th className="p-4 font-bold">Joined Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {data.schools.map((school) => (
                <tr key={school.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition">
                  <td className="p-4 font-bold text-gray-900 dark:text-white">{school.name}</td>
                  <td className="p-4 text-gray-500 dark:text-gray-400 font-mono text-sm">{school.subdomain}.yoursystem.com</td>
                  <td className="p-4 font-bold text-gray-700 dark:text-gray-300">{school._count.students}</td>
                  <td className="p-4">
                    <span className="bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400 px-3 py-1 rounded-full text-xs font-bold border border-green-200 dark:border-green-800">
                      {school.status}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-gray-500 dark:text-gray-400">{new Date(school.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default SuperAdminDashboard;