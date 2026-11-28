'use client';

import React from 'react';
import Link from 'next/link';
import { useCrm } from '../CrmContext';
import { History, Phone, MessageCircle, Calendar, FileText, Mail, ArrowRight } from 'lucide-react';
import type { ActivityType } from '@/lib/crm/types';

export const RecentActivitiesList: React.FC = () => {
  const { activities } = useCrm();

  const getIcon = (type: ActivityType) => {
    switch (type) {
      case 'call':
        return <Phone className="w-3.5 h-3.5 text-sky-400" />;
      case 'whatsapp':
        return <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />;
      case 'meeting':
        return <Calendar className="w-3.5 h-3.5 text-purple-400" />;
      case 'email':
        return <Mail className="w-3.5 h-3.5 text-blue-400" />;
      default:
        return <FileText className="w-3.5 h-3.5 text-amber-400" />;
    }
  };

  const getBadgeStyle = (type: ActivityType) => {
    switch (type) {
      case 'call':
        return 'bg-sky-500/15 border-sky-500/30';
      case 'whatsapp':
        return 'bg-emerald-500/15 border-emerald-500/30';
      case 'meeting':
        return 'bg-purple-500/15 border-purple-500/30';
      case 'email':
        return 'bg-blue-500/15 border-blue-500/30';
      default:
        return 'bg-amber-500/15 border-amber-500/30';
    }
  };

  return (
    <div className="glass-card rounded-2xl p-5 border border-otech-dark-700">
      <div className="flex items-center justify-between pb-4 border-b border-otech-dark-700 mb-4">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-otech-cyan-400" />
          <h3 className="font-heading font-bold text-sm text-white">آخر الأنشطة والتفاعلات</h3>
        </div>
        <Link
          href="/admin/crm/activities"
          className="text-xs text-otech-cyan-400 hover:text-otech-cyan-300 font-semibold flex items-center gap-1 transition"
        >
          <span>عرض الكل</span>
          <ArrowRight className="w-3 h-3 rtl:rotate-180" />
        </Link>
      </div>

      <div className="space-y-3">
        {activities.slice(0, 4).map((item) => (
          <div
            key={item.id}
            className="flex items-start gap-3 p-3 rounded-xl bg-otech-dark-950/60 border border-otech-dark-800 hover:border-otech-dark-700 transition"
          >
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border mt-0.5 ${getBadgeStyle(
                item.type
              )}`}
            >
              {getIcon(item.type)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-white truncate">
                  {item.contact_name || 'جهة اتصال'}
                </span>
                <span className="text-[10px] text-slate-500 font-mono shrink-0">
                  {new Date(item.created_at).toLocaleTimeString('ar-JO', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
