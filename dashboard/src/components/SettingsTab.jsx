import React, { useState } from 'react';
import { 
  HiOutlineCog6Tooth, 
  HiOutlineCircleStack, 
  HiOutlineKey, 
  HiOutlineCheckCircle, 
  HiOutlineCheck
} from 'react-icons/hi2';
import { TbBrandTelegram } from 'react-icons/tb';

export default function SettingsTab({ admin }) {
  const [passForm, setPassForm] = useState({ oldPass: '', newPass: '', confirmPass: '' });
  const [msg, setMsg] = useState(null);

  const handlePassChange = (e) => {
    e.preventDefault();
    if (passForm.newPass !== passForm.confirmPass) {
      setMsg({ type: 'error', text: 'Yangi parollar mos kelmadi' });
      return;
    }
    setMsg({ type: 'success', text: 'Parol muvaffaqiyatli o\'zgartirildi' });
    setPassForm({ oldPass: '', newPass: '', confirmPass: '' });
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fadeIn">
      
      {/* Header Banner */}
      <div className="urspi-card p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 flex items-center justify-between shadow-sm">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-400 text-xs font-bold mb-2">
            <HiOutlineCog6Tooth className="w-4 h-4" /> Tizim Sozlamalari
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Tizim va Xavfsizlik Sozlamalari
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Admin parolini o'zgartirish, Telegram bot va DB server holati
          </p>
        </div>
      </div>

      {msg && (
        <div className={`p-4 rounded-xl text-xs font-bold flex items-center gap-2 ${
          msg.type === 'success' 
            ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800' 
            : 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800'
        }`}>
          <HiOutlineCheckCircle className="w-4 h-4" />
          <span>{msg.text}</span>
        </div>
      )}

      {/* Grid: Bot Status & Admin Password */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Telegram Bot Info */}
        <div className="urspi-card p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-4 shadow-sm">
          <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
            <TbBrandTelegram className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            Telegram Bot va Server Holati
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500 dark:text-slate-400">Bot Integratsiyasi:</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span> Faol
              </span>
            </div>

            <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500 dark:text-slate-400">Qo'llab-quvvatlanadigan Tillar:</span>
              <span className="text-slate-800 dark:text-slate-200 font-bold">UZ, RU, EN (3 ta)</span>
            </div>

            <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500 dark:text-slate-400">Media Yuklash:</span>
              <span className="text-slate-800 dark:text-slate-200 font-bold">Avtomatik (/uploads)</span>
            </div>

            <div className="flex justify-between py-2">
              <span className="text-slate-500 dark:text-slate-400">Baza Turi:</span>
              <span className="text-slate-800 dark:text-slate-200 font-bold flex items-center gap-1.5">
                <HiOutlineCircleStack className="w-4 h-4 text-teal-500" /> SQLite (Local File)
              </span>
            </div>
          </div>
        </div>

        {/* Change Admin Password */}
        <form onSubmit={handlePassChange} className="urspi-card p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-4 shadow-sm">
          <h3 className="font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
            <HiOutlineKey className="w-5 h-5 text-amber-500" />
            Admin Parolini O'zgartirish
          </h3>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Eski Parol</label>
            <input
              type="password"
              required
              value={passForm.oldPass}
              onChange={(e) => setPassForm({ ...passForm, oldPass: e.target.value })}
              className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 text-xs rounded-xl p-2.5 focus:outline-none focus:border-teal-500 shadow-inner"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Yangi Parol</label>
            <input
              type="password"
              required
              value={passForm.newPass}
              onChange={(e) => setPassForm({ ...passForm, newPass: e.target.value })}
              className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 text-xs rounded-xl p-2.5 focus:outline-none focus:border-teal-500 shadow-inner"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Yangi Parolni Tasdiqlang</label>
            <input
              type="password"
              required
              value={passForm.confirmPass}
              onChange={(e) => setPassForm({ ...passForm, confirmPass: e.target.value })}
              className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 text-xs rounded-xl p-2.5 focus:outline-none focus:border-teal-500 shadow-inner"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl urspi-active-pill font-bold text-xs transition-all flex items-center justify-center gap-2 active:scale-95 shadow-md"
          >
            <HiOutlineCheck className="w-4 h-4" />
            <span>Parolni Saqlash</span>
          </button>
        </form>

      </div>

    </div>
  );
}
