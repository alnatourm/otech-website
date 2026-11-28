'use client';

import React, { useState } from 'react';
import { useCrm } from '../CrmContext';
import { StatusBadge } from '../shared/StatusBadge';
import { SourceBadge } from '../shared/SourceBadge';
import {
  X,
  Phone,
  MessageCircle,
  Mail,
  MapPin,
  Building2,
  Calendar,
  Briefcase,
  History,
  FileText,
  Send,
  Plus,
} from 'lucide-react';
import type { Contact } from '@/lib/crm/types';

export const ContactDrawer: React.FC = () => {
  const { drawerContact, closeDrawer, deals, activities, handleAddActivity, setIsAddDealOpen } = useCrm();

  const [activeTab, setActiveTab] = useState<'overview' | 'deals' | 'activities'>('overview');
  const [quickNote, setQuickNote] = useState('');
  const [isSubmittingNote, setIsSubmittingNote] = useState(false);

  if (!drawerContact) return null;

  const contactDeals = deals.filter((d) => d.contact_id === drawerContact.id);
  const contactActivities = activities.filter((a) => a.contact_id === drawerContact.id);

  // Clean Jordanian phone for WhatsApp link
  const rawPhone = drawerContact.phone.replace(/[^0-9]/g, '');
  const waLink = `https://wa.me/${rawPhone}?text=${encodeURIComponent(
    `مرحباً ${drawerContact.full_name}، نتواصل معك من شركة OTECH للحلول البرمجية والذكاء الاصطناعي في عمّان.`
  )}`;

  const handleSaveNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickNote.trim()) return;

    setIsSubmittingNote(true);
    try {
      await handleAddActivity({
        contact_id: drawerContact.id,
        type: 'note',
        description: quickNote.trim(),
      });
      setQuickNote('');
    } finally {
      setIsSubmittingNote(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-otech-dark-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="absolute inset-y-0 end-0 max-w-full flex">
        <div className="relative w-screen max-w-md bg-otech-dark-900 border-s border-otech-dark-700 shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-otech-dark-700 bg-otech-dark-950/60">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-otech-blue-500 to-otech-cyan-500 flex items-center justify-center text-lg font-bold text-white shadow-glow-cyan">
                  {drawerContact.full_name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-heading font-bold text-lg text-white">
                    {drawerContact.full_name}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                    <Building2 className="w-3.5 h-3.5 text-otech-cyan-400" />
                    <span>{drawerContact.company_name || 'جهة اتصال مستقلة'}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={closeDrawer}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-otech-dark-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Direct Connect Buttons */}
            <div className="grid grid-cols-2 gap-2.5 mt-5">
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold text-emerald-300 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 rounded-xl transition shadow-sm"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>وتساب مباشر</span>
              </a>
              <a
                href={`tel:${drawerContact.phone}`}
                className="flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold text-otech-cyan-300 bg-otech-cyan-500/15 hover:bg-otech-cyan-500/25 border border-otech-cyan-500/30 rounded-xl transition shadow-sm"
              >
                <Phone className="w-4 h-4 text-otech-cyan-400" />
                <span>اتصال هاتف</span>
              </a>
            </div>

            {/* Badges */}
            <div className="flex items-center gap-2 mt-4">
              <StatusBadge status={drawerContact.lead_status} />
              <SourceBadge source={drawerContact.lead_source} />
              <span className="text-[11px] text-slate-400 ms-auto flex items-center gap-1">
                <MapPin className="w-3 h-3 text-otech-cyan-400" />
                {drawerContact.city || 'عمّان'}
              </span>
            </div>
          </div>

          {/* Subtabs */}
          <div className="flex border-b border-otech-dark-700 bg-otech-dark-950/40 px-6">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-3 text-xs font-bold border-b-2 me-6 transition ${
                activeTab === 'overview'
                  ? 'border-otech-cyan-400 text-otech-cyan-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              نظرة عامة
            </button>
            <button
              onClick={() => setActiveTab('deals')}
              className={`py-3 text-xs font-bold border-b-2 me-6 transition flex items-center gap-1.5 ${
                activeTab === 'deals'
                  ? 'border-otech-cyan-400 text-otech-cyan-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>الصفقات</span>
              <span className="px-1.5 py-0.2 rounded-full bg-otech-dark-800 text-[10px] text-slate-300">
                {contactDeals.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('activities')}
              className={`py-3 text-xs font-bold border-b-2 transition flex items-center gap-1.5 ${
                activeTab === 'activities'
                  ? 'border-otech-cyan-400 text-otech-cyan-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>الخط الزمني</span>
              <span className="px-1.5 py-0.2 rounded-full bg-otech-dark-800 text-[10px] text-slate-300">
                {contactActivities.length}
              </span>
            </button>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-5">
            {activeTab === 'overview' && (
              <div className="space-y-4 text-xs">
                {/* Contact Data Details */}
                <div className="bg-otech-dark-950/80 rounded-2xl p-4 border border-otech-dark-700/80 space-y-3">
                  <div className="flex justify-between items-center py-1 border-b border-otech-dark-800">
                    <span className="text-slate-400">رقم الهاتف</span>
                    <span dir="ltr" className="font-mono text-white font-semibold">
                      {drawerContact.phone}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-otech-dark-800">
                    <span className="text-slate-400">البريد الإلكتروني</span>
                    <span dir="ltr" className="text-white">
                      {drawerContact.email || 'غير مسجل'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-otech-dark-800">
                    <span className="text-slate-400">الموقع الجغرافي</span>
                    <span className="text-white">
                      {drawerContact.city || 'عمّان'}، {drawerContact.country || 'الأردن'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-slate-400">تاريخ التسجيل</span>
                    <span className="text-slate-300 font-mono text-[11px]">
                      {new Date(drawerContact.created_at).toLocaleDateString('ar-JO')}
                    </span>
                  </div>
                </div>

                {/* Notes Block */}
                {drawerContact.notes && (
                  <div className="bg-otech-dark-950/80 rounded-2xl p-4 border border-otech-dark-700/80">
                    <span className="text-xs font-bold text-slate-300 block mb-1">
                      ملاحظات واحتياجات العميل:
                    </span>
                    <p className="text-xs text-slate-400 leading-relaxed">{drawerContact.notes}</p>
                  </div>
                )}

                {/* Quick Note Box */}
                <form onSubmit={handleSaveNote} className="space-y-2">
                  <label className="block text-xs font-bold text-slate-300">
                    إضافة ملاحظة سريعة في ملف العميل
                  </label>
                  <textarea
                    rows={2}
                    value={quickNote}
                    onChange={(e) => setQuickNote(e.target.value)}
                    placeholder="اكتب ملاحظة متابعة جديدة..."
                    className="w-full px-3 py-2 bg-otech-dark-950 border border-otech-dark-700 rounded-xl text-white text-xs focus:border-otech-cyan-400 focus:outline-none transition resize-none"
                  />
                  <button
                    type="submit"
                    disabled={isSubmittingNote || !quickNote.trim()}
                    className="w-full py-2 px-3 text-xs font-bold text-otech-dark-950 bg-gradient-to-r from-otech-cyan-400 to-otech-blue-400 hover:from-otech-cyan-300 hover:to-otech-blue-300 rounded-xl shadow-glow-cyan transition duration-200 disabled:opacity-50"
                  >
                    {isSubmittingNote ? 'جاري الحفظ...' : 'حفظ الملاحظة في السجل'}
                  </button>
                </form>
              </div>
            )}

            {activeTab === 'deals' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-white">الصفقات المرتبطة بالعميل</span>
                  <button
                    onClick={() => setIsAddDealOpen(true)}
                    className="text-xs text-otech-cyan-400 hover:text-otech-cyan-300 flex items-center gap-1 font-semibold"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>صفقة جديدة</span>
                  </button>
                </div>

                {contactDeals.length === 0 ? (
                  <div className="text-center py-8 text-xs text-slate-500">
                    لا توجد صفقات مرتبطة حالياً بهذا العميل.
                  </div>
                ) : (
                  contactDeals.map((deal) => (
                    <div
                      key={deal.id}
                      className="p-3.5 rounded-xl bg-otech-dark-950/80 border border-otech-dark-700 hover:border-otech-cyan-400/50 transition space-y-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-heading font-bold text-xs text-white">
                          {deal.title}
                        </span>
                        <StatusBadge stage={deal.stage} />
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-otech-dark-800 text-xs">
                        <span className="font-mono font-bold text-otech-cyan-400">
                          {deal.value.toLocaleString()} د.أ
                        </span>
                        <span className="text-slate-400 text-[10px]">
                          إغلاق متوقع: {deal.expected_close_date || 'غير محدد'}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'activities' && (
              <div className="space-y-3">
                <div className="text-xs font-bold text-white mb-2">سجل التفاعلات مع هذا العميل</div>
                {contactActivities.length === 0 ? (
                  <div className="text-center py-8 text-xs text-slate-500">
                    لا توجد تفاعلات مسجلة بعد لهذا العميل.
                  </div>
                ) : (
                  contactActivities.map((act) => (
                    <div
                      key={act.id}
                      className="p-3 rounded-xl bg-otech-dark-950/80 border border-otech-dark-700 text-xs space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white uppercase text-[10px] tracking-wider text-otech-cyan-400">
                          {act.type}
                        </span>
                        <span className="font-mono text-[10px] text-slate-500">
                          {new Date(act.created_at).toLocaleDateString('ar-JO')}
                        </span>
                      </div>
                      <p className="text-slate-300 leading-relaxed">{act.description}</p>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
