'use client';

import React from 'react';
import Image from 'next/image';
import { useCrm } from '../CrmContext';
import { Sparkles, ArrowRight, UserPlus, Plus } from 'lucide-react';
import Link from 'next/link';

export const WelcomeOttyBanner: React.FC = () => {
  const { setIsAddContactOpen, setIsAddDealOpen, setIsOttyHelpOpen } = useCrm();

  return (
    <div className="glass-card rounded-2xl p-6 border border-otech-cyan-400/30 bg-gradient-to-r from-otech-blue-900/40 via-otech-dark-900 to-otech-dark-950 shadow-glow-cyan">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
        {/* OTTY Avatar + Greetings */}
        <div className="flex items-center gap-4 text-center sm:text-start">
          <div className="relative w-16 h-16 shrink-0 cursor-pointer" onClick={() => setIsOttyHelpOpen(true)}>
            <Image
              src="/otty.png"
              alt="OTTY Mascot"
              width={64}
              height={64}
              className="rounded-2xl border-2 border-otech-cyan-400/60 p-1 shadow-glow-cyan bg-otech-dark-850 object-cover hover:scale-105 transition"
            />
          </div>
          <div>
            <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
              <h2 className="text-lg sm:text-xl font-heading font-bold text-white">
                أهلاً بك في نظام مبيعات OTECH
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-otech-cyan-400/20 text-otech-cyan-300 border border-otech-cyan-400/30">
                OTTY Active
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              جميع الصفقات وجهات الاتصال محدثة ومحفوظة بنظام Supabase السحابي السيادي. خط المبيعات جاهز لتسجيل العملاء الجدد ومتابعة العروض.
            </p>
          </div>
        </div>

        {/* Action Triggers */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setIsAddContactOpen(true)}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-otech-dark-800 hover:bg-otech-dark-700 border border-otech-dark-700 rounded-xl transition"
          >
            + إضافة عميل
          </button>
          <Link
            href="/admin/crm/deals"
            className="px-4 py-2 text-xs font-bold text-otech-dark-950 bg-gradient-to-r from-otech-cyan-400 to-otech-blue-400 hover:from-otech-cyan-300 hover:to-otech-blue-300 rounded-xl shadow-glow-cyan transition flex items-center gap-1.5"
          >
            <span>لوحة الكانبان</span>
            <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
          </Link>
        </div>
      </div>
    </div>
  );
};
