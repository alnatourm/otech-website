'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useCrm } from '../CrmContext';
import { createClient } from '@/lib/supabase/client';
import { loginAdmin } from '@/lib/actions/auth';
import {
  X,
  Lock,
  Mail,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  Loader2,
  ShieldCheck,
} from 'lucide-react';

export const LoginModal: React.FC = () => {
  const { isLoginModalOpen, setIsLoginModalOpen, refreshData, setCurrentUser } = useCrm();

  const [email, setEmail] = useState('sales@o-tech.space');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isLoginModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const cleanEmail = email.trim();
    if (!cleanEmail || !password) {
      setErrorMessage('يرجى إدخال البريد الإلكتروني وكلمة المرور.');
      return;
    }

    setIsLoading(true);

    try {
      const supabase = createClient();

      // 1. Authenticate with browser client
      const { data: browserAuthData, error: browserError } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password,
      });

      // 2. Authenticate with Server Action to sync cookieStore
      const serverResult = await loginAdmin({
        email: cleanEmail,
        password,
      });

      if (browserError && !serverResult.success) {
        const msg =
          browserError.message === 'Invalid login credentials'
            ? 'بيانات الدخول غير صحيحة. يرجى التحقق من البريد وكلمة المرور.'
            : browserError.message;
        setErrorMessage(msg);
        setIsLoading(false);
        return;
      }

      setSuccessMessage('تم تسجيل الدخول بنجاح! جاري مزامنة البيانات...');

      if (setCurrentUser) {
        setCurrentUser({
          id: browserAuthData?.user?.id || serverResult.data?.id || 'admin',
          email: browserAuthData?.user?.email || serverResult.data?.email || cleanEmail,
        });
      }

      // Re-fetch CRM data from Supabase
      await refreshData();

      setTimeout(() => {
        setIsLoginModalOpen(false);
        setIsLoading(false);
      }, 600);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'حدث خطأ غير متوقع أثناء تسجيل الدخول.';
      setErrorMessage(msg);
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-otech-dark-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-otech-dark-900 border border-otech-dark-700/80 rounded-2xl p-6 sm:p-8 shadow-2xl overflow-hidden font-tajawal">
        {/* Glow accent */}
        <div className="absolute -top-16 -end-16 w-36 h-36 bg-otech-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Close button */}
        <button
          onClick={() => setIsLoginModalOpen(false)}
          className="absolute top-4 end-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-otech-dark-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header & OTTY Mascot */}
        <div className="flex items-center gap-3.5 mb-5 pb-4 border-b border-otech-dark-800">
          <div className="relative w-12 h-12 rounded-full border border-otech-cyan-400/60 p-0.5 bg-otech-dark-850 shadow-glow-cyan shrink-0">
            <Image
              src="/otty.png"
              alt="OTTY Mascot"
              width={44}
              height={44}
              className="rounded-full object-cover"
            />
            <span className="absolute bottom-0 end-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-otech-dark-900" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white">تسجيل دخول الـ CRM</h3>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-otech-blue-500/30 text-otech-cyan-400 border border-otech-cyan-400/30">
                Auth
              </span>
            </div>
            <p className="text-xs text-slate-400">
              يرجى تسجيل الدخول لعرض وتحديث جهات الاتصال والصفقات المخزنة
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMessage && (
            <div className="p-3 bg-rose-500/15 border border-rose-500/30 rounded-xl flex items-start gap-2.5 text-rose-300 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3 bg-emerald-500/15 border border-emerald-500/30 rounded-xl flex items-center gap-2 text-emerald-300 text-xs">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300">
              البريد الإلكتروني
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 start-0 ps-3 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4 text-otech-cyan-400" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="sales@o-tech.space"
                className="w-full ps-10 pe-3 py-2 text-sm bg-otech-dark-800 border border-otech-dark-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-otech-cyan-400 focus:ring-1 focus:ring-otech-cyan-400 transition font-mono dir-ltr text-start"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300">
              كلمة المرور
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 start-0 ps-3 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4 text-otech-cyan-400" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••••••"
                className="w-full ps-10 pe-10 py-2 text-sm bg-otech-dark-800 border border-otech-dark-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-otech-cyan-400 focus:ring-1 focus:ring-otech-cyan-400 transition dir-ltr text-start"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 end-0 pe-3 flex items-center text-slate-400 hover:text-slate-200 transition"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-bold text-otech-dark-950 bg-gradient-to-r from-otech-cyan-400 to-otech-blue-400 hover:from-otech-cyan-300 hover:to-otech-blue-300 rounded-xl shadow-glow-cyan transition duration-200 disabled:opacity-60 cursor-pointer disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>جاري تسجيل الدخول...</span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                <span>تسجيل الدخول والمتابعة</span>
              </>
            )}
          </button>

          <p className="text-center text-[11px] text-slate-500 pt-1">
            الحساب المعتمد: <span className="font-mono text-slate-400">sales@o-tech.space</span>
          </p>
        </form>
      </div>
    </div>
  );
};