'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCrm } from '../CrmContext';
import { Plus, UserPlus, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

export const CrmHeader: React.FC = () => {
  const { setIsAddContactOpen, setIsAddDealOpen, setIsOttyHelpOpen } = useCrm();

  return (
    <header className="border-b border-otech-dark-700 bg-otech-dark-900/90 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand & System Title */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2.5 group transition"
            title="العودة لموقع OTECH الرئيسي"
          >
            <div className="relative w-8 h-8 rounded-lg overflow-hidden border border-otech-cyan-400/40">
              <Image
                src="/otech-logo.jpg"
                alt="OTECH Logo"
                fill
                className="object-cover group-hover:scale-105 transition"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-black text-base tracking-wide text-white group-hover:text-otech-cyan-400 transition">
                  OTECH
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-otech-blue-500/30 text-otech-cyan-400 border border-otech-cyan-400/30">
                  Sales CRM
                </span>
              </div>
              <p className="text-[10px] text-slate-400 -mt-0.5 hidden sm:block">
                نظام إدارة المبيعات والعلاقات المؤسسية الداخلي
              </p>
            </div>
          </Link>
        </div>

        {/* Actions & Rep Badge */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Create Buttons */}
          <button
            onClick={() => setIsAddContactOpen(true)}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-otech-dark-800 hover:bg-otech-dark-700 border border-otech-dark-700 rounded-xl transition"
          >
            <UserPlus className="w-3.5 h-3.5 text-otech-cyan-400" />
            <span>+ جهة اتصال</span>
          </button>

          <button
            onClick={() => setIsAddDealOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-otech-dark-950 bg-gradient-to-r from-otech-cyan-400 to-otech-blue-400 hover:from-otech-cyan-300 hover:to-otech-blue-300 rounded-xl shadow-glow-cyan transition duration-200"
          >
            <Plus className="w-4 h-4" />
            <span>+ صفقة جديدة</span>
          </button>

          {/* OTTY Mascot Interactive Avatar */}
          <div className="ps-2 sm:ps-3 border-s border-otech-dark-700 flex items-center gap-2">
            <button
              onClick={() => setIsOttyHelpOpen(true)}
              className="relative cursor-pointer group"
              title="انقر للتحدث مع التميمة الرسمية OTTY"
            >
              <div className="relative w-9 h-9 rounded-full border border-otech-cyan-400/50 p-0.5 bg-otech-dark-850 shadow-glow-cyan group-hover:scale-105 transition overflow-hidden">
                <Image
                  src="/otty.png"
                  alt="OTTY Mascot"
                  width={36}
                  height={36}
                  className="rounded-full object-cover"
                />
              </div>
              <span className="absolute bottom-0 end-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-otech-dark-900 animate-pulse" />
            </button>

            {/* Sales Rep Info */}
            <div className="hidden md:block text-start">
              <div className="text-xs font-bold text-white leading-tight">فريق المبيعات</div>
              <div className="text-[10px] text-otech-cyan-400">عمّان — مكتب KHBP</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
