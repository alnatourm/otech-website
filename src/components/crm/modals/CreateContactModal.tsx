'use client';

import React, { useState } from 'react';
import { useCrm } from '../CrmContext';
import { X, UserPlus, Building, Phone, Mail, MapPin, Globe, Sparkles } from 'lucide-react';
import type { LeadSource, LeadStatus } from '@/lib/crm/types';

export const CreateContactModal: React.FC = () => {
  const { isAddContactOpen, setIsAddContactOpen, handleAddContact } = useCrm();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('+962 7 ');
  const [email, setEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [city, setCity] = useState('عمّان');
  const [source, setSource] = useState<LeadSource>('website');
  const [status, setStatus] = useState<LeadStatus>('new');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [phoneError, setPhoneError] = useState('');

  if (!isAddContactOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPhoneError('');

    // Basic Jordanian phone validation
    const cleaned = phone.replace(/[^0-9]/g, '');
    if (!cleaned.startsWith('9627') || cleaned.length !== 12) {
      setPhoneError('يرجى إدخال رقم هاتف أردني صحيح يبدأ بـ +962 7 ومكون من 9 أرقام بعد المقدمة');
      return;
    }

    setIsSubmitting(true);
    try {
      await handleAddContact({
        full_name: fullName.trim(),
        phone: `+${cleaned}`,
        email: email.trim() || undefined,
        company_name: companyName.trim() || undefined,
        city,
        lead_source: source,
        lead_status: status,
        notes: notes.trim() || undefined,
      });

      // Reset & close
      setFullName('');
      setPhone('+962 7 ');
      setEmail('');
      setCompanyName('');
      setNotes('');
      setIsAddContactOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-otech-dark-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-otech-dark-900 border border-otech-dark-700 rounded-2xl shadow-2xl p-6 overflow-hidden">
        {/* Glow Accent */}
        <div className="absolute top-0 start-0 end-0 h-1 bg-gradient-to-r from-otech-cyan-400 to-otech-blue-500" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-otech-dark-700 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-otech-blue-500/20 text-otech-cyan-400 border border-otech-cyan-400/30">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-lg text-white">إضافة جهة اتصال جديدة</h3>
              <p className="text-xs text-slate-400">سجل بيانات عميل أو شركة جديدة في خط مبيعات OTECH</p>
            </div>
          </div>
          <button
            onClick={() => setIsAddContactOpen(false)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-otech-dark-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              اسم العميل / المسؤول <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="مثال: م. أحمد السالم"
              className="w-full px-3.5 py-2.5 bg-otech-dark-950 border border-otech-dark-700 rounded-xl text-white text-sm focus:border-otech-cyan-400 focus:outline-none transition"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                رقم الهاتف (الأردن) <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  dir="ltr"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+962 7 9123 4567"
                  className="w-full px-3.5 py-2.5 bg-otech-dark-950 border border-otech-dark-700 rounded-xl text-white text-sm font-mono text-end focus:border-otech-cyan-400 focus:outline-none transition"
                />
              </div>
              {phoneError && <p className="text-[11px] text-rose-400 mt-1">{phoneError}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">البريد الإلكتروني</label>
              <input
                type="email"
                dir="ltr"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ahmad@company.com"
                className="w-full px-3.5 py-2.5 bg-otech-dark-950 border border-otech-dark-700 rounded-xl text-white text-sm text-end focus:border-otech-cyan-400 focus:outline-none transition"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">اسم المنشأة / الشركة</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="مثال: شركة الرواد للحلول"
                className="w-full px-3.5 py-2.5 bg-otech-dark-950 border border-otech-dark-700 rounded-xl text-white text-sm focus:border-otech-cyan-400 focus:outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">المدينة</label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-otech-dark-950 border border-otech-dark-700 rounded-xl text-white text-sm focus:border-otech-cyan-400 focus:outline-none transition"
              >
                <option value="عمّان">عمّان</option>
                <option value="إربد">إربد</option>
                <option value="الزرقاء">الزرقاء</option>
                <option value="العقبة">العقبة</option>
                <option value="السلط">السلط</option>
                <option value="مادبا">مادبا</option>
                <option value="خارج الأردن">خارج الأردن</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">مصدر العميل</label>
              <select
                value={source}
                onChange={(e) => setSource(e.target.value as LeadSource)}
                className="w-full px-3.5 py-2.5 bg-otech-dark-950 border border-otech-dark-700 rounded-xl text-white text-sm focus:border-otech-cyan-400 focus:outline-none transition"
              >
                <option value="website">موقع OTECH</option>
                <option value="whatsapp">محادثة وتساب</option>
                <option value="phone">اتصال مباشر</option>
                <option value="referral">معارف وترشيح</option>
                <option value="ads">حملة إعلانية</option>
                <option value="social_media">شبكات اجتماعية</option>
                <option value="other">أخرى</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">حالة التأهيل المبدئية</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as LeadStatus)}
                className="w-full px-3.5 py-2.5 bg-otech-dark-950 border border-otech-dark-700 rounded-xl text-white text-sm focus:border-otech-cyan-400 focus:outline-none transition"
              >
                <option value="new">جديد (New)</option>
                <option value="contacted">تم التواصل (Contacted)</option>
                <option value="qualified">مؤهل للشراء (Qualified)</option>
                <option value="unqualified">غير مؤهل (Unqualified)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">ملاحظات داخلية أولية</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="أي تفاصيل حول احتياج العميل أو حجم الميزانية المتوقعة..."
              className="w-full px-3.5 py-2 bg-otech-dark-950 border border-otech-dark-700 rounded-xl text-white text-sm focus:border-otech-cyan-400 focus:outline-none transition resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-otech-dark-700">
            <button
              type="button"
              onClick={() => setIsAddContactOpen(false)}
              className="px-4 py-2 text-sm text-slate-400 hover:text-white rounded-xl hover:bg-otech-dark-800 transition"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 text-sm font-semibold text-otech-dark-950 bg-gradient-to-r from-otech-cyan-400 to-otech-blue-400 hover:from-otech-cyan-300 hover:to-otech-blue-300 rounded-xl shadow-glow-cyan transition duration-200 disabled:opacity-50"
            >
              {isSubmitting ? 'جاري الحفظ...' : 'حفظ جهة الاتصال'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
