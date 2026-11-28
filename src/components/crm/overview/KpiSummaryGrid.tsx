'use client';

import React from 'react';
import { useCrm } from '../CrmContext';
import { Users, TrendingUp, Trophy, Percent, ArrowUpRight } from 'lucide-react';

export const KpiSummaryGrid: React.FC = () => {
  const { stats } = useCrm();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Total Leads */}
      <div className="glass-card rounded-2xl p-5 border border-otech-dark-700 hover:border-otech-cyan-400/50 transition">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-400">إجمالي جهات الاتصال</span>
          <div className="w-8 h-8 rounded-xl bg-otech-blue-500/15 text-otech-cyan-400 flex items-center justify-center">
            <Users className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-bold font-mono text-white mb-1">
          {stats.totalContacts}
        </div>
        <div className="flex items-center text-xs text-emerald-400 gap-1 font-medium">
          <ArrowUpRight className="w-3.5 h-3.5" />
          <span>+14% مقارنة بالشهر السابق</span>
        </div>
      </div>

      {/* 2. Pipeline Value */}
      <div className="glass-card rounded-2xl p-5 border border-otech-dark-700 hover:border-otech-cyan-400/50 transition">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-400">قيمة مسار الصفقات النشطة</span>
          <div className="w-8 h-8 rounded-xl bg-otech-cyan-400/15 text-otech-cyan-400 flex items-center justify-center">
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-bold font-mono text-otech-cyan-400 mb-1">
          {stats.pipelineValue.toLocaleString()} <span className="text-sm font-sans font-bold text-slate-400">د.أ</span>
        </div>
        <div className="text-xs text-slate-400">
          في مراحل: عميل جديد، تواصل، عروض أسعار
        </div>
      </div>

      {/* 3. Won Deals */}
      <div className="glass-card rounded-2xl p-5 border border-otech-dark-700 hover:border-emerald-500/50 transition">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-400">الصفقات المغلقة بنجاح</span>
          <div className="w-8 h-8 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center">
            <Trophy className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-bold font-mono text-emerald-400 mb-1">
          {stats.wonDealsCount} <span className="text-xs font-normal text-slate-400 font-sans">صفقة</span>
        </div>
        <div className="text-xs text-emerald-400 font-mono font-semibold">
          بقيمة: {stats.wonDealsValue.toLocaleString()} د.أ
        </div>
      </div>

      {/* 4. Win Rate */}
      <div className="glass-card rounded-2xl p-5 border border-otech-dark-700 hover:border-purple-400/50 transition">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-400">نسبة تحويل الصفقات (Win Rate)</span>
          <div className="w-8 h-8 rounded-xl bg-purple-500/15 text-purple-400 flex items-center justify-center">
            <Percent className="w-4 h-4" />
          </div>
        </div>
        <div className="text-2xl font-bold font-mono text-purple-300 mb-1">
          {stats.winRate}%
        </div>
        <div className="w-full bg-otech-dark-800 rounded-full h-1.5 mt-2 overflow-hidden">
          <div
            className="bg-gradient-to-r from-purple-500 to-otech-cyan-400 h-1.5 rounded-full"
            style={{ width: `${Math.min(100, Math.max(5, stats.winRate))}%` }}
          />
        </div>
      </div>
    </div>
  );
};
