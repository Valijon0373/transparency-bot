import React, { useState } from 'react';
import { 
  HiBars3, 
  HiOutlineSun, 
  HiOutlineMoon, 
  HiOutlineArrowPath, 
  HiOutlineMagnifyingGlass, 
  HiOutlineArrowRightOnRectangle, 
  HiChevronDown,
  HiOutlineUserCircle
} from 'react-icons/hi2';

export default function Navbar({ 
  admin, 
  activeTab, 
  onToggleSidebar, 
  onLogout, 
  onRefresh, 
  searchTerm, 
  setSearchTerm,
  isDarkMode,
  toggleDarkMode
}) {
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);

  const getTitle = () => {
    switch (activeTab) {
      case 'overview': return 'Dashboard';
      case 'appeals': return 'Arizalar (Jadval ko\'rinishida)';
      case 'corruption': return 'Korrupsiya Arizalari';
      case 'system': return 'Tizim Muammolari';
      case 'settings': return 'Sozlamalar';
      default: return 'Dashboard';
    }
  };

  const handleRefreshClick = () => {
    setIsSpinning(true);
    if (onRefresh) onRefresh();
    setTimeout(() => setIsSpinning(false), 700);
  };

  return (
    <header className="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 px-4 lg:px-8 py-3.5 flex items-center justify-between transition-colors shadow-sm">
      
      {/* Left: Sidebar Toggle & Page Title */}
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Menuni yopish / ochish"
        >
          <HiBars3 className="w-5 h-5" />
        </button>

        <h1 className="text-lg font-bold text-slate-800 dark:text-white tracking-tight flex items-center gap-2">
          <span>{getTitle()}</span>
        </h1>
      </div>

      {/* Right: Actions (Search, Refresh, Dark Mode, Profile) */}
      <div className="flex items-center gap-3">
        
        {/* Search Bar */}
        <div className="relative hidden md:block w-64">
          <HiOutlineMagnifyingGlass className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Qidiruv (ID, matn, tel)..."
            className="w-full bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 placeholder-slate-400 text-xs rounded-xl pl-9 pr-3 py-2 focus:outline-none focus:border-teal-500 transition-all shadow-inner"
          />
        </div>

        {/* Refresh button */}
        <button
          onClick={handleRefreshClick}
          title="Ma'lumotlarni yangilash"
          className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-all active:scale-95 border border-slate-200/60 dark:border-slate-700/50"
        >
          <HiOutlineArrowPath className={`w-4 h-4 transition-transform duration-700 ${isSpinning ? 'rotate-180 text-teal-500' : ''}`} />
        </button>

        {/* Light / Dark Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          title={isDarkMode ? "Yorug' rejimga o'tish" : "Tungi rejimga o'tish"}
          className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-all active:scale-95 border border-slate-200/60 dark:border-slate-700/50"
        >
          {isDarkMode ? <HiOutlineSun className="w-4 h-4 text-amber-400" /> : <HiOutlineMoon className="w-4 h-4 text-slate-600" />}
        </button>

        {/* User Profile Badge */}
        <div className="relative">
          <button
            onClick={() => setUserDropdownOpen(!userDropdownOpen)}
            className="flex items-center gap-2.5 p-1 pl-2.5 rounded-full border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-all shadow-sm"
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-cyan-600 to-teal-500 text-white font-extrabold text-xs flex items-center justify-center shadow-sm">
              {admin?.username ? admin.username.substring(0, 2).toUpperCase() : 'AD'}
            </div>
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 hidden sm:inline">
              {admin?.username || 'admin'}
            </span>
            <HiChevronDown className="w-3.5 h-3.5 text-slate-400 mr-1" />
          </button>

          {/* User Dropdown */}
          {userDropdownOpen && (
            <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl py-2 z-50 animate-fadeIn">
              <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
                <div className="p-2 rounded-xl bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-400">
                  <HiOutlineUserCircle className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800 dark:text-white">{admin?.name || 'Administrator'}</div>
                  <div className="text-[10px] text-teal-600 dark:text-teal-400 font-mono font-semibold">@{admin?.username || 'admin'}</div>
                </div>
              </div>

              <button
                onClick={() => {
                  setUserDropdownOpen(false);
                  onLogout();
                }}
                className="w-full px-4 py-2.5 text-left text-xs font-semibold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center gap-2 transition-colors"
              >
                <HiOutlineArrowRightOnRectangle className="w-4 h-4" />
                <span>Chiqish</span>
              </button>
            </div>
          )}
        </div>

      </div>

    </header>
  );
}
