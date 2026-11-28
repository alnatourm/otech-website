'use client';

import React from 'react';
import Image from 'next/image';
import { useCrm } from '../CrmContext';
import { Sparkles, Trophy, CheckCircle, X } from 'lucide-react';

export const WonCelebrationModal: React.FC = () => {
  const { wonCelebrationDeal, setWonCelebrationDeal } = useCrm();

  if (!wonCelebrationDeal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-otech-dark-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-sm bg-otech-dark-900 border-2 border-emerald-400/60 rounded-3xl p-6 text-center shadow-glow-cyan overflow-hidden">
        {/* Glow Top Bar */}
        <div className="absolute top-0 start-0 end-0 h-1.5 bg-gradient-to-r from-emerald-400 via-otech-cyan-400 to-otech-blue-500" />

        <button
          onClick={() => setWonCelebrationDeal(null)}
          className="absolute top-4 end-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-otech-dark-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* OTTY Celebration Avatar */}
        <div className="relative w-28 h-28 mx-auto my-3">
          <Image
            src="/otty.png"
            alt="OTTY Won Celebration"
            width={112}
            height={112}
            className="rounded-full border-4 border-emerald-400 shadow-glow-cyan p-1 bg-otech-dark-850 object-cover animate-bounce"
          />
          <span className="absolute -bottom-1 -end-1 bg-emerald-500 text-white p-1.5 rounded-full shadow-lg">
            <Trophy className="w-4 h-4" />
          </span>
        </div>

        <h3 className="text-xl font-heading font-bold text-white mt-2">مبروك إغلاق الصفقة!</h3>
        <p className="text-xs text-emerald-300 font-medium mt-1">
          أوتي (OTTY) يحتفل بنجاح فريق مبيعات OTECH
        </p>

        <div className="bg-otech-dark-950/80 rounded-2xl p-4 my-4 border border-emerald-500/30">
          <div className="text-xs text-slate-400">قيمة الصفقة المنجزة</div>
          <div className="text-2xl font-mono font-bold text-otech-cyan-400 mt-1">
            {wonCelebrationDeal.value.toLocaleString()} د.أ
          </div>
          <div className="text-xs text-white font-medium mt-2 line-clamp-1">
            {wonCelebrationDeal.title}
          </div>
        </div>

        <button
          onClick={() => setWonCelebrationDeal(null)}
          className="w-full py-2.5 px-4 text-sm font-bold text-otech-dark-950 bg-gradient-to-r from-emerald-400 to-otech-cyan-400 hover:from-emerald-300 hover:to-otech-cyan-300 rounded-xl shadow-glow-cyan transition duration-200"
        >
          رائع! متابعة العمل 🚀
        </button>
      </div>
    </div>
  );
};
