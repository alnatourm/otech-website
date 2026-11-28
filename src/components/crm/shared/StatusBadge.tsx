import React from 'react';
import type { LeadStatus, DealStage } from '@/lib/crm/types';

interface StatusBadgeProps {
  status?: LeadStatus;
  stage?: DealStage;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, stage, className = '' }) => {
  if (status) {
    const config: Record<LeadStatus, { label: string; bg: string; text: string; border: string }> = {
      new: {
        label: 'جديد',
        bg: 'bg-sky-500/10',
        text: 'text-sky-400',
        border: 'border-sky-500/30',
      },
      contacted: {
        label: 'تم التواصل',
        bg: 'bg-amber-500/10',
        text: 'text-amber-400',
        border: 'border-amber-500/30',
      },
      qualified: {
        label: 'مؤهل',
        bg: 'bg-emerald-500/10',
        text: 'text-emerald-400',
        border: 'border-emerald-500/30',
      },
      unqualified: {
        label: 'غير مؤهل',
        bg: 'bg-rose-500/10',
        text: 'text-rose-400',
        border: 'border-rose-500/30',
      },
    };

    const c = config[status] || config.new;
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${c.bg} ${c.text} ${c.border} ${className}`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-current me-1.5 animate-pulse" />
        {c.label}
      </span>
    );
  }

  if (stage) {
    const stageConfig: Record<DealStage, { label: string; bg: string; text: string; border: string }> = {
      new_lead: {
        label: 'عميل جديد',
        bg: 'bg-sky-500/15',
        text: 'text-sky-400',
        border: 'border-sky-500/40',
      },
      contacted: {
        label: 'تم التواصل',
        bg: 'bg-amber-500/15',
        text: 'text-amber-400',
        border: 'border-amber-500/40',
      },
      proposal_sent: {
        label: 'عرض سعر',
        bg: 'bg-indigo-500/15',
        text: 'text-indigo-400',
        border: 'border-indigo-500/40',
      },
      won: {
        label: 'تم الفوز ✓',
        bg: 'bg-emerald-500/15',
        text: 'text-emerald-400',
        border: 'border-emerald-500/40',
      },
      lost: {
        label: 'خسارة',
        bg: 'bg-rose-500/15',
        text: 'text-rose-400',
        border: 'border-rose-500/40',
      },
    };

    const sc = stageConfig[stage] || stageConfig.new_lead;
    return (
      <span
        className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold border ${sc.bg} ${sc.text} ${sc.border} ${className}`}
      >
        {sc.label}
      </span>
    );
  }

  return null;
};
