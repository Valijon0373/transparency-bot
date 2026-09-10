import React from 'react';
import { 
  HiOutlineEye, 
  HiOutlinePhone, 
  HiOutlineUser, 
  HiOutlineCalendarDays, 
  HiOutlinePhoto, 
  HiOutlineCpuChip, 
  HiOutlineSparkles,
  HiOutlineArrowPath,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineFunnel,
  HiOutlineUserMinus
} from 'react-icons/hi2';
import { RiShieldFlashLine } from 'react-icons/ri';
import { PiBellRingingLight } from 'react-icons/pi';

export default function AppealTable({ 
  appeals, 
  loading, 
  onSelectAppeal, 
  categoryFilter, 
  setCategoryFilter,
  statusFilter,
  setStatusFilter,
  langFilter,
  setLangFilter
}) {
  
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Yangi':
        return (
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 shadow-sm">
            <PiBellRingingLight className="w-5 h-5 animate-pulse text-blue-500 shrink-0" />
            Yangi
          </span>
        );
      case 'Jarayonda':
        return (
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800 shadow-sm">
            <HiOutlineArrowPath className="w-5 h-5 animate-spin text-amber-500 shrink-0" />
            Jarayonda
          </span>
        );
      case 'Bajarildi':
        return (
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 shadow-sm">
            <HiOutlineCheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
            Bajarildi
          </span>
        );
      case 'Rad etildi':
        return (
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 shadow-sm">
            <HiOutlineXCircle className="w-5 h-5 text-rose-500 shrink-0" />
            Rad etildi
          </span>
        );
      default:
        return <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">{status}</span>;
    }
  };

  const getLangBadge = (lang) => {
    switch (lang) {
      case 'uz': return <span title="O'zbekcha" className="px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs font-bold border border-blue-200 dark:border-blue-800">🇺🇿 UZ</span>;
      case 'ru': return <span title="Русский" className="px-2 py-0.5 rounded bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 text-xs font-bold border border-red-200 dark:border-red-800">🇷🇺 RU</span>;
      case 'en': return <span title="English" className="px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 text-xs font-bold border border-indigo-200 dark:border-indigo-800">🇬🇧 EN</span>;
      default: return <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold">{lang?.toUpperCase()}</span>;
    }
  };

  const getCategoryBadge = (catKey, catName) => {
    if (catKey === 'corruption' || catName?.includes('Korrupsion') || catName?.includes('Коррупция')) {
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 px-2.5 py-1 rounded-lg">
          <RiShieldFlashLine className="w-3.5 h-3.5 text-amber-500" />
          Korrupsion Holat
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-700 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/60 border border-cyan-200 dark:border-cyan-800 px-2.5 py-1 rounded-lg">
        <HiOutlineCpuChip className="w-3.5 h-3.5 text-cyan-500" />
        Tizim Muammosi
      </span>
    );
  };

  const formatDate = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return isoString;

    const months = [
      'Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun',
      'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr'
    ];

    const day = date.getDate().toString().padStart(2, '0');
    const monthName = months[date.getMonth()];
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `${day}-${monthName} ${year}, ${hours}:${minutes}`;
  };

  return (
    <div className="urspi-card rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-sm">
      
      {/* Filters Bar */}
      <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4 bg-slate-50/50 dark:bg-slate-900/40">
        <div className="flex items-center gap-2">
          <HiOutlineFunnel className="w-5 h-5 text-teal-600 dark:text-teal-400" />
          <h2 className="font-extrabold text-slate-800 dark:text-white text-base">Arizalar Ro'yxati (Jadval)</h2>
          <span className="bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-400 text-xs px-2.5 py-0.5 rounded-full font-bold border border-teal-200 dark:border-teal-800">
            {appeals.length} ta
          </span>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-xl px-3 py-1.5 focus:outline-none focus:border-teal-500 shadow-sm"
          >
            <option value="ALL">Barcha Kategoriyalar</option>
            <option value="corruption">🚨 Korrupsion Holat</option>
            <option value="system">⚙️ Tizim Muammosi</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-xl px-3 py-1.5 focus:outline-none focus:border-teal-500 shadow-sm"
          >
            <option value="ALL">Barcha Holatlar</option>
            <option value="Yangi">🔵 Yangi</option>
            <option value="Jarayonda">🟡 Jarayonda</option>
            <option value="Bajarildi">🟢 Bajarildi</option>
            <option value="Rad etildi">🔴 Rad etildi</option>
          </select>

          {/* Language Filter */}
          <select
            value={langFilter}
            onChange={(e) => setLangFilter(e.target.value)}
            className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-xl px-3 py-1.5 focus:outline-none focus:border-teal-500 shadow-sm"
          >
            <option value="ALL">Barcha Tillar</option>
            <option value="uz">🇺🇿 O'zbekcha</option>
            <option value="ru">🇷🇺 Русский</option>
            <option value="en">🇬🇧 English</option>
          </select>
        </div>
      </div>

      {/* Interactive Data Table View */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-700 dark:text-slate-300 border-collapse">
          <thead className="bg-slate-100/90 dark:bg-slate-950 text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
            <tr>
              <th className="px-5 py-3.5 border-r border-slate-200 dark:border-slate-800">ID & Raqam</th>
              <th className="px-5 py-3.5 border-r border-slate-200 dark:border-slate-800">Murojaatchi (Telefon)</th>
              <th className="px-5 py-3.5 border-r border-slate-200 dark:border-slate-800">Kategoriya</th>
              <th className="px-5 py-3.5 border-r border-slate-200 dark:border-slate-800">Til</th>
              <th className="px-5 py-3.5 border-r border-slate-200 dark:border-slate-800">Murojaat Matni</th>
              <th className="px-5 py-3.5 border-r border-slate-200 dark:border-slate-800">Rasm</th>
              <th className="px-5 py-3.5 border-r border-slate-200 dark:border-slate-800">Holati</th>
              <th className="px-5 py-3.5 text-right">Amal</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {loading ? (
              <tr>
                <td colSpan="8" className="px-5 py-12 text-center text-slate-400">
                  <div className="inline-block w-6 h-6 border-2 border-teal-500 border-t-transparent rounded-full animate-spin mb-2"></div>
                  <p className="text-xs font-semibold">Arizalar yuklanmoqda...</p>
                </td>
              </tr>
            ) : appeals.length === 0 ? (
              <tr>
                <td colSpan="8" className="px-5 py-12 text-center text-slate-400">
                  <p className="text-sm font-semibold text-slate-600 dark:text-slate-300 mb-1">Arizalar topilmadi</p>
                  <p className="text-xs text-slate-400">Filtrlarni o'zgartirib ko'ring yoki bot orqali ariza yuboring.</p>
                </td>
              </tr>
            ) : (
              appeals.map((appeal) => (
                <tr 
                  key={appeal.id}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group border-b border-slate-200 dark:border-slate-800"
                  onClick={() => onSelectAppeal(appeal)}
                >
                  {/* Tracking ID */}
                  <td className="px-5 py-4 whitespace-nowrap border-r border-slate-200 dark:border-slate-800">
                    <div className="font-mono text-teal-700 dark:text-teal-400 font-extrabold text-xs bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800 px-2.5 py-1 rounded-md inline-block shadow-sm">
                      {appeal.tracking_id}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                      <HiOutlineCalendarDays className="w-3.5 h-3.5 text-slate-400" />
                      {formatDate(appeal.created_at)}
                    </div>
                  </td>

                  {/* Phone & User */}
                  <td className="px-5 py-4 whitespace-nowrap border-r border-slate-200 dark:border-slate-800">
                    <div className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                      <HiOutlinePhone className="w-3.5 h-3.5 text-teal-500" />
                      {appeal.phone_number || 'Anonim'}
                    </div>
                    <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                      {appeal.is_anonymous ? (
                        <>
                          <HiOutlineUserMinus className="w-3.5 h-3.5 text-slate-400" />
                          <span className="text-slate-400 italic">Anonim</span>
                        </>
                      ) : (
                        <>
                          <HiOutlineUser className="w-3.5 h-3.5 text-slate-400" />
                          <span>{appeal.first_name || 'Foydalanuvchi'} {appeal.username ? `@${appeal.username}` : ''}</span>
                        </>
                      )}
                    </div>
                  </td>

                  {/* Category */}
                  <td className="px-5 py-4 whitespace-nowrap border-r border-slate-200 dark:border-slate-800">
                    {getCategoryBadge(appeal.category_key, appeal.category)}
                  </td>

                  {/* Language */}
                  <td className="px-5 py-4 whitespace-nowrap border-r border-slate-200 dark:border-slate-800">
                    {getLangBadge(appeal.language)}
                  </td>

                  {/* Text snippet */}
                  <td className="px-5 py-4 max-w-md border-r border-slate-200 dark:border-slate-800">
                    <p className="line-clamp-2 text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                      {appeal.text}
                    </p>
                  </td>

                  {/* Media Attached */}
                  <td className="px-5 py-4 whitespace-nowrap border-r border-slate-200 dark:border-slate-800">
                    {appeal.photo_path ? (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded">
                        <HiOutlinePhoto className="w-3.5 h-3.5" /> Rasm
                      </span>
                    ) : (
                      <span className="text-xs text-slate-300 dark:text-slate-600">-</span>
                    )}
                  </td>

                  {/* Status */}
                  <td className="px-5 py-4 whitespace-nowrap border-r border-slate-200 dark:border-slate-800">
                    {getStatusBadge(appeal.status)}
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-4 whitespace-nowrap text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectAppeal(appeal);
                      }}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-teal-700 dark:text-teal-400 hover:text-white bg-teal-50 dark:bg-teal-950/60 hover:bg-teal-600 border border-teal-200 dark:border-teal-800 rounded-xl transition-all shadow-sm active:scale-95"
                    >
                      <HiOutlineEye className="w-4 h-4" />
                      <span>Batafsil</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}
