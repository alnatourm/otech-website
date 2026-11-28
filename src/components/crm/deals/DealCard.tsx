'use client';

import React from 'react';
import { useCrm, type ExtendedDeal } from '../CrmContext';
import { Building2, User, Clock, AlertCircle, MoreHorizontal } from 'lucide-react';
import type { DealStage } from '@/lib/crm/types';

interface DealCardProps {
  deal: ExtendedDeal;
}

export const DealCard: React.FC<DealCardProps> = ({ deal }) => {
  const { handleMoveDeal, setIsAddDealOpen } = useCrm();

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', deal.id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const stages: { stage: DealStage; label: string }[] = [
    { stage: 'new_lead', label: 'جديد' },
    { stage: 'contacted', label: 'تواصل' },
    { stage: 'proposal_sent', label: 'عرض سعر' },
    { stage: 'won', label: 'فوز ✓' },
    { stage: 'lost', label: 'خسارة' },
  ];

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className="p-3.5 rounded-xl bg-otech-dark-900/90 border border-otech-dark-700/80 hover:border-otech-cyan-400/50 shadow-md hover:shadow-glow-cyan transition duration-200 cursor-grab active:cursor-grabbing space-y-2.5 group"
    >
      {/* Title & Urgent Badge */}
      <div className="flex items-start justify-between gap-1.5">
        <h4 className="font-heading font-bold text-xs text-white leading-tight line-clamp-2 group-hover:text-otech-cyan-400 transition">
          {deal.title}
        </h4>
        {deal.urgent && (
          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 shrink-0">
            تنبيه 24h
          </span>
        )}
      </div>

      {/* Company & Contact */}
      <div className="space-y-1 text-[11px] text-slate-400">
        <div className="flex items-center gap-1.5 truncate">
          <Building2 className="w-3 h-3 text-otech-cyan-400 shrink-0" />
          <span className="truncate">{deal.company_name || 'شركة محلية'}</span>
        </div>
        <div className="flex items-center gap-1.5 truncate">
          <User className="w-3 h-3 text-slate-500 shrink-0" />
          <span className="truncate">{deal.contact_name || 'عميل'}</span>
        </div>
      </div>

      {/* Value & Stage Switcher */}
      <div className="pt-2 border-t border-otech-dark-800 flex items-center justify-between">
        <span className="font-mono font-bold text-xs text-otech-cyan-400">
          {deal.value.toLocaleString()} <span className="text-[10px] text-slate-400">د.أ</span>
        </span>

        {/* Quick Stage Select for Touch/Mobile */}
        <select
          value={deal.stage}
          onChange={(e) => handleMoveDeal(deal.id, e.target.value as DealStage)}
          className="text-[10px] px-1.5 py-0.5 rounded bg-otech-dark-950 border border-otech-dark-700 text-slate-300 focus:outline-none focus:border-otech-cyan-400"
          title="نقل المرحلة سريعاً"
        >
          {stages.map((s) => (
            <option key={s.stage} value={s.stage}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      {/* Lost reason note if lost */}
      {deal.stage === 'lost' && deal.lost_reason && (
        <div className="text-[10px] text-rose-300 bg-rose-500/10 p-1.5 rounded border border-rose-500/20">
          سبب الخسارة: {deal.lost_reason}
        </div>
      )}
    </div>
  );
};
