import React from 'react';
import { 
  HiOutlineSquares2X2, 
  HiOutlineDocumentText, 
  HiOutlineCpuChip, 
  HiOutlineChartBar, 
  HiOutlineCog6Tooth, 
  HiOutlineShieldCheck,
  HiOutlineXMark,
  HiOutlineArrowTopRightOnSquare
} from 'react-icons/hi2';
import { RiShieldFlashLine } from 'react-icons/ri';

export default function Sidebar({ 
  activeTab, 
  setActiveTab, 
  counts, 
  isOpen, 
  onClose 
}) {
  const navItems = [
    { 
      id: 'overview', 
      label: 'Dashboard', 
      icon: HiOutlineSquares2X2, 
      badge: null 
    },
    { 
      id: 'appeals', 
      label: 'Arizalar (Jadval)', 
      icon: HiOutlineDocumentText, 
      badge: counts?.total || 0 
    },
    { 
      id: 'corruption', 
      label: 'Korrupsiya Arizalari', 
      icon: RiShieldFlashLine, 
      badge: counts?.corruption || 0,
      badgeColor: 'bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-800'
    },
    { 
      id: 'system', 
      label: 'Tizim Muammolari', 
      icon: HiOutlineCpuChip, 
      badge: counts?.system || 0,
      badgeColor: 'bg-cyan-100 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-400 border border-cyan-300 dark:border-cyan-800'
    },
    { 
      id: 'settings', 
      label: 'Sozlamalar', 
      icon: HiOutlineCog6Tooth, 
      badge: null 
    }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40 lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Drawer */}
      <aside className={`
        fixed top-0 left-0 bottom-0 z-50 w-72 bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800/80
        flex flex-col transition-transform duration-300 ease-in-out shadow-xl lg:shadow-none
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        
        {/* Brand Header */}
        <div className="p-5 flex items-center justify-between border-b border-slate-100 dark:border-slate-800/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-600 via-teal-500 to-emerald-400 text-white flex items-center justify-center font-bold text-base shadow-md shadow-teal-500/20 ring-2 ring-teal-500/20">
              <HiOutlineShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-extrabold text-sm text-slate-800 dark:text-white tracking-tight leading-tight">
                UrSPI Admin
              </h1>
              <p className="text-[11px] text-teal-600 dark:text-teal-400 font-semibold flex items-center gap-1">
                <span>Shaffoflik Portali</span>
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <HiOutlineXMark className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Navigation Menu */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  if (window.innerWidth < 1024) onClose();
                }}
                className={`
                  w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 group
                  ${isActive 
                    ? 'urspi-active-pill shadow-md font-bold' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100'
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 transition-all duration-200 group-hover:scale-110 ${isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400 group-hover:text-teal-500'}`} />
                  <span>{item.label}</span>
                </div>

                {item.badge !== null && item.badge !== undefined && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                    isActive 
                      ? 'bg-white/20 text-white' 
                      : (item.badgeColor || 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700')
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Footer: "Platformaga qaytish" */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800/60">
          <button
            onClick={() => window.open('https://urspi.uz', '_blank')}
            className="w-full py-2.5 px-4 rounded-xl border border-rose-400/50 text-rose-500 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 font-semibold text-xs transition-all flex items-center justify-center gap-2 active:scale-95 group shadow-sm"
          >
            <span>Platformaga qaytish</span>
            <HiOutlineArrowTopRightOnSquare className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>
        </div>

      </aside>
    </>
  );
}
