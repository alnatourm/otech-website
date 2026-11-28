'use client';

import React from 'react';
import Link from 'next/link';
import { useCrm } from '@/components/crm/CrmContext';
import { CrmBreadcrumb } from '@/components/crm/layout/CrmBreadcrumb';
import { WelcomeOttyBanner } from '@/components/crm/overview/WelcomeOttyBanner';
import { KpiSummaryGrid } from '@/components/crm/overview/KpiSummaryGrid';
import { RecentActivitiesList } from '@/components/crm/overview/RecentActivitiesList';
import { StatusBadge } from '@/components/crm/shared/StatusBadge';
import { Kanban, ArrowRight, UserPlus, Plus } from 'lucide-react';
import type { DealStage } from '@/lib/crm/types';

export default function CrmOverviewPage() {
  const { stats, setIsAddContactOpen, setIsAddDealOpen } = useCrm();

  const stages: { stage: DealStage; label: string; color: string }[] = [
    { stage: 'new_lead', label: 'عميل جديد', color: 'text-sky-400' },
    { stage: 'contacted', label: 'تم التواصل', color: 'text-amber-400' },
    { stage: 'proposal_sent', label: 'تقديم العرض', color: 'text-indigo-400' },
    { stage: 'won', label: 'تم الفوز', color: 'text-emerald-400' },
    { stage: 'lost', label: 'خسارة', color: 'text-rose-400' },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      <CrmBreadcrumb currentTitle="نظرة عامة والمؤشرات" />

      {/* Welcome Banner with OTTY */}
      <WelcomeOttyBanner />

      {/* 4 Core KPI Tiles */}
      <KpiSummaryGrid />

      {/* 2-Column Split: Pipeline Stages Progress & Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Right / 2-Cols: Pipeline Overview by Stages */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-5 border border-otech-dark-700 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-otech-dark-700">
            <div className="flex items-center gap-2">
              <Kanban className="w-4 h-4 text-otech-cyan-400" />
              <h3 className="font-heading font-bold text-sm text-white">
                توزيع خط المبيعات حسب المراحل (Sales Pipeline)
              </h3>
            </div>
            <Link
              href="/admin/crm/deals"
              className="text-xs text-otech-cyan-400 hover:text-otech-cyan-300 font-semibold flex items-center gap-1 transition"
            >
              <span>فتح لوحة الكانبان</span>
              <ArrowRight className="w-3 h-3 rtl:rotate-180" />
            </Link>
          </div>

          <div className="space-y-3 pt-1">
            {stages.map((st) => {
              const data = stats.dealsByStage[st.stage];
              const totalVal = data?.totalValue || 0;
              const count = data?.count || 0;
              const maxVal = Math.max(1, stats.pipelineValue + stats.wonDealsValue);
              const percent = Math.min(100, Math.round((totalVal / maxVal) * 100));

              return (
                <div
                  key={st.stage}
                  className="p-3 rounded-xl bg-otech-dark-950/60 border border-otech-dark-800 space-y-2"
                >
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <StatusBadge stage={st.stage} />
                      <span className="text-slate-400 font-mono text-[11px]">
                        ({count} {count === 1 ? 'صفقة' : 'صفقات'})
                      </span>
                    </div>
                    <span className="font-mono font-bold text-white">
                      {totalVal.toLocaleString()} د.أ
                    </span>
                  </div>

                  <div className="w-full bg-otech-dark-900 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-otech-cyan-400 to-otech-blue-500 h-1.5 rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(4, percent)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Left / 1-Col: Recent Activities */}
        <div className="lg:col-span-1">
          <RecentActivitiesList />
        </div>
      </div>
    </div>
  );
}
