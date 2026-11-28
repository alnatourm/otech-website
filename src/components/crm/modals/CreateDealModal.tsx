'use client';

import React, { useState } from 'react';
import { useCrm } from '../CrmContext';
import { X, Briefcase, Coins, Sparkles, Building2 } from 'lucide-react';
import type { DealStage } from '@/lib/crm/types';

export const CreateDealModal: React.FC = () => {
  const { isAddDealOpen, setIsAddDealOpen, handleAddDeal, contacts } = useCrm();

  const [title, setTitle] = useState('');
  const [value, setValue] = useState('');
  const [contactId, setContactId] = useState(contacts[0]?.id || '');
  const [stage, setStage] = useState<DealStage>('new_lead');
  const [expectedCloseDate, setExpectedCloseDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isAddDealOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !value) return;

    setIsSubmitting(true);
    try {
      await handleAddDeal({
        title: title.trim(),
        value: Number(value),
        currency: 'JOD',
        contact_id: contactId || undefined,
        stage,
        expected_close_date: expectedCloseDate || undefined,
      });

      setTitle('');
      setValue('');
      setExpectedCloseDate('');
      setIsAddDealOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-otech-dark-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-otech-dark-900 border border-otech-dark-700 rounded-2xl shadow-2xl p-6 overflow-hidden">
        <div className="absolute top-0 start-0 end-0 h-1 bg-gradient-to-r from-otech-blue-500 to-otech-cyan-400" />

        <div className="flex items-center justify-between pb-4 border-b border-otech-dark-700 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-otech-cyan-400/20 text-otech-cyan-400 border border-otech-cyan-400/30">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-lg text-white">إضافة صفقة جديدة للكانبان</h3>
              <p className="text-xs text-slate-400">سجل فرصة بيعية جديدة وحدد قيمتها ومرحلتها في خط المبيعات</p>
            </div>
          </div>
          <button
            onClick={() => setIsAddDealOpen(false)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-otech-dark-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              عنوان الصفقة / الحل البرمجي <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="مثال: منصة إدارة المستودعات والطلبات"
              className="w-full px-3.5 py-2.5 bg-otech-dark-950 border border-otech-dark-700 rounded-xl text-white text-sm focus:border-otech-cyan-400 focus:outline-none transition"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                قيمة الصفقة (دينار أردني د.أ) <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  step="50"
                  required
                  dir="ltr"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder="2500"
                  className="w-full px-3.5 py-2.5 bg-otech-dark-950 border border-otech-dark-700 rounded-xl text-white text-sm font-mono text-end focus:border-otech-cyan-400 focus:outline-none transition pe-14"
                />
                <span className="absolute end-3 top-2.5 text-xs text-slate-400 font-bold pointer-events-none">
                  د.أ
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                العميل المرتبط <span className="text-rose-400">*</span>
              </label>
              <select
                required
                value={contactId}
                onChange={(e) => setContactId(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-otech-dark-950 border border-otech-dark-700 rounded-xl text-white text-sm focus:border-otech-cyan-400 focus:outline-none transition"
              >
                {contacts.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.full_name} ({c.company_name || 'عميل محلي'})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">المرحلة المبدئية</label>
              <select
                value={stage}
                onChange={(e) => setStage(e.target.value as DealStage)}
                className="w-full px-3.5 py-2.5 bg-otech-dark-950 border border-otech-dark-700 rounded-xl text-white text-sm focus:border-otech-cyan-400 focus:outline-none transition"
              >
                <option value="new_lead">عميل جديد (New Lead)</option>
                <option value="contacted">تم التواصل (Contacted)</option>
                <option value="proposal_sent">تقديم العرض (Proposal Sent)</option>
                <option value="won">تم الفوز (Won)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">تاريخ الإغلاق المتوقع</label>
              <input
                type="date"
                dir="ltr"
                value={expectedCloseDate}
                onChange={(e) => setExpectedCloseDate(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-otech-dark-950 border border-otech-dark-700 rounded-xl text-white text-sm focus:border-otech-cyan-400 focus:outline-none transition text-end"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-otech-dark-700">
            <button
              type="button"
              onClick={() => setIsAddDealOpen(false)}
              className="px-4 py-2 text-sm text-slate-400 hover:text-white rounded-xl hover:bg-otech-dark-800 transition"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 text-sm font-semibold text-otech-dark-950 bg-gradient-to-r from-otech-cyan-400 to-otech-blue-400 hover:from-otech-cyan-300 hover:to-otech-blue-300 rounded-xl shadow-glow-cyan transition duration-200 disabled:opacity-50"
            >
              {isSubmitting ? 'جاري الإنشاء...' : 'إضافة الصفقة'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
