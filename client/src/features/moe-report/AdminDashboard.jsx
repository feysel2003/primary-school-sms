import { useState } from 'react';
import { Download, Users, ShieldCheck, FileSpreadsheet, Activity } from 'lucide-react';
import apiClient from '../../utils/apiClient';

const AdminDashboard = () => {
  const [isDownloading, setIsDownloading] = useState(false);

  // The function to download the CSV file securely
  const handleDownloadMoEReport = async () => {
    setIsDownloading(true);
    try {
      // We must tell Axios we are expecting a "blob" (a file, not JSON)
      const response = await apiClient.get('/moe/export', { responseType: 'blob' });
      
      // Create a temporary hidden link in the browser to force the file download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'MoE_Student_Registration_Report_2026.csv');
      document.body.appendChild(link);
      link.click();
      
      // Clean up the hidden link
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error("Failed to download MoE report", error);
      alert("Failed to generate report. Make sure students exist in the system.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white flex items-center gap-3">
          <ShieldCheck className="text-secondary" size={36} />
          School Admin Console
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Manage your school's compliance, analytics, and settings.
        </p>
      </div>

      {/* TOP ANALYTICS CARDS (Placeholders for future stats) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 flex items-center space-x-4">
          <div className="p-4 bg-blue-100 dark:bg-blue-900/30 text-primary rounded-full">
            <Users size={28} />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Total Students</p>
            <p className="text-3xl font-extrabold text-gray-900 dark:text-white">1</p>
          </div>
        </div>
        
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 flex items-center space-x-4">
          <div className="p-4 bg-green-100 dark:bg-green-900/30 text-secondary rounded-full">
            <Activity size={28} />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Avg Attendance</p>
            <p className="text-3xl font-extrabold text-gray-900 dark:text-white">100%</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 flex items-center space-x-4">
          <div className="p-4 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-full">
            <FileSpreadsheet size={28} />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">Tuition Collected</p>
            <p className="text-3xl font-extrabold text-gray-900 dark:text-white">0 ETB</p>
          </div>
        </div>
      </div>

      {/* MINISTRY OF EDUCATION COMPLIANCE SECTION */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border-t-4 border-primary overflow-hidden">
        <div className="p-8 md:flex md:items-center md:justify-between">
          <div className="md:w-2/3">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Ministry of Education (MoE) Export
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2 leading-relaxed">
              Generate a perfectly formatted CSV document containing all registered students, grades, demographics, and parent contact information. This format complies with the standard Ethiopian MoE yearly submission requirements.
            </p>
          </div>
          
          <div className="mt-6 md:mt-0 md:w-1/3 flex justify-end">
            <button 
              onClick={handleDownloadMoEReport}
              disabled={isDownloading}
              className={`flex items-center space-x-2 px-6 py-4 rounded-xl font-bold text-lg shadow-xl transition-all duration-300 ${isDownloading ? 'bg-gray-400 cursor-not-allowed text-white' : 'bg-primary hover:bg-blue-900 text-white hover:shadow-2xl hover:-translate-y-1'}`}
            >
              <Download size={24} className={isDownloading ? 'animate-bounce' : ''} />
              <span>{isDownloading ? 'Compiling Data...' : 'Download CSV File'}</span>
            </button>
          </div>
        </div>
        
        <div className="bg-blue-50 dark:bg-slate-900/50 p-4 border-t border-gray-100 dark:border-gray-700">
          <p className="text-sm text-primary dark:text-blue-400 font-medium flex items-center justify-center space-x-2">
            <ShieldCheck size={16} />
            <span>This data is encrypted and securely pulled directly from your active database.</span>
          </p>
        </div>
      </div>

    </div>
  );
};

export default AdminDashboard;