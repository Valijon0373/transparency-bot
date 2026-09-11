import React, { useState } from 'react';
import { 
  HiOutlineXMark, 
  HiOutlinePhone, 
  HiOutlineUser, 
  HiOutlineCalendarDays, 
  HiOutlinePhoto, 
  HiOutlineCheckCircle, 
  HiOutlineShieldCheck, 
  HiOutlineChatBubbleLeftRight, 
  HiOutlineArrowTopRightOnSquare,
  HiOutlinePaperAirplane,
  HiOutlineUserMinus,
  HiOutlineClipboardDocument,
  HiOutlineClipboardDocumentCheck,
  HiOutlineSparkles,
  HiOutlineArrowPath,
  HiOutlineXCircle,
  HiOutlineCpuChip
} from 'react-icons/hi2';
import { RiShieldFlashLine } from 'react-icons/ri';
import { TbBrandTelegram } from 'react-icons/tb';
import { PiBellRingingLight } from 'react-icons/pi';

export default function AppealDetailModal({ appeal, onClose, onUpdateStatus, onSendReply }) {
  if (!appeal) return null;

  const [status, setStatus] = useState(appeal.status || 'Yangi');
  const [adminNotes, setAdminNotes] = useState(appeal.admin_notes || '');
  const [replyMessage, setReplyMessage] = useState('');
  const [sendingReply, setSendingReply] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [copiedId, setCopiedId] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);

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

  const copyToClipboard = (text, type) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    if (type === 'id') {
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    } else if (type === 'phone') {
      setCopiedPhone(true);
      setTimeout(() => setCopiedPhone(false), 2000);
    }
  };

  const handleStatusSubmit = async (e) => {
    e.preventDefault();
    setUpdatingStatus(true);
    setFeedback(null);
    try {
      await onUpdateStatus(appeal.id, status, adminNotes);
      setFeedback({ type: 'success', text: "Ariza holati muvaffaqiyatli o'zgartirildi" });
    } catch (err) {
      setFeedback({ type: 'error', text: err.message || "Holatni o'zgartirishda xatolik yuz berdi" });
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!replyMessage.trim()) return;
    setSendingReply(true);
    setFeedback(null);
    try {
      const res = await onSendReply(appeal.id, replyMessage);
      setReplyMessage('');
      setFeedback({ 
        type: 'success', 
        text: "Muvaffaqiyatli jo'natildi" 
      });
    } catch (err) {
      setFeedback({ type: 'error', text: err.message || "Javob yuborishda xatolik yuz berdi" });
    } finally {
      setSendingReply(false);
    }
  };

  const renderStatusBadge = (statusName) => {
    switch (statusName) {
      case 'Yangi':
        return (
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-extrabold bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-700 shadow-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-ping shrink-0" />
            <PiBellRingingLight className="w-5 h-5 text-blue-500 shrink-0" />
            Yangi
          </span>
        );
      case 'Jarayonda':
        return (
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-extrabold bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700 shadow-sm">
            <HiOutlineArrowPath className="w-5 h-5 animate-spin text-amber-500 shrink-0" />
            Jarayonda
          </span>
        );
      case 'Bajarildi':
        return (
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-extrabold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 shadow-sm">
            <HiOutlineCheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
            Bajarildi
          </span>
        );
      case 'Rad etildi':
        return (
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-extrabold bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-700 shadow-sm">
            <HiOutlineXCircle className="w-5 h-5 text-rose-500 shrink-0" />
            Rad etildi
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            {statusName}
          </span>
        );
    }
  };

  const isCorruption = appeal.category_key === 'corruption' || appeal.category?.includes('Korrupsion') || appeal.category?.includes('Коррупция');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/75 backdrop-blur-md overflow-y-auto animate-fadeIn">
      
      {/* Modal Container */}
      <div className="w-full max-w-4xl rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col bg-white dark:bg-slate-900 transition-all duration-200">
        
        {/* Header Bar */}
        <div className="px-6 py-4 border-b border-slate-200/80 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-1.5 bg-teal-50 dark:bg-teal-950/80 border border-teal-200 dark:border-teal-800/80 px-3 py-1 rounded-xl shadow-sm">
              <span className="font-mono text-teal-700 dark:text-teal-400 font-extrabold text-sm tracking-wide">
                {appeal.tracking_id}
              </span>
              <button 
                onClick={() => copyToClipboard(appeal.tracking_id, 'id')}
                className="text-teal-600 dark:text-teal-400 hover:text-teal-800 dark:hover:text-teal-200 p-0.5 rounded transition-all"
                title="ID'ni nusxalash"
              >
                {copiedId ? (
                  <HiOutlineClipboardDocumentCheck className="w-4 h-4 text-emerald-500" />
                ) : (
                  <HiOutlineClipboardDocument className="w-4 h-4" />
                )}
              </button>
            </div>

            {renderStatusBadge(appeal.status)}

            <div className="text-slate-500 dark:text-slate-400 text-xs font-semibold flex items-center gap-1.5 ml-1">
              <HiOutlineCalendarDays className="w-4 h-4 text-teal-500" />
              <span>{formatDate(appeal.created_at)}</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-all active:scale-95"
            title="Yopish (Esc)"
          >
            <HiOutlineXMark className="w-5 h-5" />
          </button>
        </div>

        {/* Dynamic Feedback Alert */}
        {feedback && (
          <div className={`px-6 py-3 text-xs font-bold flex items-center gap-2.5 transition-all ${
            feedback.type === 'success' 
              ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-b border-emerald-200 dark:border-emerald-800' 
              : 'bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border-b border-rose-200 dark:border-rose-800'
          }`}>
            <HiOutlineCheckCircle className="w-4 h-4 shrink-0" />
            <span>{feedback.text}</span>
          </div>
        )}

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 custom-scrollbar">
          
          {/* Top Meta Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            {/* Card 1: Applicant */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-1.5">
              <div className="text-[11px] uppercase tracking-wider text-slate-400 dark:text-slate-500 font-extrabold flex items-center justify-between">
                <span>Murojaatchi</span>
                {appeal.phone_number && (
                  <button
                    onClick={() => copyToClipboard(appeal.phone_number, 'phone')}
                    className="text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                    title="Nomer nusxalash"
                  >
                    {copiedPhone ? (
                      <HiOutlineClipboardDocumentCheck className="w-3.5 h-3.5 text-emerald-500" />
                    ) : (
                      <HiOutlineClipboardDocument className="w-3.5 h-3.5" />
                    )}
                  </button>
                )}
              </div>
              <div className="text-sm font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <HiOutlinePhone className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
                <span>{appeal.phone_number || '-'}</span>
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 flex flex-col gap-1 pt-0.5">
                {appeal.is_anonymous ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 px-2 py-0.5 rounded-md border border-amber-200 dark:border-amber-800/60 w-fit">
                    <HiOutlineUserMinus className="w-3 h-3" />
                    Anonim murojaat
                  </span>
                ) : (
                  <>
                    <span className="inline-flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200">
                      <HiOutlineUser className="w-3.5 h-3.5 text-teal-500 shrink-0" />
                      <span>{appeal.full_name || appeal.first_name || 'Noma\'lum'}</span>
                    </span>
                    {appeal.username && (
                      <span className="text-[11px] text-slate-400 font-mono">
                        @{appeal.username}
                      </span>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Card 2: Category & Language */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-1.5">
              <div className="text-[11px] uppercase tracking-wider text-slate-400 dark:text-slate-500 font-extrabold">
                Kategoriya va Til
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {isCorruption ? (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 dark:text-amber-300 bg-amber-100/80 dark:bg-amber-950/70 border border-amber-300 dark:border-amber-800 px-2.5 py-1 rounded-lg">
                    <RiShieldFlashLine className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                    Korrupsion Holat
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-800 dark:text-cyan-300 bg-cyan-100/80 dark:bg-cyan-950/70 border border-cyan-300 dark:border-cyan-800 px-2.5 py-1 rounded-lg">
                    <HiOutlineCpuChip className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                    Tizim Muammosi
                  </span>
                )}
                <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-200/70 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700">
                  {appeal.language === 'uz' ? '🇺🇿 UZ' : appeal.language === 'ru' ? '🇷🇺 RU' : appeal.language === 'en' ? '🇬🇧 EN' : appeal.language}
                </span>
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 pt-0.5">
                Kategoriya: <span className="font-semibold text-slate-700 dark:text-slate-300">{appeal.category || 'Murojaat'}</span>
              </div>
            </div>

            {/* Card 3: Status & Telegram Meta */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-1.5">
              <div className="text-[11px] uppercase tracking-wider text-slate-400 dark:text-slate-500 font-extrabold">
                Tizim Ma'lumoti
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-300 font-semibold flex items-center justify-between">
                <span>Telegram ID:</span>
                <span className="font-mono bg-slate-200/60 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 px-2 py-0.5 rounded font-bold text-slate-800 dark:text-slate-200">
                  {appeal.telegram_id || 'Mavjud emas'}
                </span>
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 pt-0.5 flex items-center justify-between">
                <span>Joriy Bosqich:</span>
                <span className="font-bold text-teal-700 dark:text-teal-400">{appeal.status}</span>
              </div>
            </div>

          </div>

          {/* Appeal Text Content Box */}
          <div className="space-y-2">
            <h3 className="text-xs uppercase font-extrabold text-slate-500 dark:text-slate-400 tracking-wider flex items-center gap-2">
              <HiOutlineChatBubbleLeftRight className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              Murojaat Matni
            </h3>
            <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-slate-950 border-l-4 border-l-teal-500 border border-slate-200 dark:border-slate-800/90 text-slate-800 dark:text-slate-100 text-sm leading-relaxed whitespace-pre-wrap font-sans shadow-inner selection:bg-teal-500 selection:text-white">
              {appeal.text}
            </div>
          </div>

          {/* Attached Photo Section */}
          {appeal.photo_path && (
            <div className="space-y-2">
              <h3 className="text-xs uppercase font-extrabold text-slate-500 dark:text-slate-400 tracking-wider flex items-center gap-2">
                <HiOutlinePhoto className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                Biriktirilgan Rasm
              </h3>
              <div className="relative group inline-block rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 max-w-sm shadow-md">
                <img
                  src={appeal.photo_path}
                  alt="Murojaat rasmi"
                  className="w-full max-h-64 object-cover rounded-2xl transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=600&auto=format&fit=crop&q=60';
                  }}
                />
                <a
                  href={appeal.photo_path}
                  target="_blank"
                  rel="noreferrer"
                  className="absolute inset-0 bg-slate-950/75 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 text-white font-bold text-xs transition-all backdrop-blur-xs"
                >
                  <HiOutlineArrowTopRightOnSquare className="w-4 h-4" />
                  <span>To'liq o'lchamda ko'rish</span>
                </a>
              </div>
            </div>
          )}

          {/* Two-Column Action Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            
            {/* Form 1: Status & Admin Notes */}
            <form 
              onSubmit={handleStatusSubmit} 
              className="p-5 rounded-2xl bg-slate-50/90 dark:bg-slate-950 border border-slate-200/90 dark:border-slate-800/90 space-y-4 shadow-sm flex flex-col justify-between"
            >
              <div className="space-y-4">
                <h3 className="text-xs uppercase font-extrabold text-slate-700 dark:text-slate-200 tracking-wider flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2.5">
                  <div className="w-6 h-6 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                    <HiOutlineShieldCheck className="w-4 h-4" />
                  </div>
                  <span>Holatni O'zgartirish</span>
                </h3>

                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5">
                    Murojaat Holati
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs font-bold rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-all shadow-sm"
                  >
                    <option value="Yangi">🔵 Yangi (Ko'rilmagan)</option>
                    <option value="Jarayonda">🟡 Jarayonda (O'rganilmoqda)</option>
                    <option value="Bajarildi">🟢 Bajarildi (Hal etildi)</option>
                    <option value="Rad etildi">🔴 Rad etildi</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5">
                    Ichki Izoh (Admin xodimlari uchun)
                  </label>
                  <textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    rows="3"
                    placeholder="Ichki ko'rib chiqish bo'yicha qisqacha izoh yozing..."
                    className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500 transition-all placeholder-slate-400 shadow-inner"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={updatingStatus}
                className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-extrabold text-xs transition-all shadow-md hover:shadow-teal-500/25 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {updatingStatus ? (
                  <>
                    <HiOutlineArrowPath className="w-4 h-4 animate-spin" />
                    <span>Saqlanmoqda...</span>
                  </>
                ) : (
                  <>
                    <HiOutlineCheckCircle className="w-4 h-4" />
                    <span>Holatni Saqlash</span>
                  </>
                )}
              </button>
            </form>

            {/* Form 2: Direct Reply to Telegram */}
            <form 
              onSubmit={handleReplySubmit} 
              className="p-5 rounded-2xl bg-slate-50/90 dark:bg-slate-950 border border-slate-200/90 dark:border-slate-800/90 space-y-4 shadow-sm flex flex-col justify-between"
            >
              <div className="space-y-4">
                <h3 className="text-xs uppercase font-extrabold text-slate-700 dark:text-slate-200 tracking-wider flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2.5">
                  <div className="w-6 h-6 rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center">
                    <TbBrandTelegram className="w-4 h-4" />
                  </div>
                  <span>Telegram'ga Javob Yuborish</span>
                </h3>

                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5">
                    Javob Xati (Fuqaroga Telegram orqali yuboriladi)
                  </label>
                  <textarea
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    rows="3"
                    placeholder="Fuqaroga rasmiy javob yoki ko'rib chiqish natijasini yozing..."
                    className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500 transition-all placeholder-slate-400 shadow-inner"
                  />
                </div>

                {/* History of Replies */}
                {appeal.replies && appeal.replies.length > 0 && (
                  <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                    <div className="text-[10px] uppercase tracking-wider text-slate-400 font-extrabold">
                      Yuborilgan Javoblar Tarixi:
                    </div>
                    {appeal.replies.map((rep) => (
                      <div key={rep.id} className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs space-y-1 shadow-sm">
                        <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                          <span className="text-sky-600 dark:text-sky-400">@{rep.admin_username || 'admin'}</span>
                          <span>{new Date(rep.created_at).toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <p className="text-slate-700 dark:text-slate-300 text-xs">{rep.message}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={sendingReply || !replyMessage.trim()}
                className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-extrabold text-xs transition-all shadow-md hover:shadow-sky-500/25 flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50"
              >
                {sendingReply ? (
                  <>
                    <HiOutlineArrowPath className="w-4 h-4 animate-spin" />
                    <span>Yuborilmoqda...</span>
                  </>
                ) : (
                  <>
                    <HiOutlinePaperAirplane className="w-4 h-4 rotate-45" />
                    <span>Telegram'ga Yuborish</span>
                  </>
                )}
              </button>
            </form>

          </div>

        </div>

      </div>

    </div>
  );
}

