import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../hooks/ThemeContext';
import { Sun, Moon, Monitor, Globe, ChevronDown } from 'lucide-react';

function Login() {
  const { t, i18n } = useTranslation();
  const { theme, setTheme } = useTheme();

  // State to manage which dropdown is open
  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);

  // Helper to change theme and close dropdown
  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    setIsThemeOpen(false);
  };

  // Helper to change language and close dropdown
  const handleLangChange = (lng) => {
    i18n.changeLanguage(lng);
    setIsLangOpen(false);
  };

  return (
    // The main wrapper strictly uses Tailwind classes for background colors now
    <div className="min-h-screen bg-gray-100 dark:bg-slate-900 text-gray-900 dark:text-gray-100 flex flex-col items-center justify-center p-4 transition-colors duration-300">
      
      {/* TOP RIGHT CONTROLS */}
      <div className="absolute top-6 right-6 flex items-center space-x-4">
        
        {/* THEME DROPDOWN */}
        <div className="relative">
          <button 
            onClick={() => { setIsThemeOpen(!isThemeOpen); setIsLangOpen(false); }}
            className="flex items-center space-x-2 bg-white dark:bg-slate-800 px-3 py-2 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-slate-700 transition"
          >
            {theme === 'light' ? <Sun size={18} className="text-yellow-500" /> : 
             theme === 'dark' ? <Moon size={18} className="text-blue-400" /> : 
             <Monitor size={18} className="text-gray-500 dark:text-gray-300" />}
            <span className="text-sm font-medium capitalize hidden sm:block">{theme}</span>
            <ChevronDown size={16} className="text-gray-500" />
          </button>

          {isThemeOpen && (
            <div className="absolute right-0 mt-2 w-36 bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-10 overflow-hidden">
              <button onClick={() => handleThemeChange('light')} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-slate-700 flex items-center space-x-2">
                <Sun size={16} className="text-yellow-500" /> <span>Light</span>
              </button>
              <button onClick={() => handleThemeChange('dark')} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-slate-700 flex items-center space-x-2">
                <Moon size={16} className="text-blue-400" /> <span>Dark</span>
              </button>
              <button onClick={() => handleThemeChange('system')} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-slate-700 flex items-center space-x-2">
                <Monitor size={16} className="text-gray-500 dark:text-gray-300" /> <span>System</span>
              </button>
            </div>
          )}
        </div>

        {/* LANGUAGE DROPDOWN */}
        <div className="relative">
          <button 
            onClick={() => { setIsLangOpen(!isLangOpen); setIsThemeOpen(false); }}
            className="flex items-center space-x-2 bg-white dark:bg-slate-800 px-3 py-2 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-slate-700 transition"
          >
            <Globe size={18} className="text-primary dark:text-blue-400" />
            <span className="text-sm font-bold uppercase">{i18n.language}</span>
            <ChevronDown size={16} className="text-gray-500" />
          </button>

          {isLangOpen && (
            <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-10 overflow-hidden">
              <button 
                onClick={() => handleLangChange('en')} 
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-slate-700 ${i18n.language === 'en' ? 'font-bold text-primary dark:text-blue-400' : ''}`}
              >
                English
              </button>
              <button 
                onClick={() => handleLangChange('am')} 
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-slate-700 ${i18n.language === 'am' ? 'font-bold text-primary dark:text-blue-400' : ''}`}
              >
                አማርኛ
              </button>
            </div>
          )}
        </div>

      </div>

      {/* INVISIBLE OVERLAY TO CLOSE DROPDOWNS WHEN CLICKING OUTSIDE */}
      {(isThemeOpen || isLangOpen) && (
        <div 
          className="fixed inset-0 z-0" 
          onClick={() => { setIsThemeOpen(false); setIsLangOpen(false); }}
        ></div>
      )}

      {/* LOGIN CARD */}
      <div className="relative z-10 max-w-md w-full bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8 space-y-6 border-t-4 border-primary transition-colors duration-300">
         
         <div className="text-center">
            <h1 className="text-2xl font-extrabold text-primary dark:text-blue-400">{t('welcome')}</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">{t('login')}</p>
         </div>

         <form className="space-y-5">
            <div>
               <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                 {t('phone')}
               </label>
               <input 
                 type="text" 
                 placeholder="+251 911 234 567"
                 className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition" 
               />
            </div>
            
            <div>
               <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                 {t('password')}
               </label>
               <input 
                 type="password" 
                 placeholder="••••••••"
                 className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition" 
               />
            </div>

            <button 
              type="button" 
              className="w-full bg-primary text-white py-3 rounded-lg font-bold text-lg hover:bg-blue-900 dark:hover:bg-blue-700 shadow-lg hover:shadow-xl transition duration-200"
            >
               {t('btn_login')}
            </button>
         </form>

      </div>
    </div>
  );
}

export default Login;