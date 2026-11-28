import React from 'react';
import type { LeadSource } from '@/lib/crm/types';
import { Globe, MessageCircle, Phone, Users, Megaphone, Share2, MoreHorizontal } from 'lucide-react';

interface SourceBadgeProps {
  source: LeadSource;
  className?: string;
}

export const SourceBadge: React.FC<SourceBadgeProps> = ({ source, className = '' }) => {
  const config: Record<LeadSource, { label: string; icon: React.ReactNode; color: string }> = {
    website: {
      label: 'الموقع',
      icon: <Globe className="w-3 h-3 me-1" />,
      color: 'bg-otech-blue-500/15 text-otech-cyan-400 border-otech-blue-500/30',
    },
    whatsapp: {
      label: 'وتساب',
      icon: <MessageCircle className="w-3 h-3 me-1 text-emerald-400" />,
      color: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    },
    phone: {
      label: 'اتصال',
      icon: <Phone className="w-3 h-3 me-1 text-amber-400" />,
      color: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    },
    referral: {
      label: 'معارف',
      icon: <Users className="w-3 h-3 me-1 text-purple-400" />,
      color: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
    },
    ads: {
      label: 'إعلانات',
      icon: <Megaphone className="w-3 h-3 me-1 text-pink-400" />,
      color: 'bg-pink-500/15 text-pink-300 border-pink-500/30',
    },
    social_media: {
      label: 'شبكات اجتماعية',
      icon: <Share2 className="w-3 h-3 me-1 text-blue-400" />,
      color: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
    },
    other: {
      label: 'أخرى',
      icon: <MoreHorizontal className="w-3 h-3 me-1 text-slate-400" />,
      color: 'bg-slate-500/15 text-slate-300 border-slate-500/30',
    },
  };

  const item = config[source] || config.other;

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium border ${item.color} ${className}`}
    >
      {item.icon}
      {item.label}
    </span>
  );
};
