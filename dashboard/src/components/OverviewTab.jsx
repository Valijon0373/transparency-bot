import React from 'react';
import { 
  HiOutlineInboxStack, 
  HiOutlineCpuChip, 
  HiOutlineCheckCircle, 
  HiOutlineClock, 
  HiOutlineChartPie,
  HiOutlineCheckBadge,
  HiOutlineGlobeAlt,
  HiOutlineChartBar
} from 'react-icons/hi2';
import { RiShieldFlashLine } from 'react-icons/ri';
import { PiBellRingingLight } from 'react-icons/pi';

export default function OverviewTab({ stats, appeals, onSelectAppeal, setActiveTab }) {
  const total = stats?.total || 0;
  
  const corruptionCount = stats?.byCategory?.find(c => c.category_key === 'corruption')?.count || 0;
  const systemCount = stats?.byCategory?.find(c => c.category_key === 'system')?.count || 0;
  
  const newCount = stats?.byStatus?.find(s => s.status === 'Yangi')?.count || 0;
  const progressCount = stats?.byStatus?.find(s => s.status === 'Jarayonda')?.count || 0;
  const doneCount = stats?.byStatus?.find(s => s.status === 'Bajarildi')?.count || 0;

  const uzCount = stats?.byLanguage?.find(l => l.language === 'uz')?.count || 0;
  const ruCount = stats?.byLanguage?.find(l => l.language === 'ru')?.count || 0;
  const enCount = stats?.byLanguage?.find(l => l.language === 'en')?.count || 0;

  const statCards = [
    {
      id: 'total',
      title: 'Jami Murojaatlar',
      count: total,
      icon: HiOutlineInboxStack,
      bgColor: 'bg-blue-50 dark:bg-blue-950/40',
      iconColor: 'text-blue-500 dark:text-blue-400',
      borderColor: 'border-blue-100 dark:border-blue-900/40',
      onClick: () => setActiveTab('appeals')
    },
    {
      id: 'yangi',
      title: 'Yangi Arizalar',
      count: newCount,
      icon: PiBellRingingLight,
      bgColor: 'bg-emerald-50 dark:bg-emerald-950/40',
      iconColor: 'text-emerald-500 dark:text-emerald-400',
      borderColor: 'border-emerald-100 dark:border-emerald-900/40',
      onClick: () => setActiveTab('appeals')
    },
    {
      id: 'jarayonda',
      title: "Ko'rib chiqilmoqda",
      count: progressCount,
      icon: HiOutlineClock,
      bgColor: 'bg-purple-50 dark:bg-purple-950/40',
      iconColor: 'text-purple-500 dark:text-purple-400',
      borderColor: 'border-purple-100 dark:border-purple-900/40',
      onClick: () => setActiveTab('appeals')
    },
    {
      id: 'bajarildi',
      title: 'Hal Etilgan (Bajarildi)',
      count: doneCount,
      icon: HiOutlineCheckCircle,
      bgColor: 'bg-teal-50 dark:bg-teal-950/40',
      iconColor: 'text-teal-500 dark:text-teal-400',
      borderColor: 'border-teal-100 dark:border-teal-900/40',
      onClick: () => setActiveTab('appeals')
    },
    {
      id: 'korrupsiya',
      title: 'Korrupsion Holatlar',
      count: corruptionCount,
      icon: RiShieldFlashLine,
      bgColor: 'bg-amber-50 dark:bg-amber-950/40',
      iconColor: 'text-amber-500 dark:text-amber-400',
      borderColor: 'border-amber-100 dark:border-amber-900/40',
      onClick: () => setActiveTab('corruption')
    },
    {
      id: 'tizim',
      title: 'Tizim Muammolari',
      count: systemCount,
      icon: HiOutlineCpuChip,
      bgColor: 'bg-cyan-50 dark:bg-cyan-950/40',
      iconColor: 'text-cyan-500 dark:text-cyan-400',
      borderColor: 'border-cyan-100 dark:border-cyan-900/40',
      onClick: () => setActiveTab('system')
    }
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Heading */}
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Umumiy Statistika & Tahlil
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Telegram bot orqali tushgan barcha arizalarning real-vaqtdagi tahlili va ko'rsatkichlari
        </p>
      </div>

      {/* Grid of Clean Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.id}
              onClick={card.onClick}
              className={`
                urspi-card p-5 rounded-2xl flex items-center gap-5 cursor-pointer
                hover:shadow-md transition-all duration-200 border ${card.borderColor}
              `}
            >
              {/* Colored icon box */}
              <div className={`w-14 h-14 rounded-2xl ${card.bgColor} flex items-center justify-center shrink-0 shadow-inner`}>
                <Icon className={`w-7 h-7 ${card.iconColor}`} />
              </div>

              {/* Number and Subtitle */}
              <div>
                <div className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  {card.count}
                </div>
                <div className="text-xs font-bold text-slate-500 dark:text-slate-400 mt-0.5">
                  {card.title}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Analytics & Tahlil Section (Replaces Recent Appeals) */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
          <HiOutlineChartBar className="w-5 h-5 text-indigo-500" />
          <h3 className="font-extrabold text-slate-900 dark:text-white text-base">Tahliliy Hisobotlar & Statistika</h3>
        </div>

        {/* Analytics Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Category Share Chart Box */}
          <div className="urspi-card p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-4 flex items-center gap-2">
              <HiOutlineChartPie className="w-5 h-5 text-amber-500" />
              Murojaat Turlari Taqsimoti
            </h3>

            <div className="space-y-5">
              <div>
                <div className="flex justify-between items-center text-xs font-bold mb-2">
                  <span className="text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                    <RiShieldFlashLine className="w-4 h-4" /> Korrupsion Holatlar
                  </span>
                  <span className="text-slate-800 dark:text-white font-black">{corruptionCount} ta ({total ? Math.round((corruptionCount/total)*100) : 0}%)</span>
                </div>
                <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-950 overflow-hidden border border-slate-200 dark:border-slate-800">
                  <div className="h-full bg-gradient-to-r from-amber-500 to-rose-500 rounded-full transition-all duration-700" style={{ width: `${total ? (corruptionCount/total)*100 : 0}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center text-xs font-bold mb-2">
                  <span className="text-cyan-600 dark:text-cyan-400 flex items-center gap-1.5">
                    <HiOutlineCpuChip className="w-4 h-4" /> Tizim Muammolari
                  </span>
                  <span className="text-slate-800 dark:text-white font-black">{systemCount} ta ({total ? Math.round((systemCount/total)*100) : 0}%)</span>
                </div>
                <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-950 overflow-hidden border border-slate-200 dark:border-slate-800">
                  <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-700" style={{ width: `${total ? (systemCount/total)*100 : 0}%` }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Resolution Ratios Box */}
          <div className="urspi-card p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-4 flex items-center gap-2">
              <HiOutlineCheckBadge className="w-5 h-5 text-emerald-500" />
              Ijro Samaradorligi
            </h3>

            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60">
                <div className="text-xs text-slate-600 dark:text-slate-400 font-bold mb-1">Muvaffaqiyatli Hal Etilgan</div>
                <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{doneCount}</div>
                <div className="text-[10px] text-slate-500 font-semibold mt-1">{total ? Math.round((doneCount/total)*100) : 0}% umumiy bazadan</div>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60">
                <div className="text-xs text-slate-600 dark:text-slate-400 font-bold mb-1">Jarayonda / O'rganilayotgan</div>
                <div className="text-2xl font-black text-amber-600 dark:text-amber-400">{progressCount + newCount}</div>
                <div className="text-[10px] text-slate-500 font-semibold mt-1">Ijro kutilmoqda</div>
              </div>
            </div>
          </div>

          {/* Language Breakdown */}
          <div className="md:col-span-2 urspi-card p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-4 flex items-center gap-2">
              <HiOutlineGlobeAlt className="w-5 h-5 text-cyan-500" />
              Foydalanuvchilar Tili Statistikasi
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-600 dark:text-slate-400 font-bold">O'zbek Tili</div>
                  <div className="text-lg font-extrabold text-cyan-600 dark:text-cyan-400 mt-0.5">{uzCount} ta murojaat</div>
                </div>
                <div className="text-2xl font-black text-slate-400 dark:text-slate-700">{total ? Math.round((uzCount/total)*100) : 0}%</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-600 dark:text-slate-400 font-bold">Rus Tili</div>
                  <div className="text-lg font-extrabold text-red-500 dark:text-red-400 mt-0.5">{ruCount} ta murojaat</div>
                </div>
                <div className="text-2xl font-black text-slate-400 dark:text-slate-700">{total ? Math.round((ruCount/total)*100) : 0}%</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-600 dark:text-slate-400 font-bold">Ingliz Tili</div>
                  <div className="text-lg font-extrabold text-indigo-500 dark:text-indigo-400 mt-0.5">{enCount} ta murojaat</div>
                </div>
                <div className="text-2xl font-black text-slate-400 dark:text-slate-700">{total ? Math.round((enCount/total)*100) : 0}%</div>
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
