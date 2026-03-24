import { useState, useEffect } from 'react';
import { UserPlus, GraduationCap, Phone, CheckCircle, AlertCircle } from 'lucide-react';
import apiClient from '../../utils/apiClient';

const StudentRegistration = () => {
  const [setupData, setSetupData] = useState({ activeYear: null, gradeLevels:[] });
  const [sections, setSections] = useState([]); // Filtered sections based on grade selected
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    studentId: '', firstName: '', lastName: '', gender: 'MALE',
    parentPhone: '', studentPhone: '', 
    gradeLevelId: '', sectionId: ''
  });

  // Fetch the Academic Year and Grades when the page loads
  useEffect(() => {
    const fetchSetup = async () => {
      try {
        const res = await apiClient.get('/students/setup');
        setSetupData(res.data);
      } catch (err) {
        console.error("Failed to load setup data");
      }
    };
    fetchSetup();
  }, new Array(0));

  // Handle Input Changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // If they change the Grade Level, update the Sections dropdown!
    if (name === 'gradeLevelId') {
      const selectedGrade = setupData.gradeLevels.find(g => g.id === value);
      setSections(selectedGrade ? selectedGrade.sections :[]);
      setFormData(prev => ({ ...prev, gradeLevelId: value, sectionId: '' })); // Reset section
    }
  };

  // Submit the Form!
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const payload = { ...formData, academicYearId: setupData.activeYear.id };
      const res = await apiClient.post('/students/register', payload);
      
      setMessage({ type: 'success', text: res.data.message });
      // Reset form
      setFormData({ studentId: '', firstName: '', lastName: '', gender: 'MALE', parentPhone: '', studentPhone: '', gradeLevelId: '', sectionId: '' });
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Registration failed.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white flex items-center gap-3">
          <GraduationCap className="text-primary" size={36} />
          Student Admissions & Enrollment
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Register new students and assign them to classes for {setupData.activeYear?.yearName || 'the current academic year'}.
        </p>
      </div>

      {message.text && (
        <div className={`p-4 rounded-xl flex items-center gap-3 font-bold ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message.type === 'success' ? <CheckCircle size={24} /> : <AlertCircle size={24} />}
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        
        {/* SECTION 1: STUDENT INFO */}
        <div className="p-6 md:p-8 border-b border-gray-100 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
            <UserPlus className="text-secondary" /> 1. Student Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Physical School ID</label>
              <input type="text" name="studentId" required placeholder="e.g. ETS-015/18" value={formData.studentId} onChange={handleChange} className="w-full p-3 bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-gray-600 rounded-lg dark:text-white focus:ring-2 focus:ring-primary outline-none" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Gender</label>
              <select name="gender" value={formData.gender} onChange={handleChange} className="w-full p-3 bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-gray-600 rounded-lg dark:text-white focus:ring-2 focus:ring-primary outline-none">
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">First Name</label>
              <input type="text" name="firstName" required value={formData.firstName} onChange={handleChange} className="w-full p-3 bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-gray-600 rounded-lg dark:text-white focus:ring-2 focus:ring-primary outline-none" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Last Name</label>
              <input type="text" name="lastName" required value={formData.lastName} onChange={handleChange} className="w-full p-3 bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-gray-600 rounded-lg dark:text-white focus:ring-2 focus:ring-primary outline-none" />
            </div>
          </div>
        </div>

        {/* SECTION 2: PARENT & CONTACT */}
        <div className="p-6 md:p-8 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-slate-900/50">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
            <Phone className="text-primary" /> 2. Contact Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Parent Phone (Required)</label>
              <input type="text" name="parentPhone" required placeholder="+2519..." value={formData.parentPhone} onChange={handleChange} className="w-full p-3 bg-white dark:bg-slate-800 border border-gray-300 dark:border-gray-600 rounded-lg dark:text-white focus:ring-2 focus:ring-primary outline-none" />
              <p className="text-xs text-gray-500 mt-1">This will automatically create the Parent's account and link Telegram alerts.</p>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Student Phone (Optional)</label>
              <input type="text" name="studentPhone" placeholder="+2519..." value={formData.studentPhone} onChange={handleChange} className="w-full p-3 bg-white dark:bg-slate-800 border border-gray-300 dark:border-gray-600 rounded-lg dark:text-white focus:ring-2 focus:ring-primary outline-none" />
              <p className="text-xs text-gray-500 mt-1">For High Schoolers. This creates a separate student login.</p>
            </div>
          </div>
        </div>

        {/* SECTION 3: ACADEMIC PLACEMENT */}
        <div className="p-6 md:p-8">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
            <GraduationCap className="text-secondary" /> 3. Official Enrollment
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Grade Level</label>
              <select name="gradeLevelId" required value={formData.gradeLevelId} onChange={handleChange} className="w-full p-3 bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-gray-600 rounded-lg dark:text-white focus:ring-2 focus:ring-primary outline-none">
                <option value="" disabled>Select a Grade...</option>
                {setupData.gradeLevels.map(g => (
                  <option key={g.id} value={g.id}>{g.name} ({g.cycle})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Section / Classroom</label>
              <select name="sectionId" required value={formData.sectionId} onChange={handleChange} disabled={!formData.gradeLevelId} className="w-full p-3 bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-gray-600 rounded-lg dark:text-white focus:ring-2 focus:ring-primary outline-none disabled:opacity-50">
                <option value="" disabled>Select a Section...</option>
                {sections.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* SUBMIT */}
        <div className="p-6 md:p-8 bg-gray-50 dark:bg-slate-900 border-t border-gray-200 dark:border-gray-700 flex justify-end">
          <button type="submit" disabled={isLoading} className={`px-8 py-3 rounded-xl font-bold text-lg text-white shadow-xl transition-all ${isLoading ? 'bg-gray-400' : 'bg-primary hover:bg-blue-900 hover:-translate-y-1'}`}>
            {isLoading ? 'Processing...' : 'Complete Registration'}
          </button>
        </div>

      </form>
    </div>
  );
};

export default StudentRegistration;