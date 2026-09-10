import React from 'react';
import { HiOutlineInboxStack, HiOutlineCpuChip, HiOutlineClock } from 'react-icons/hi2';
import { RiShieldFlashLine } from 'react-icons/ri';
import { PiBellRingingLight } from 'react-icons/pi';

export default function StatsCards({ stats, activeFilter, onFilterChange }) {
  const total = stats?.total || 0;
  
  const corruptionCount = stats?.byCategory?.find(c => c.category_key === 'corruption')?.count || 0;
  const systemCount = stats?.byCategory?.find(c => c.category_key === 'system')?.count || 0;
  
  const newCount = stats?.byStatus?.find(s => s.status === 'Yangi')?.count || 0;
  const progressCount = stats?.byStatus?.find(s => s.status === 'Jarayonda')?.count || 0;

  const cards = [
    {
      id: 'ALL_TOTAL',
      title: "Jami Murojaatlar",
      value: total,
      subText: "Telegram bot orqali kelgan barcha arizalar",
      icon: HiOutlineInboxStack,
      color: "from-blue-500/20 to-cyan-500/10 border-blue-500/30 text-blue-500 dark:text-blue-400",
      filterCategory: 'ALL'
    },
    {
      id: 'CORRUPTION',
      title: "Korrupsion Holat",
      value: corruptionCount,
      subText: `${total ? Math.round((corruptionCount / total) * 100) : 0}% umumiy arizalardan`,
      icon: RiShieldFlashLine,
      color: "from-amber-500/20 to-rose-500/10 border-amber-500/30 text-amber-500 dark:text-amber-400",
      filterCategory: 'corruption'
    },
    {
      id: 'SYSTEM',
      title: "Tizim Muammosi",
      value: systemCount,
      subText: `${total ? Math.round((systemCount / total) * 100) : 0}% umumiy arizalardan`,
      icon: HiOutlineCpuChip,
      color: "from-cyan-500/20 to-teal-500/10 border-cyan-500/30 text-cyan-500 dark:text-cyan-400",
      filterCategory: 'system'
    },
    {
      id: 'PENDING',
      title: "Yangi va Jarayonda",
      value: newCount + progressCount,
      subText: `${newCount} yangi • ${progressCount} ko'rib chiqilmoqda`,
      icon: PiBellRingingLight,
      color: "from-violet-500/20 to-purple-500/10 border-violet-500/30 text-violet-500 dark:text-violet-400",
      filterStatus: 'Yangi'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.id}
            onClick={() => {
              if (card.filterCategory) onFilterChange('category', card.filterCategory);
              if (card.filterStatus) onFilterChange('status', card.filterStatus);
            }}
            className={`glass-card p-5 rounded-2xl border transition-all cursor-pointer hover:-translate-y-1 hover:shadow-lg bg-gradient-to-br ${card.color}`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {card.title}
              </span>
              <div className={`p-2.5 rounded-xl bg-white/80 dark:bg-slate-900/80 shadow-sm ${card.color.split(' ').pop()}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-1">
              {card.value}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 truncate font-medium">
              {card.subText}
            </div>
          </div>
        );
      })}
    </div>
  );
}
