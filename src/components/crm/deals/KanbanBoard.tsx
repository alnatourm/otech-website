'use client';

import React, { useState } from 'react';
import { useCrm } from '../CrmContext';
import { DealCard } from './DealCard';
import { Plus, Kanban, Sparkles, Filter } from 'lucide-react';
import type { DealStage } from '@/lib/crm/types';

export const KanbanBoard: React.FC = () => {
  const { stats, handleMoveDeal, setIsAddDealOpen } = useCrm();
  const [activeDragOverStage, setActiveDragOverStage] = useState<DealStage | null>(null);

  const columns: {
    stage: DealStage;
    title: string;
    borderTop: string;
    badgeBg: string;
    badgeText: string;
  }[] = [
    {
      stage: 'new_lead',
      title: 'عميل جديد (New)',
      borderTop: 'border-t-sky-400',
      badgeBg: 'bg-sky-500/15',
      badgeText: 'text-sky-400',
    },
    {
      stage: 'contacted',
      title: 'تم التواصل (Contacted)',
      borderTop: 'border-t-amber-400',
      badgeBg: 'bg-amber-500/15',
      badgeText: 'text-amber-400',
    },
    {
      stage: 'proposal_sent',
      title: 'تقديم العرض (Proposal)',
      borderTop: 'border-t-indigo-400',
      badgeBg: 'bg-indigo-500/15',
      badgeText: 'text-indigo-400',
    },
    {
      stage: 'won',
      title: 'فوز بالصفقة (Won)',
      borderTop: 'border-t-emerald-400',
      badgeBg: 'bg-emerald-500/15',
      badgeText: 'text-emerald-400',
    },
    {
      stage: 'lost',
      title: 'خسارة (Lost)',
      borderTop: 'border-t-rose-500',
      badgeBg: 'bg-rose-500/15',
      badgeText: 'text-rose-400',
    },
  ];

  const handleDragOver = (e: React.DragEvent, stage: DealStage) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (activeDragOverStage !== stage) {
      setActiveDragOverStage(stage);
    }
  };

  const handleDragLeave = (stage: DealStage) => {
    if (activeDragOverStage === stage) {
      setActiveDragOverStage(null);
    }
  };

  const handleDrop = (e: React.DragEvent, targetStage: DealStage) => {
    e.preventDefault();
    setActiveDragOverStage(null);
    const dealId = e.dataTransfer.getData('text/plain');
    if (dealId) {
      handleMoveDeal(dealId, targetStage);
    }
  };

  return (
    <div className="space-y-4">
      {/* Kanban Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 glass-card rounded-2xl p-4 border border-otech-dark-700">
        <div>
          <div className="flex items-center gap-2">
            <Kanban className="w-4 h-4 text-otech-cyan-400" />
            <h2 className="font-heading font-bold text-base text-white">
              لوحة مسار الصفقات التفاعلية (Kanban Pipeline)
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            اسحب البطاقات بين المراحل لتحديث حالة الصفقة فورياً وتوثيق نسب الإغلاق
          </p>
        </div>

        <button
          onClick={() => setIsAddDealOpen(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-otech-dark-950 bg-gradient-to-r from-otech-cyan-400 to-otech-blue-400 hover:from-otech-cyan-300 hover:to-otech-blue-300 rounded-xl shadow-glow-cyan transition duration-200 shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>+ إضافة صفقة جديدة</span>
        </button>
      </div>

      {/* 5-Column Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3.5 items-start overflow-x-auto pb-4 no-scrollbar">
        {columns.map((col) => {
          const colData = stats.dealsByStage[col.stage];
          const isDragOver = activeDragOverStage === col.stage;

          return (
            <div
              key={col.stage}
              onDragOver={(e) => handleDragOver(e, col.stage)}
              onDragLeave={() => handleDragLeave(col.stage)}
              onDrop={(e) => handleDrop(e, col.stage)}
              className={`rounded-2xl border bg-otech-dark-950/70 backdrop-blur-md flex flex-col transition border-t-4 ${
                col.borderTop
              } ${
                isDragOver
                  ? 'border-otech-cyan-400 bg-otech-dark-850/90 shadow-glow-cyan'
                  : 'border-otech-dark-700/80 hover:border-otech-dark-600'
              }`}
            >
              {/* Column Header */}
              <div className="p-3 border-b border-otech-dark-800">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-heading font-bold text-xs text-white">
                    {col.title}
                  </span>
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${col.badgeBg} ${col.badgeText}`}
                  >
                    {colData?.count || 0}
                  </span>
                </div>
                <div className="text-[11px] font-mono font-semibold text-slate-400">
                  الإجمالي: {(colData?.totalValue || 0).toLocaleString()} د.أ
                </div>
              </div>

              {/* Cards List */}
              <div className="p-2.5 space-y-2.5 min-h-[350px]">
                {colData?.deals && colData.deals.length > 0 ? (
                  colData.deals.map((deal) => <DealCard key={deal.id} deal={deal} />)
                ) : (
                  <div className="flex flex-col items-center justify-center h-48 text-center text-xs text-slate-500 border border-dashed border-otech-dark-800 rounded-xl p-4">
                    <span>اسحب صفقة إلى هنا</span>
                    <span className="text-[10px] text-slate-600 mt-1">المرحلة فارغة</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
