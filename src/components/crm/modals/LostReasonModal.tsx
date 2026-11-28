'use client';

import React, { useState } from 'react';
import { useCrm } from '../CrmContext';
import { AlertTriangle, X } from 'lucide-react';

export const LostReasonModal: React.FC = () => {
  const { pendingLostDeal, setPendingLostDeal, handleConfirmLost } = useCrm();

  const [reason, setReason] = useState('الميزانية غير كافية حالياً للمشروع');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!pendingLostDeal) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason) return;

    setIsSubmitting(true);
    try {
      await handleConfirmLost(pendingLostDeal.id, reason, notes.trim());
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-otech-dark-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-otech-dark-900 border-2 border-rose-500/50 rounded-2xl shadow-2xl p-6 overflow-hidden">
        {/* Glow Accent */}
        <div className="absolute top-0 start-0 end-0 h-1.5 bg-gradient-to-r from-rose-500 to-amber-500" />

        <div className="flex items-center justify-between pb-3 border-b border-otech-dark-700 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-base text-white">توثيق سبب خسارة الصفقة</h3>
              <p className="text-xs text-rose-300 font-medium">إجراء إلزامي حسب معايير SOP v1.0 للتحليل البيعي</p>
            </div>
          </div>
          <button
            onClick={() => setPendingLostDeal(null)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-otech-dark-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="bg-otech-dark-950/60 p-3 rounded-xl border border-otech-dark-700 mb-4">
          <div className="text-xs text-slate-400">الصفقة المستهدفة:</div>
          <div className="font-heading font-bold text-sm text-white mt-0.5">{pendingLostDeal.title}</div>
          <div className="text-xs text-otech-cyan-400 mt-1 font-mono font-semibold">
            القيمة: {pendingLostDeal.value.toLocaleString()} د.أ
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              السبب الرئيسي للخسارة <span className="text-rose-400">*</span>
            </label>
            <select
              required
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2.5 bg-otech-dark-950 border border-otech-dark-700 rounded-xl text-white text-sm focus:border-rose-400 focus:outline-none transition"
            >
              <option value="الميزانية غير كافية حالياً للمشروع">الميزانية غير كافية حالياً للمشروع</option>
              <option value="تم اختيار منافس محلي أو خارجي">تم اختيار منافس محلي أو خارجي</option>
              <option value="تأجيل المشروع أو تجميد الخطة الاستثمارية">تأجيل المشروع أو تجميد الخطة الاستثمارية</option>
              <option value="انقطاع الاتصال وعدم التجاوب بعد إرسال العرض">انقطاع الاتصال وعدم التجاوب بعد إرسال العرض</option>
              <option value="عدم توفر متطلبات تقنية استثنائية خارج نطاقنا">عدم توفر متطلبات تقنية استثنائية خارج نطاقنا</option>
              <option value="أسباب أخرى">أسباب أخرى (يرجى التوضيح)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">تفاصيل إضافية / دروس مستفادة</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="سجل ملاحظة سريعة تفيد الفريق في تطوير استراتيجيات العروض القادمة..."
              className="w-full px-3 py-2 bg-otech-dark-950 border border-otech-dark-700 rounded-xl text-white text-sm focus:border-rose-400 focus:outline-none transition resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-otech-dark-700">
            <button
              type="button"
              onClick={() => setPendingLostDeal(null)}
              className="px-4 py-2 text-sm text-slate-400 hover:text-white rounded-xl hover:bg-otech-dark-800 transition"
            >
              إلغاء والتراجع
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !reason}
              className="px-4 py-2 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-xl transition duration-200 disabled:opacity-50"
            >
              {isSubmitting ? 'جاري التأكيد...' : 'تأكيد خسارة الصفقة'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
