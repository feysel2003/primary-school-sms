import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../hooks/ThemeContext';
import { useDispatch } from 'react-redux';
import { setCredentials } from './authSlice';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Sun, Moon, Monitor, Globe, ChevronDown } from 'lucide-react';

function Login() {
  const { t, i18n } = useTranslation();
  const { theme, setTheme } = useTheme();
  
  // React Router & Redux tools
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Dropdown states
  const[isThemeOpen, setIsThemeOpen] = useState(false);
  const[isLangOpen, setIsLangOpen] = useState(false);

  // Form states
  const [phone, setPhone] = useState('+251911234567'); // Default to our test user
  const [password, setPassword] = useState('password123'); // Default to our test password
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Helper to change theme/lang
  const handleThemeChange = (newTheme) => { setTheme(newTheme); setIsThemeOpen(false); };
  const handleLangChange = (lng) => { i18n.changeLanguage(lng); setIsLangOpen(false); };

  // 🚀 THE ACTUAL LOGIN FUNCTION
  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent page refresh
    setError('');
    setIsLoading(true);

    try {
      // Send data to our Express Backend
      const response = await axios.post('http://localhost:5000/api/v1/auth/login', {
        phone,
        password
      });

      // If successful, save token to Redux
      dispatch(setCredentials({
        user: response.data.user,
        token: response.data.token
      }));

      // Redirect based on role
      if (response.data.user.role === 'PARENT') {
        navigate('/parent');
      } else {
        navigate('/admin');
      }

    } catch (err) {
      // Show error message from backend
      setError(err.response?.data?.message || 'Something went wrong. Try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-900 text-gray-900 dark:text-gray-100 flex flex-col items-center justify-center p-4 transition-colors duration-300">
      
      {/* DROPDOWNS (Theme & Lang) */}
      <div className="absolute top-6 right-6 flex items-center space-x-4">
        {/* Theme Dropdown */}
        <div className="relative">
          <button onClick={() => { setIsThemeOpen(!isThemeOpen); setIsLangOpen(false); }} className="flex items-center space-x-2 bg-white dark:bg-slate-800 px-3 py-2 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-slate-700 transition">
            {theme === 'light' ? <Sun size={18} className="text-yellow-500" /> : theme === 'dark' ? <Moon size={18} className="text-blue-400" /> : <Monitor size={18} className="text-gray-500 dark:text-gray-300" />}
            <span className="text-sm font-medium capitalize hidden sm:block">{theme}</span>
            <ChevronDown size={16} className="text-gray-500" />
          </button>
          {isThemeOpen && (
            <div className="absolute right-0 mt-2 w-36 bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-10 overflow-hidden">
              <button onClick={() => handleThemeChange('light')} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-slate-700 flex items-center space-x-2"><Sun size={16} className="text-yellow-500" /> <span>Light</span></button>
              <button onClick={() => handleThemeChange('dark')} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-slate-700 flex items-center space-x-2"><Moon size={16} className="text-blue-400" /> <span>Dark</span></button>
              <button onClick={() => handleThemeChange('system')} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-slate-700 flex items-center space-x-2"><Monitor size={16} className="text-gray-500 dark:text-gray-300" /> <span>System</span></button>
            </div>
          )}
        </div>

        {/* Lang Dropdown */}
        <div className="relative">
          <button onClick={() => { setIsLangOpen(!isLangOpen); setIsThemeOpen(false); }} className="flex items-center space-x-2 bg-white dark:bg-slate-800 px-3 py-2 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-slate-700 transition">
            <Globe size={18} className="text-primary dark:text-blue-400" />
            <span className="text-sm font-bold uppercase">{i18n.language}</span>
            <ChevronDown size={16} className="text-gray-500" />
          </button>
          {isLangOpen && (
            <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-10 overflow-hidden">
              <button onClick={() => handleLangChange('en')} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-slate-700">English</button>
              <button onClick={() => handleLangChange('am')} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-slate-700">አማርኛ</button>
            </div>
          )}
        </div>
      </div>

      {(isThemeOpen || isLangOpen) && <div className="fixed inset-0 z-0" onClick={() => { setIsThemeOpen(false); setIsLangOpen(false); }}></div>}

      {/* LOGIN CARD */}
      <div className="relative z-10 max-w-md w-full bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8 space-y-6 border-t-4 border-primary transition-colors duration-300">
         
         <div className="text-center">
            <h1 className="text-2xl font-extrabold text-primary dark:text-blue-400">{t('welcome')}</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">{t('login')}</p>
         </div>

         {/* SHOW ERROR IF PASSWORD IS WRONG */}
         {error && (
           <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-sm text-center">
             {error}
           </div>
         )}

         {/* FORM INTERCEPTS SUBMIT */}
         <form className="space-y-5" onSubmit={handleLogin}>
            <div>
               <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">{t('phone')}</label>
               <input 
                 type="text" 
                 value={phone}
                 onChange={(e) => setPhone(e.target.value)}
                 className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-secondary transition" 
               />
            </div>
            
            <div>
               <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">{t('password')}</label>
               <input 
                 type="password" 
                 value={password}
                 onChange={(e) => setPassword(e.target.value)}
                 className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-secondary transition" 
               />
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className={`w-full py-3 rounded-lg font-bold text-lg shadow-lg transition duration-200 ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary text-white hover:bg-blue-900 dark:hover:bg-blue-700 hover:shadow-xl'}`}
            >
               {isLoading ? 'Loading...' : t('btn_login')}
            </button>
         </form>
      </div>
    </div>
  );
}

export default Login;