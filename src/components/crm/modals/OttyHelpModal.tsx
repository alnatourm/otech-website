'use client';

import React from 'react';
import Image from 'next/image';
import { useCrm } from '../CrmContext';
import { X, Sparkles, Target, Zap, Clock, ShieldCheck } from 'lucide-react';

export const OttyHelpModal: React.FC = () => {
  const { isOttyHelpOpen, setIsOttyHelpOpen } = useCrm();

  if (!isOttyHelpOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-otech-dark-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-otech-dark-900 border border-otech-cyan-400/40 rounded-3xl p-6 shadow-glow-cyan overflow-hidden">
        <div className="absolute top-0 start-0 end-0 h-1.5 bg-gradient-to-r from-otech-cyan-400 via-otech-blue-500 to-purple-500" />

        <div className="flex items-start justify-between pb-3 border-b border-otech-dark-700">
          <div className="flex items-center gap-3">
            <Image
              src="/otty.png"
              alt="OTTY Mascot"
              width={48}
              height={48}
              className="rounded-xl border border-otech-cyan-400/50 p-1 bg-otech-dark-850 object-cover shadow-glow-cyan"
            />
            <div>
              <h3 className="font-heading font-bold text-base text-white">أوتي (OTTY) — مستشارك البيعي الذكي</h3>
              <p className="text-xs text-otech-cyan-400 font-medium">التميمة الرسمية لشركة OTECH للبرمجيات</p>
            </div>
          </div>
          <button
            onClick={() => setIsOttyHelpOpen(false)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-otech-dark-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3.5 my-5 text-xs text-slate-300">
          <div className="flex items-start gap-2.5 bg-otech-dark-950/60 p-3 rounded-xl border border-otech-dark-700">
            <Zap className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-white block mb-0.5">التواصل في أول 15 دقيقة:</span>
              العملاء المتواصل معهم خلال أول 15 دقيقة من استلام الطلب ترتفع فرصة تحويلهم إلى صفقات رابحة بنسبة 70%.
            </div>
          </div>

          <div className="flex items-start gap-2.5 bg-otech-dark-950/60 p-3 rounded-xl border border-otech-dark-700">
            <Clock className="w-4 h-4 text-otech-cyan-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-white block mb-0.5">متابعة تنبيهات الـ 24 ساعة:</span>
              بطاقات الكانبان الموسومة بـ (تنبيه 24h) تحتاج إلى تحديث فوري لمنع تسرب العميل.
            </div>
          </div>

          <div className="flex items-start gap-2.5 bg-otech-dark-950/60 p-3 rounded-xl border border-otech-dark-700">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-white block mb-0.5">توثيق المكالمات والملاحظات:</span>
              سجل كل مكالمة أو محادثة وتساب عبر أداة التسجيل السريع لضمان وضوح مسار العميل للجميع.
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsOttyHelpOpen(false)}
          className="w-full py-2.5 px-4 text-sm font-bold text-otech-dark-950 bg-gradient-to-r from-otech-cyan-400 to-otech-blue-400 hover:from-otech-cyan-300 hover:to-otech-blue-300 rounded-xl shadow-glow-cyan transition duration-200"
        >
          شكراً يا أوتي، جاهز للبدء!
        </button>
      </div>
    </div>
  );
};
