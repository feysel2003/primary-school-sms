import { useState, useEffect } from 'react';
import { BookOpen, CheckCircle, AlertCircle, Link as LinkIcon } from 'lucide-react';
import apiClient from '../../utils/apiClient';

const Academics = () => {
  const [setupData, setSetupData] = useState({ teachers:[], subjects: [], sections: [], activeYear: null });
  const [formData, setFormData] = useState({ teacherId: '', subjectId: '', sectionId: '' });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchSetup = async () => {
      try {
        const res = await apiClient.get('/academics/setup');
        setSetupData(res.data);
      } catch (err) {
        console.error("Failed to load academic data");
      }
    };
    fetchSetup();
  }, new Array(0));

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const payload = { ...formData, academicYearId: setupData.activeYear.id };
      const res = await apiClient.post('/academics/assign', payload);
      
      setMessage({ type: 'success', text: res.data.message });
      setFormData({ teacherId: '', subjectId: '', sectionId: '' }); // Reset form
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Assignment failed.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white flex items-center gap-3">
          <BookOpen className="text-primary" size={36} />
          Academic Configuration
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Assign Teachers to Subjects and Sections for {setupData.activeYear?.yearName || 'the current year'}.
        </p>
      </div>

      {message.text && (
        <div className={`p-4 rounded-xl flex items-center gap-3 font-bold ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message.type === 'success' ? <CheckCircle size={24} /> : <AlertCircle size={24} />}
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        
        <div className="p-6 md:p-8 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-slate-900/50">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
            <LinkIcon className="text-secondary" /> Link Teacher to Class
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* TEACHER DROPDOWN */}
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">1. Select Teacher</label>
              <select name="teacherId" required value={formData.teacherId} onChange={handleChange} className="w-full p-3 bg-white dark:bg-slate-800 border border-gray-300 dark:border-gray-600 rounded-lg dark:text-white focus:ring-2 focus:ring-primary outline-none">
                <option value="" disabled>Choose a teacher...</option>
                {setupData.teachers.map(t => (
                  <option key={t.id} value={t.id}>Teacher: {t.phone}</option>
                ))}
              </select>
            </div>

            {/* SUBJECT DROPDOWN */}
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">2. Select Subject</label>
              <select name="subjectId" required value={formData.subjectId} onChange={handleChange} className="w-full p-3 bg-white dark:bg-slate-800 border border-gray-300 dark:border-gray-600 rounded-lg dark:text-white focus:ring-2 focus:ring-primary outline-none">
                <option value="" disabled>Choose a subject...</option>
                {setupData.subjects.map(s => (
                  <option key={s.id} value={s.id}>{s.name} ({s.code || 'N/A'})</option>
                ))}
              </select>
            </div>

            {/* SECTION DROPDOWN */}
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">3. Select Class / Section</label>
              <select name="sectionId" required value={formData.sectionId} onChange={handleChange} className="w-full p-3 bg-white dark:bg-slate-800 border border-gray-300 dark:border-gray-600 rounded-lg dark:text-white focus:ring-2 focus:ring-primary outline-none">
                <option value="" disabled>Choose a section...</option>
                {setupData.sections.map(s => (
                  <option key={s.id} value={s.id}>{s.gradeLevel.name} - {s.name}</option>
                ))}
              </select>
            </div>

          </div>
        </div>

        <div className="p-6 bg-white dark:bg-slate-800 flex justify-end">
          <button type="submit" disabled={isLoading} className={`px-8 py-3 rounded-xl font-bold text-lg text-white shadow-xl transition-all ${isLoading ? 'bg-gray-400' : 'bg-primary hover:bg-blue-900 hover:-translate-y-1'}`}>
            {isLoading ? 'Saving...' : 'Assign Class'}
          </button>
        </div>
      </form>
      
    </div>
  );
};

export default Academics;