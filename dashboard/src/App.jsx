import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import OverviewTab from './components/OverviewTab';
import AppealTable from './components/AppealTable';
import SettingsTab from './components/SettingsTab';
import AppealDetailModal from './components/AppealDetailModal';
import LoginModal from './components/LoginModal';
import { api } from './api';
import { RiFileExcel2Line } from 'react-icons/ri';
import { HiOutlineCheckCircle, HiOutlineXMark } from 'react-icons/hi2';
import * as XLSX from 'xlsx';

export default function App() {
  const [admin, setAdmin] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [toast, setToast] = useState(null);

  const triggerToast = (text, type = 'success') => {
    setToast({ text, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };
  const [loading, setLoading] = useState(true);

  // Theme mode: false = Light (UrSPI default white theme), true = Dark
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Active navigation tab
  const [activeTab, setActiveTab] = useState('overview'); // overview, appeals, corruption, system, analytics, settings

  const [stats, setStats] = useState(null);
  const [appeals, setAppeals] = useState([]);
  const [selectedAppeal, setSelectedAppeal] = useState(null);

  // Filters
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [langFilter, setLangFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // Apply dark mode class to HTML tag
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Synchronize Tab selection with category filters
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    if (tabId === 'corruption') {
      setCategoryFilter('corruption');
    } else if (tabId === 'system') {
      setCategoryFilter('system');
    } else if (tabId === 'appeals' || tabId === 'overview') {
      setCategoryFilter('ALL');
    }
  };

  // Check login token on mount
  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    const savedUser = localStorage.getItem('admin_user');
    if (token) {
      setIsLoggedIn(true);
      if (savedUser) setAdmin(JSON.parse(savedUser));
    }
  }, []);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const statsRes = await api.getStats();
      setStats(statsRes);

      const catParam = activeTab === 'corruption' ? 'corruption' : activeTab === 'system' ? 'system' : categoryFilter;

      const appealsRes = await api.getAppeals({
        category_key: catParam,
        status: statusFilter,
        language: langFilter,
        search: searchTerm
      });
      setAppeals(appealsRes.data || []);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  }, [activeTab, categoryFilter, statusFilter, langFilter, searchTerm]);

  useEffect(() => {
    if (isLoggedIn) {
      fetchData();
      const interval = setInterval(() => {
        fetchData();
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [isLoggedIn, fetchData]);

  const handleLogin = async (username, password) => {
    const res = await api.login(username, password);
    if (res.token) {
      localStorage.setItem('admin_token', res.token);
      localStorage.setItem('admin_user', JSON.stringify(res.admin));
      setAdmin(res.admin);
      setIsLoggedIn(true);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    setAdmin(null);
    setIsLoggedIn(false);
  };

  const handleUpdateStatus = async (id, status, admin_notes) => {
    await api.updateStatus(id, status, admin_notes);
    triggerToast("Ariza holati muvaffaqiyatli o'zgartirildi", "success");
    fetchData();
    if (selectedAppeal && selectedAppeal.id === id) {
      const updated = await api.getAppealDetail(id);
      setSelectedAppeal(updated);
    }
  };

  const handleSendReply = async (id, message) => {
    const res = await api.sendReply(id, message);
    triggerToast("Muvaffaqiyatli jo'natildi", "success");
    fetchData();
    if (selectedAppeal && selectedAppeal.id === id) {
      const updated = await api.getAppealDetail(id);
      setSelectedAppeal(updated);
    }
    return res;
  };

  const handleExportExcel = () => {
    if (!appeals || appeals.length === 0) {
      alert("Yuklash uchun arizalar mavjud emas");
      return;
    }

    const exportData = appeals.map((item, index) => ({
      "№": index + 1,
      "Tracking ID": item.tracking_id || item.id,
      "Sana / Vaqt": item.created_at ? new Date(item.created_at).toLocaleString('uz-UZ') : '',
      "Murojaatchi Ismi (F.I.SH)": item.full_name || item.first_name || (item.is_anonymous ? "Anonim" : "Noma'lum"),
      "Telegram Username": item.username ? `@${item.username}` : '-',
      "Telefon Raqam": item.phone_number || '-',
      "Kategoriya": item.category || (item.category_key === 'corruption' ? 'Korrupsion Holat' : 'Tizim Muammosi'),
      "Til": (item.language || '').toUpperCase(),
      "Murojaat Matni": item.text || '',
      "Holati": item.status || 'Yangi',
      "Rasm Mavjudligi": item.photo_path ? "Mavjud" : "Yo'q",
      "Ichki Izoh": item.admin_notes || ''
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    worksheet['!cols'] = [
      { wch: 5 },
      { wch: 16 },
      { wch: 18 },
      { wch: 20 },
      { wch: 18 },
      { wch: 18 },
      { wch: 20 },
      { wch: 8 },
      { wch: 45 },
      { wch: 14 },
      { wch: 15 },
      { wch: 25 },
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Arizalar");

    const dateStr = new Date().toISOString().slice(0, 10);
    XLSX.writeFile(workbook, `Arizalar_${dateStr}.xlsx`);
  };

  if (!isLoggedIn) {
    return (
      <LoginModal 
        onLogin={handleLogin} 
        isDarkMode={isDarkMode} 
        toggleDarkMode={() => setIsDarkMode(!isDarkMode)} 
      />
    );
  }

  const corruptionCount = stats?.byCategory?.find(c => c.category_key === 'corruption')?.count || 0;
  const systemCount = stats?.byCategory?.find(c => c.category_key === 'system')?.count || 0;
  const newCount = stats?.byStatus?.find(s => s.status === 'Yangi')?.count ?? (appeals ? appeals.filter(a => a.status === 'Yangi').length : 0);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex transition-colors font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* UrSPI Admin Left Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        counts={{
          total: stats?.total || 0,
          corruption: corruptionCount,
          system: systemCount,
          newAppeals: newCount
        }}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content Area (Offset by Sidebar width on desktop) */}
      <div className="flex-1 lg:pl-72 flex flex-col min-w-0">
        
        {/* Top Navbar */}
        <Navbar
          admin={admin}
          activeTab={activeTab}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onLogout={handleLogout}
          onRefresh={fetchData}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          isDarkMode={isDarkMode}
          toggleDarkMode={() => setIsDarkMode(!isDarkMode)}
          newAppealsCount={newCount}
        />

        {/* Dynamic Body Content */}
        <main className="flex-1 p-4 lg:p-8 max-w-[1550px] w-full mx-auto">
          
          {/* Tab 1: Dashboard (Overview) */}
          {activeTab === 'overview' && (
            <OverviewTab
              stats={stats}
              appeals={appeals}
              onSelectAppeal={(appeal) => setSelectedAppeal(appeal)}
              setActiveTab={handleTabChange}
            />
          )}

          {/* Tab 2: Appeals Data Table (Arizalar - Jadval ko'rinishda) */}
          {(activeTab === 'appeals' || activeTab === 'corruption' || activeTab === 'system') && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    {activeTab === 'corruption' ? "🚨 Korrupsiya Arizalari" :
                     activeTab === 'system' ? "⚙️ Tizim Muammolari Ro'yxati" :
                     "📥 Arizalar (Jadval ko'rinishida)"}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {activeTab === 'corruption' ? "Korrupsiya holatlari bo'yicha tushgan murojaatlar" :
                     activeTab === 'system' ? "Tizim xatoliklari bo'yicha murojaatlar" :
                     "Telegram bot orqali kelib tushgan barcha murojaatlar bazasi"}
                  </p>
                </div>

                {/* Big Outline Excel Export Button in Top Page Header */}
                <button
                  onClick={handleExportExcel}
                  title="Arizalarni Excel (.xlsx) formatida yuklab olish"
                  className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-2xl border-2 border-emerald-500/80 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:border-emerald-600 font-extrabold text-sm transition-all active:scale-95 shadow-md group"
                >
                  <RiFileExcel2Line className="w-5 h-5 text-emerald-500 transition-transform group-hover:scale-110 shrink-0" />
                  <span>Excel'ga yuklash (.xlsx)</span>
                </button>
              </div>

              <AppealTable
                appeals={appeals}
                loading={loading}
                onSelectAppeal={(appeal) => setSelectedAppeal(appeal)}
                categoryFilter={categoryFilter}
                setCategoryFilter={setCategoryFilter}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                langFilter={langFilter}
                setLangFilter={setLangFilter}
              />
            </div>
          )}

          {/* Tab 3: Settings (Sozlamalar) */}
          {activeTab === 'settings' && (
            <SettingsTab admin={admin} />
          )}

        </main>

        {/* Footer */}
        <footer className="border-t border-slate-200/80 dark:border-slate-800 py-4 px-8 text-center text-xs text-slate-400 dark:text-slate-500">
          UrSPI Admin Dashboard • Shaffoflik & Murojaatlar Tizimi v2.0
        </footer>

      </div>

      {/* Floating Global Toast Notification */}
      {toast && (
        <div className="fixed top-6 right-6 z-[9999] animate-bounce-in">
          <div className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl border backdrop-blur-md transition-all ${
            toast.type === 'success'
              ? 'bg-slate-900/95 dark:bg-slate-900/95 text-white border-emerald-500/50 shadow-emerald-500/10'
              : 'bg-rose-950/95 text-white border-rose-500/50 shadow-rose-500/10'
          }`}>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <HiOutlineCheckCircle className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="text-xs font-extrabold pr-2">
              {toast.text}
            </div>
            <button
              onClick={() => setToast(null)}
              className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            >
              <HiOutlineXMark className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Appeal Detail Viewer & Direct Telegram Reply Modal */}
      {selectedAppeal && (
        <AppealDetailModal
          appeal={selectedAppeal}
          onClose={() => setSelectedAppeal(null)}
          onUpdateStatus={handleUpdateStatus}
          onSendReply={handleSendReply}
        />
      )}

    </div>
  );
}
