'use client';

import React from 'react';
import { useCrm } from '../CrmContext';
import { Phone, MessageCircle, Calendar, FileText, Mail, CalendarClock, CheckCircle } from 'lucide-react';
import type { ActivityType } from '@/lib/crm/types';

export const ActivityTimeline: React.FC = () => {
  const { activities } = useCrm();

  const typeConfig: Record<
    ActivityType,
    { label: string; icon: React.ReactNode; badgeClass: string; borderClass: string }
  > = {
    call: {
      label: 'مكالمة هاتفية',
      icon: <Phone className="w-3.5 h-3.5 text-sky-400" />,
      badgeClass: 'bg-sky-500/15 text-sky-400 border-sky-500/30',
      borderClass: 'hover:border-sky-500/40',
    },
    whatsapp: {
      label: 'محادثة وتساب',
      icon: <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />,
      badgeClass: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
      borderClass: 'hover:border-emerald-500/40',
    },
    meeting: {
      label: 'اجتماع حضوري',
      icon: <Calendar className="w-3.5 h-3.5 text-purple-400" />,
      badgeClass: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
      borderClass: 'hover:border-purple-500/40',
    },
    note: {
      label: 'ملاحظة داخلية',
      icon: <FileText className="w-3.5 h-3.5 text-amber-400" />,
      badgeClass: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
      borderClass: 'hover:border-amber-500/40',
    },
    email: {
      label: 'بريد إلكتروني',
      icon: <Mail className="w-3.5 h-3.5 text-blue-400" />,
      badgeClass: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
      borderClass: 'hover:border-blue-500/40',
    },
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-otech-dark-700">
        <h3 className="font-heading font-bold text-sm text-white">
          الخط الزمني الموحد للأنشطة والمتابعات
        </h3>
        <span className="text-xs font-mono text-slate-400">
          إجمالي الأنشطة: {activities.length}
        </span>
      </div>

      {activities.length === 0 ? (
        <div className="p-8 text-center text-xs text-slate-500 border border-dashed border-otech-dark-800 rounded-2xl glass-card">
          لا توجد تفاعلات أو أنشطة مسجلة في الخط الزمني حتى الآن.
        </div>
      ) : (
        <div className="relative border-s-2 border-otech-dark-700 ms-3 space-y-6 pt-2">
        {activities.map((item) => {
          const cfg = typeConfig[item.type] || typeConfig.note;
          const createdDate = new Date(item.created_at);

          return (
            <div key={item.id} className="relative ps-6 group">
              {/* Timeline Node Icon */}
              <div
                className={`absolute -start-[17px] top-1 w-8 h-8 rounded-full border-2 flex items-center justify-center bg-otech-dark-900 shadow-lg ${cfg.badgeClass}`}
              >
                {cfg.icon}
              </div>

              {/* Activity Card */}
              <div
                className={`glass-card rounded-2xl p-4 border border-otech-dark-700 transition ${cfg.borderClass}`}
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold border ${cfg.badgeClass}`}
                    >
                      {cfg.label}
                    </span>
                    <span className="font-heading font-bold text-xs text-white">
                      {item.contact_name || 'جهة اتصال'}
                    </span>
                  </div>

                  <span className="font-mono text-[10px] text-slate-400">
                    {createdDate.toLocaleDateString('ar-JO')} •{' '}
                    {createdDate.toLocaleTimeString('ar-JO', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed bg-otech-dark-950/60 p-3 rounded-xl border border-otech-dark-800/80">
                  {item.description}
                </p>

                {/* Footer Follow-up indicator */}
                <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
                  {item.next_follow_up ? (
                    <span className="flex items-center gap-1.5 text-otech-cyan-400 font-medium">
                      <CalendarClock className="w-3.5 h-3.5" />
                      <span>
                        متابعة مجدولة:{' '}
                        {new Date(item.next_follow_up).toLocaleString('ar-JO', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-emerald-400 font-medium">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>تم توثيق النشاط</span>
                    </span>
                  )}

                  <span>بواسطة: {item.created_by_name || 'مسؤول المبيعات'}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      )}
    </div>
  );
};
