import React, { useState } from 'react';
import { 
  HiOutlineUser, 
  HiOutlineKey, 
  HiOutlineExclamationCircle,
  HiOutlineEye,
  HiOutlineEyeSlash,
  HiSparkles,
  HiArrowRight,
  HiOutlineSun,
  HiOutlineMoon
} from 'react-icons/hi2';
import { RiShieldKeyholeLine } from 'react-icons/ri';

export default function LoginModal({ onLogin, isDarkMode, toggleDarkMode }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await onLogin(username, password);
    } catch (err) {
      setError(err.message || 'Login yoki parol xato kiritildi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-colors duration-300 overflow-hidden font-['Plus_Jakarta_Sans',sans-serif] ${
      isDarkMode 
        ? 'bg-slate-950/95 backdrop-blur-2xl' 
        : 'bg-slate-100/95 backdrop-blur-2xl'
    }`}>
      
      {/* Background Ambient Glows */}
      <div className={`absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[140px] pointer-events-none transition-opacity duration-300 ${
        isDarkMode 
          ? 'bg-gradient-to-tr from-teal-500/20 via-cyan-500/20 to-indigo-600/20 opacity-100' 
          : 'bg-gradient-to-tr from-teal-400/30 via-sky-300/30 to-blue-400/20 opacity-70'
      }`}></div>

      {/* Decorative Grid Pattern */}
      <div className={`absolute inset-0 [background-size:24px_24px] pointer-events-none ${
        isDarkMode 
          ? 'bg-[radial-gradient(#334155_1px,transparent_1px)] opacity-25' 
          : 'bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] opacity-60'
      }`}></div>

      {/* Main Glassmorphism Card (Turns White in Light mode, Dark in Dark mode) */}
      <div className={`w-full max-w-md p-8 sm:p-10 rounded-3xl relative z-10 overflow-hidden transition-all duration-300 border ${
        isDarkMode 
          ? 'bg-slate-900/90 text-white border-slate-800/90 shadow-[0_20px_70px_rgba(0,0,0,0.8)] ring-1 ring-white/10' 
          : 'bg-white/95 text-slate-900 border-slate-200/90 shadow-2xl ring-1 ring-slate-950/5'
      }`}>
        
        {/* Top Accent Line */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-teal-400 via-cyan-500 to-blue-600"></div>

        {/* Header */}
        <div className="text-center mb-8 relative">
          <div className="relative inline-block mb-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-teal-500 via-cyan-500 to-blue-600 p-0.5 shadow-xl shadow-teal-500/20">
              <div className={`w-full h-full rounded-[14px] flex items-center justify-center transition-colors ${
                isDarkMode ? 'bg-slate-950 text-teal-400' : 'bg-teal-50 text-teal-600'
              }`}>
                <RiShieldKeyholeLine className="w-8 h-8" />
              </div>
            </div>
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-teal-400 rounded-full flex items-center justify-center text-slate-950 shadow-md">
              <HiSparkles className="w-3.5 h-3.5" />
            </div>
          </div>

          <h2 className={`text-2xl font-black tracking-tight flex items-center justify-center gap-1.5 ${
            isDarkMode ? 'text-white' : 'text-slate-900'
          }`}>
            Admin Tizimiga Kirish
          </h2>
          <p className={`text-xs font-semibold mt-1.5 ${
            isDarkMode ? 'text-slate-400' : 'text-slate-500'
          }`}>
            UrSPI Shaffoflik va Murojaatlar Boshqaruv Paneli
          </p>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="mb-6 p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-300 text-xs font-bold flex items-center gap-2.5 shadow-sm">
            <HiOutlineExclamationCircle className="w-5 h-5 text-rose-500 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Username Field */}
          <div>
            <label className={`block text-[11px] font-extrabold uppercase tracking-wider mb-2 ${
              isDarkMode ? 'text-slate-300' : 'text-slate-700'
            }`}>
              Foydalanuvchi Nomi
            </label>
            <div className="relative group">
              <HiOutlineUser className={`w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors ${
                isDarkMode ? 'text-slate-500 group-focus-within:text-teal-400' : 'text-slate-400 group-focus-within:text-teal-600'
              }`} />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className={`w-full text-sm font-semibold rounded-2xl pl-11 pr-4 py-3.5 focus:outline-none focus:ring-2 transition-all shadow-inner border ${
                  isDarkMode 
                    ? 'bg-slate-950/90 border-slate-800 text-white placeholder:text-slate-600 focus:border-teal-500 focus:ring-teal-500/30' 
                    : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-teal-500 focus:ring-teal-500/20'
                }`}
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className={`block text-[11px] font-extrabold uppercase tracking-wider mb-2 ${
              isDarkMode ? 'text-slate-300' : 'text-slate-700'
            }`}>
              Maxfiy Parol
            </label>
            <div className="relative group">
              <HiOutlineKey className={`w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors ${
                isDarkMode ? 'text-slate-500 group-focus-within:text-teal-400' : 'text-slate-400 group-focus-within:text-teal-600'
              }`} />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={`w-full text-sm font-semibold rounded-2xl pl-11 pr-11 py-3.5 focus:outline-none focus:ring-2 transition-all shadow-inner border ${
                  isDarkMode 
                    ? 'bg-slate-950/90 border-slate-800 text-white placeholder:text-slate-600 focus:border-teal-500 focus:ring-teal-500/30' 
                    : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-teal-500 focus:ring-teal-500/20'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors ${
                  isDarkMode ? 'text-slate-500 hover:text-white' : 'text-slate-400 hover:text-slate-800'
                }`}
                title={showPassword ? "Parolni berkitish" : "Parolni ko'rsatish"}
              >
                {showPassword ? (
                  <HiOutlineEyeSlash className="w-5 h-5" />
                ) : (
                  <HiOutlineEye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-600 hover:from-teal-400 hover:via-cyan-400 hover:to-blue-500 text-white font-black text-sm uppercase tracking-wider shadow-lg shadow-cyan-500/25 transition-all duration-200 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>TIZIMGA KIRILMOQDA...</span>
              </>
            ) : (
              <>
                <span>TIZIMGA KIRISH</span>
                <HiArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Clean Pill Toggle Switch (Kulichater with Sun ☀️ and Moon 🌙 icons) */}
        {toggleDarkMode && (
          <div className={`mt-8 flex items-center justify-between px-2 pt-4 border-t transition-colors ${
            isDarkMode ? 'border-slate-800/80' : 'border-slate-200/80'
          }`}>
            <span className={`text-xs font-bold flex items-center gap-2 ${
              isDarkMode ? 'text-slate-400' : 'text-slate-600'
            }`}>
              {isDarkMode ? (
                <>
                  <HiOutlineMoon className="w-4 h-4 text-indigo-400" />
                  <span>Tungi rejim</span>
                </>
              ) : (
                <>
                  <HiOutlineSun className="w-4 h-4 text-amber-500" />
                  <span>Yorug' rejim</span>
                </>
              )}
            </span>

            {/* Sliding Toggle Pill Switcher */}
            <button
              type="button"
              onClick={toggleDarkMode}
              className={`relative w-14 h-8 rounded-full p-1 transition-colors duration-300 focus:outline-none shadow-inner border ${
                isDarkMode 
                  ? 'bg-slate-800 border-slate-700' 
                  : 'bg-amber-100 border-amber-300'
              }`}
              title="Mavzuni (Oq / Qora) o'zgartirish"
            >
              {/* Sliding Knob with Icon */}
              <div className={`w-6 h-6 rounded-full shadow-md flex items-center justify-center transition-transform duration-300 ${
                isDarkMode 
                  ? 'translate-x-6 bg-slate-900 text-indigo-400 border border-slate-700' 
                  : 'translate-x-0 bg-white text-amber-500 border border-amber-200'
              }`}>
                {isDarkMode ? (
                  <HiOutlineMoon className="w-3.5 h-3.5" />
                ) : (
                  <HiOutlineSun className="w-3.5 h-3.5" />
                )}
              </div>
            </button>
          </div>
        )}

        {/* Card Footer */}
        <div className="mt-4 text-center">
          <p className={`text-[11px] font-semibold ${
            isDarkMode ? 'text-slate-500' : 'text-slate-400'
          }`}>
            UrSPI Maxfiylik & Xavfsizlik Tizimi © 2026
          </p>
        </div>

      </div>

    </div>
  );
}
