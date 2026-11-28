'use client';

import React, { useState } from 'react';
import { useCrm } from '../CrmContext';
import { Phone, MessageCircle, Calendar, FileText, Mail, Send, Sparkles } from 'lucide-react';
import type { ActivityType } from '@/lib/crm/types';

export const ActivityComposer: React.FC = () => {
  const { contacts, handleAddActivity } = useCrm();

  const [contactId, setContactId] = useState(contacts[0]?.id || '');
  const [type, setType] = useState<ActivityType>('call');
  const [subject, setSubject] = useState('');
  const [notes, setNotes] = useState('');
  const [followUp, setFollowUp] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const activityTypes: { type: ActivityType; label: string; icon: React.ReactNode; color: string }[] = [
    { type: 'call', label: 'مكالمة هاتفية', icon: <Phone className="w-4 h-4" />, color: 'sky' },
    { type: 'whatsapp', label: 'محادثة وتساب', icon: <MessageCircle className="w-4 h-4" />, color: 'emerald' },
    { type: 'meeting', label: 'اجتماع حضوري', icon: <Calendar className="w-4 h-4" />, color: 'purple' },
    { type: 'note', label: 'ملاحظة داخلية', icon: <FileText className="w-4 h-4" />, color: 'amber' },
    { type: 'email', label: 'بريد إلكتروني', icon: <Mail className="w-4 h-4" />, color: 'blue' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!notes.trim()) return;

    setIsSubmitting(true);
    try {
      const fullDescription = subject.trim() ? `${subject.trim()}: ${notes.trim()}` : notes.trim();

      await handleAddActivity({
        contact_id: contactId || undefined,
        type,
        description: fullDescription,
        next_follow_up: followUp ? new Date(followUp).toISOString() : undefined,
      });

      setSubject('');
      setNotes('');
      setFollowUp('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="glass-card rounded-2xl p-5 border border-otech-dark-700 shadow-xl">
      <div className="flex items-center gap-2 pb-3 border-b border-otech-dark-700 mb-4">
        <Sparkles className="w-4 h-4 text-otech-cyan-400" />
        <h3 className="font-heading font-bold text-sm text-white">تسجيل تفاعل أو نشاط سريع</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Type Selector Tabs */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-2">نوع النشاط</label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {activityTypes.map((item) => (
              <button
                key={item.type}
                type="button"
                onClick={() => setType(item.type)}
                className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-bold transition border ${
                  type === item.type
                    ? 'bg-otech-blue-500/25 border-otech-cyan-400 text-otech-cyan-400 shadow-glow-cyan'
                    : 'bg-otech-dark-950/80 border-otech-dark-700 text-slate-400 hover:text-white hover:bg-otech-dark-850'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Contact Selector & Subject */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">العميل المستهدف</label>
            <select
              value={contactId}
              onChange={(e) => setContactId(e.target.value)}
              className="w-full px-3 py-2 bg-otech-dark-950 border border-otech-dark-700 rounded-xl text-white text-xs focus:border-otech-cyan-400 focus:outline-none transition"
            >
              {contacts.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.full_name} ({c.company_name || 'عميل محلي'})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">موضوع النشاط</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="مثال: مناقشة مسودة عرض الأسعار..."
              className="w-full px-3 py-2 bg-otech-dark-950 border border-otech-dark-700 rounded-xl text-white text-xs focus:border-otech-cyan-400 focus:outline-none transition"
            />
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">
            تفاصيل ومخرجات التفاعل <span className="text-rose-400">*</span>
          </label>
          <textarea
            rows={2}
            required
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="سجل ما تم الاتفاق عليه، النقاط المهمة، وأي متطلبات جديدة..."
            className="w-full px-3 py-2 bg-otech-dark-950 border border-otech-dark-700 rounded-xl text-white text-xs focus:border-otech-cyan-400 focus:outline-none transition resize-none"
          />
        </div>

        {/* Follow up & Submit */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2">
            <label className="text-xs text-slate-400 whitespace-nowrap">موعد المتابعة القادمة:</label>
            <input
              type="datetime-local"
              dir="ltr"
              value={followUp}
              onChange={(e) => setFollowUp(e.target.value)}
              className="px-2.5 py-1.5 bg-otech-dark-950 border border-otech-dark-700 rounded-lg text-white text-xs focus:border-otech-cyan-400 focus:outline-none transition text-end"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !notes.trim()}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold text-otech-dark-950 bg-gradient-to-r from-otech-cyan-400 to-otech-blue-400 hover:from-otech-cyan-300 hover:to-otech-blue-300 rounded-xl shadow-glow-cyan transition duration-200 disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isSubmitting ? 'جاري الحفظ...' : 'حفظ في السجل'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
