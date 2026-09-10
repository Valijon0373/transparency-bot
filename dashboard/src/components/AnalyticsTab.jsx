import React from 'react';
import { 
  HiOutlineChartBar, 
  HiOutlineChartPie, 
  HiOutlineArrowTrendingUp, 
  HiOutlineCheckBadge, 
  HiOutlineGlobeAlt, 
  HiOutlineCpuChip 
} from 'react-icons/hi2';
import { RiShieldFlashLine } from 'react-icons/ri';

export default function AnalyticsTab({ stats }) {
  const total = stats?.total || 0;
  
  const corruptionCount = stats?.byCategory?.find(c => c.category_key === 'corruption')?.count || 0;
  const systemCount = stats?.byCategory?.find(c => c.category_key === 'system')?.count || 0;
  
  const doneCount = stats?.byStatus?.find(s => s.status === 'Bajarildi')?.count || 0;
  const progressCount = stats?.byStatus?.find(s => s.status === 'Jarayonda')?.count || 0;
  const newCount = stats?.byStatus?.find(s => s.status === 'Yangi')?.count || 0;

  const uzCount = stats?.byLanguage?.find(l => l.language === 'uz')?.count || 0;
  const ruCount = stats?.byLanguage?.find(l => l.language === 'ru')?.count || 0;
  const enCount = stats?.byLanguage?.find(l => l.language === 'en')?.count || 0;

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header Banner */}
      <div className="glass-card p-6 rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900/90 to-indigo-950/40 flex items-center justify-between shadow-xl">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold mb-2">
            <HiOutlineChartBar className="w-4 h-4" /> Tahliliy Hisobotlar
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">Statistika va Analitika</h2>
          <p className="text-xs text-slate-400 mt-0.5">Tizim bo'yicha tushgan arizalarning to'liq ko'rsatkichlari va tahlillari</p>
        </div>

        <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 hidden sm:block shadow-inner">
          <HiOutlineArrowTrendingUp className="w-8 h-8" />
        </div>
      </div>

      {/* Analytics Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Category Share Chart Box */}
        <div className="glass-card p-6 rounded-3xl border border-slate-800 shadow-md">
          <h3 className="font-bold text-white text-base mb-4 flex items-center gap-2">
            <HiOutlineChartPie className="w-5 h-5 text-amber-400" />
            Murojaat Turlari Taqsimoti
          </h3>

          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center text-xs font-bold mb-2">
                <span className="text-amber-400 flex items-center gap-1.5">
                  <RiShieldFlashLine className="w-4 h-4" /> Korrupsion Holatlar
                </span>
                <span className="text-white text-sm font-black">{corruptionCount} ta ({total ? Math.round((corruptionCount/total)*100) : 0}%)</span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-950 overflow-hidden border border-slate-800">
                <div className="h-full bg-gradient-to-r from-amber-500 to-rose-500 rounded-full transition-all duration-700" style={{ width: `${total ? (corruptionCount/total)*100 : 0}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center text-xs font-bold mb-2">
                <span className="text-cyan-400 flex items-center gap-1.5">
                  <HiOutlineCpuChip className="w-4 h-4" /> Tizim Muammolari
                </span>
                <span className="text-white text-sm font-black">{systemCount} ta ({total ? Math.round((systemCount/total)*100) : 0}%)</span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-950 overflow-hidden border border-slate-800">
                <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-700" style={{ width: `${total ? (systemCount/total)*100 : 0}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Resolution Ratios Box */}
        <div className="glass-card p-6 rounded-3xl border border-slate-800 shadow-md">
          <h3 className="font-bold text-white text-base mb-4 flex items-center gap-2">
            <HiOutlineCheckBadge className="w-5 h-5 text-emerald-400" />
            Ijro Samaradorligi
          </h3>

          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
              <div className="text-xs text-slate-400 font-semibold mb-1">Muvaffaqiyatli Hal Etilgan</div>
              <div className="text-2xl font-black text-emerald-400">{doneCount}</div>
              <div className="text-[10px] text-slate-500 font-medium mt-1">{total ? Math.round((doneCount/total)*100) : 0}% umumiy bazadan</div>
            </div>

            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20">
              <div className="text-xs text-slate-400 font-semibold mb-1">Jarayonda / O'rganilayotgan</div>
              <div className="text-2xl font-black text-amber-400">{progressCount + newCount}</div>
              <div className="text-[10px] text-slate-500 font-medium mt-1">Ijro kutilmoqda</div>
            </div>
          </div>
        </div>

        {/* Language Breakdown */}
        <div className="md:col-span-2 glass-card p-6 rounded-3xl border border-slate-800 shadow-md">
          <h3 className="font-bold text-white text-base mb-4 flex items-center gap-2">
            <HiOutlineGlobeAlt className="w-5 h-5 text-cyan-400" />
            Foydalanuvchilar Tili Statistikasi
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800/80 flex items-center justify-between">
              <div>
                <div className="text-2xl mb-1">🇺🇿</div>
                <div className="text-xs text-slate-400 font-bold">O'zbek Tili</div>
                <div className="text-xl font-extrabold text-cyan-400 mt-0.5">{uzCount} ta murojaat</div>
              </div>
              <div className="text-2xl font-black text-slate-700">{total ? Math.round((uzCount/total)*100) : 0}%</div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800/80 flex items-center justify-between">
              <div>
                <div className="text-2xl mb-1">🇷🇺</div>
                <div className="text-xs text-slate-400 font-bold">Rus Tili</div>
                <div className="text-xl font-extrabold text-red-400 mt-0.5">{ruCount} ta murojaat</div>
              </div>
              <div className="text-2xl font-black text-slate-700">{total ? Math.round((ruCount/total)*100) : 0}%</div>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800/80 flex items-center justify-between">
              <div>
                <div className="text-2xl mb-1">🇬🇧</div>
                <div className="text-xs text-slate-400 font-bold">Ingliz Tili</div>
                <div className="text-xl font-extrabold text-indigo-400 mt-0.5">{enCount} ta murojaat</div>
              </div>
              <div className="text-2xl font-black text-slate-700">{total ? Math.round((enCount/total)*100) : 0}%</div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
