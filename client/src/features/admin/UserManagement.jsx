import { useState } from 'react';
import { UserPlus, Users, Briefcase, GraduationCap } from 'lucide-react';
import apiClient from '../../utils/apiClient';

const UserManagement = () => {
  const [formData, setFormData] = useState({
    phone: '',
    password: '',
    role: 'TEACHER'
  });
  const [isLoading, setIsLoading] = useState(false);
  const[message, setMessage] = useState('');

  const handleInputChange = (e) => {
    setFormData({ ...formData,[e.target.name]: e.target.value });
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const response = await apiClient.post('/users', formData);
      setMessage(`✅ ${response.data.message}`);
      setFormData({ phone: '', password: '', role: 'TEACHER' }); // clear form
    } catch (error) {
      setMessage(`❌ ${error.response?.data?.message || 'Failed to create user.'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white flex items-center gap-3">
          <Users className="text-primary" size={36} />
          User Management Console
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Add new Teachers, Parents, and Staff to your school system.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: THE FORM */}
        <div className="lg:col-span-1 bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center space-x-2 mb-6 border-b border-gray-100 dark:border-gray-700 pb-3">
            <UserPlus className="text-secondary" size={24} />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Register New User</h2>
          </div>

          {message && (
            <div className={`p-3 mb-4 rounded-lg text-sm font-bold ${message.startsWith('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {message}
            </div>
          )}

          <form onSubmit={handleCreateUser} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Role</label>
              <select 
                name="role" 
                value={formData.role} 
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none"
              >
                <option value="TEACHER">Teacher</option>
                <option value="PARENT">Parent</option>
                <option value="FINANCE">Finance / Cashier</option>
                <option value="REGISTRAR">Registrar</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Phone Number</label>
              <input 
                type="text" 
                name="phone" 
                placeholder="+2519..." 
                value={formData.phone} 
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Temporary Password</label>
              <input 
                type="text" 
                name="password" 
                placeholder="secret123" 
                value={formData.password} 
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none"
              />
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className={`w-full py-3 rounded-lg font-bold text-white transition shadow-md ${isLoading ? 'bg-gray-400' : 'bg-primary hover:bg-blue-900'}`}
            >
              {isLoading ? 'Creating...' : 'Create Account'}
            </button>
          </form>
        </div>

        {/* RIGHT COLUMN: INFO CARDS */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl p-6 text-white shadow-lg flex flex-col justify-center">
            <Briefcase size={40} className="mb-4 opacity-80" />
            <h3 className="text-2xl font-extrabold">Staff Management</h3>
            <p className="mt-2 text-blue-100 text-sm">Create accounts for teachers so they can access their gradebooks and roll calls securely.</p>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-green-700 rounded-2xl p-6 text-white shadow-lg flex flex-col justify-center">
            <GraduationCap size={40} className="mb-4 opacity-80" />
            <h3 className="text-2xl font-extrabold">Parent Portals</h3>
            <p className="mt-2 text-green-100 text-sm">Register parents so they can receive instant Telegram alerts and pay school fees digitally.</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default UserManagement;